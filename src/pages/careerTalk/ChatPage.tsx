import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { ChevronLeft } from "lucide-react";
import { getCareerTalkDetail } from "../../apis/careerTalk";
import palette from "../../styles/theme";
import sendIcon from "../../assets/chat_send.png";

interface ChatMessage {
  messageId?: number;
  chattingRoomId?: number;
  content: string;
  senderId?: number | null;
  anonymousName?: string | null; // "작성자"/"익명N"
  sentAt: string; // ISO
}

interface ChatMessageOut {
  chattingRoomId: number;
  content: string;
}

const SUB_BASE = "/sub/chats";
const PUB_SEND = "/pub/chats/send";

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ----- state -----
  const [roomId, setRoomId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [logs, setLogs] = useState<ChatMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 작성자 여부 / 소유자 정보 / 내 익명명 / 제목
  const [myId, setMyId] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null); // 숫자 id 지원
  const [isOwner, setIsOwner] = useState<boolean>(false); // boolean 지원
  const [myAlias, setMyAlias] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("채팅");

  // refs
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const lastConnectRoomRef = useRef<string | null>(null);
  const lastSubRoomRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // env
  const base = (import.meta.env.VITE_SERVER_API_URL ?? "").replace(/\/$/, "");
  const prefix = (import.meta.env.VITE_WS_PREFIX ?? "").replace(/\/?$/, "");

  // ----- helpers -----
  const normalize = (raw: any): ChatMessage => ({
    messageId: raw.messageId ?? raw.id,
    chattingRoomId: raw.chattingRoomId,
    content: raw.content ?? "",
    senderId: raw.senderId ?? null,
    anonymousName: raw.anonymousName ?? null,
    sentAt: raw.sentAt ?? raw.createdAt ?? new Date().toISOString(),
  });

  // 익명 라벨 캐싱
  const aliasMapRef = useRef<Map<string, string>>(new Map());
  const nextAliasRef = useRef<number>(1);
  const resolveDisplayName = useCallback((m: ChatMessage) => {
    if (m.anonymousName) return m.anonymousName;
    const key = String(m.senderId ?? `noid-${m.messageId ?? m.sentAt}`);
    if (aliasMapRef.current.has(key)) return aliasMapRef.current.get(key)!;
    const alias = `익명${nextAliasRef.current++}`;
    aliasMapRef.current.set(key, alias);
    return alias;
  }, []);

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}년 ${m}월 ${day}일`;
  };

  // 날짜별로 그룹핑 + 시간순 정렬
  const sections = useMemo(() => {
    const sorted = [...logs].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );
    const map = new Map<string, ChatMessage[]>();
    for (const m of sorted) {
      const key = formatDateLabel(m.sentAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries());
  }, [logs]);

  // ----- WS handlers -----
  const handleIncoming = useCallback((frame: IMessage) => {
    try {
      const raw = JSON.parse(frame.body);
      const msg = normalize(raw);
      setLogs((prev) => [...prev, msg]);
    } catch (e) {
      console.error("Failed to parse message", e);
    }
  }, []);

  const joinRoom = useCallback(
    async (rid: string) => {
      const url = `${base}/api/v1/careertalks/${encodeURIComponent(rid)}/join`;
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { accept: "application/json" },
      });
      if (!(res.ok || res.status === 201)) {
        const text = await res.text().catch(() => "");
        throw new Error(`방 참여 실패 (${res.status}) ${text}`);
      }
      // 내 익명명(alias) 파싱(있으면)
      try {
        const data = await res.clone().json();
        const alias =
          data?.result?.anonymousName ??
          data?.anonymousName ??
          data?.result?.nickname;
        if (alias) setMyAlias(String(alias));
      } catch {
        /* ignore */
      }
    },
    [base]
  );

  const fetchMessages = useCallback(
    async (cursor?: number) => {
      if (!roomId) return;
      try {
        const url = new URL(
          `${base}/api/v1/careertalks/${encodeURIComponent(roomId)}/messages`
        );
        url.searchParams.set("size", "50");
        if (cursor) url.searchParams.set("cursor", String(cursor));
        const res = await fetch(url.toString(), {
          headers: { accept: "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          setError(`메시지 조회 실패 (${res.status})`);
          console.error("[GET MESSAGES FAIL]", res.status, text.slice(0, 300));
          return;
        }
        const data = await res.json().catch(() => null);
        const listRaw: any[] = data?.result?.chatMessageList ?? [];
        const list = listRaw.map(normalize);
        setLogs(list);
      } catch (e) {
        console.error("메시지 조회 실패", e);
        setError("메시지 조회 중 오류");
      }
    },
    [base, roomId]
  );

  const connect = useCallback(async () => {
    if (isConnected || isConnecting) return;
    if (!roomId) {
      setError("roomId가 필요합니다.");
      return;
    }
    if (lastConnectRoomRef.current === roomId) return;
    lastConnectRoomRef.current = roomId;

    setError(null);
    setIsConnecting(true);
    try {
      await joinRoom(roomId);
      const client = new Client({
        webSocketFactory: () => new SockJS(`${base}${prefix}/wss`),
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: (msg) => console.log("[STOMP]", msg),
        onConnect: () => {
          setIsConnecting(false);
          setIsConnected(true);
          try {
            subscriptionRef.current?.unsubscribe();
          } catch {}
          subscriptionRef.current = client.subscribe(
            `${SUB_BASE}/${roomId}`,
            handleIncoming
          );
          lastSubRoomRef.current = roomId;
          void fetchMessages();
        },
        onStompError: (frame) => {
          setIsConnecting(false);
          let bodyText = "";
          try {
            if ((frame as any).binaryBody?.length) {
              bodyText = new TextDecoder("utf-8").decode(
                (frame as any).binaryBody
              );
            } else if (typeof frame.body === "string") {
              bodyText = frame.body;
            }
          } catch {}
          setError(
            (frame.headers["message"] as string) || bodyText || "STOMP error"
          );
        },
        onWebSocketClose: () => {
          setIsConnected(false);
        },
      });
      clientRef.current = client;
      client.activate();
    } catch (e: any) {
      setIsConnecting(false);
      setError(e?.message || "연결 실패");
    }
  }, [
    base,
    prefix,
    isConnected,
    isConnecting,
    roomId,
    joinRoom,
    fetchMessages,
    handleIncoming,
  ]);

  // ----- effects -----
  // 정리
  useEffect(() => {
    return () => {
      try {
        subscriptionRef.current?.unsubscribe();
      } catch {}
      subscriptionRef.current = null;
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setIsConnected(false);
      lastConnectRoomRef.current = null;
      lastSubRoomRef.current = null;
    };
  }, []);

  // ✅ URL 파라미터: roomId + 작성자 여부 + ownerId + (제목 title / postId 둘 중 하나)
  useEffect(() => {
    const r = searchParams.get("roomId");
    if (r && r !== roomId) setRoomId(r);

    const ownerRaw =
      searchParams.get("isOwner") ??
      searchParams.get("owner") ??
      searchParams.get("ownerId");
    if (ownerRaw) {
      if (/^(true|1|yes)$/i.test(ownerRaw)) setIsOwner(true);
      if (/^(false|0|no)$/i.test(ownerRaw)) setIsOwner(false);
      if (/^\d+$/.test(ownerRaw)) setOwnerId(Number(ownerRaw));
    }

    // 제목 우선순위: ?title → 없으면 postId로 fetch
    const qpTitle = searchParams.get("title");
    if (qpTitle && qpTitle.trim()) {
      setTitle(qpTitle);
    } else {
      const postIdRaw = searchParams.get("postId");
      if (postIdRaw && /^\d+$/.test(postIdRaw)) {
        const pid = Number(postIdRaw);
        (async () => {
          try {
            const data = await getCareerTalkDetail(pid);
            const t = (data as any)?.result?.title ?? (data as any)?.title;
            if (t) setTitle(String(t));

            // 보강: 상세 응답에 있으면 함께 세팅
            const chatroomId =
              (data as any)?.result?.chatroomId ?? (data as any)?.chatroomId;
            if (chatroomId && !roomId) setRoomId(String(chatroomId));

            const isAuthor =
              (data as any)?.result?.isAuthor ?? (data as any)?.isAuthor;
            if (typeof isAuthor === "boolean") setIsOwner(isAuthor);

            const ownerFromDetail =
              (data as any)?.result?.author?.id ?? (data as any)?.author?.id;
            if (ownerFromDetail) setOwnerId(Number(ownerFromDetail));
          } catch (e) {
            console.warn("[title fetch] failed", e);
          }
        })();
      }
    }
  }, [searchParams, roomId]);

  // 내 정보
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${base}/api/v1/members/me`, {
          credentials: "include",
          headers: { accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        const idRaw =
          data?.id ??
          data?.result?.id ??
          data?.result?.memberId ??
          data?.memberId;
        const parsed = Number(idRaw);
        if (!Number.isNaN(parsed)) setMyId(parsed);
      } catch (e) {
        console.warn("[myInfo] fetch failed", e);
      }
    })();
  }, [base]);

  // 자동 연결
  useEffect(() => {
    if (roomId && !isConnected && !isConnecting) void connect();
  }, [roomId, isConnected, isConnecting, connect]);

  // roomId 변경 시 재구독
  useEffect(() => {
    const client = clientRef.current;
    if (!client?.connected) return;
    if (lastSubRoomRef.current === roomId) return;
    try {
      subscriptionRef.current?.unsubscribe();
    } catch {}
    subscriptionRef.current = client.subscribe(
      `${SUB_BASE}/${roomId}`,
      handleIncoming
    );
    lastSubRoomRef.current = roomId;
    void fetchMessages();
  }, [roomId, handleIncoming, fetchMessages]);

  // 새 메시지 들어오면 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logs]);

  // ----- actions -----
  const send = useCallback(() => {
    const client = clientRef.current;
    if (!client?.connected) return;
    const text = message.trim();
    if (!roomId || !text) return;

    const payload: ChatMessageOut = {
      chattingRoomId: Number(roomId),
      content: text,
    };

    const receiptId = `send-${Date.now()}`;
    client.watchForReceipt(receiptId, () => {
      setTimeout(() => void fetchMessages(), 300);
    });

    try {
      client.publish({
        destination: PUB_SEND,
        headers: {
          "content-type": "application/json;charset=utf-8",
          receipt: receiptId,
        },
        body: JSON.stringify(payload),
      });

      // 낙관적 반영
      const iAmOwner =
        isOwner || (myId != null && ownerId != null && myId === ownerId);
      setLogs((prev) => [
        ...prev,
        {
          chattingRoomId: Number(roomId),
          content: text,
          messageId: Date.now(),
          senderId: myId ?? -1,
          anonymousName: iAmOwner ? "작성자" : myAlias ?? null,
          sentAt: new Date().toISOString(),
        },
      ]);
      setMessage("");
    } catch (e) {
      console.error("[SEND] publish threw", e);
    }
  }, [roomId, message, fetchMessages, myId, myAlias, ownerId, isOwner]);

  const isMine = useCallback(
    (m: ChatMessage) => {
      if (myId != null && m.senderId === myId) return true; // WS/낙관
      if (isOwner && m.anonymousName === "작성자") return true;
      if (
        myId != null &&
        ownerId != null &&
        myId === ownerId &&
        m.anonymousName === "작성자"
      )
        return true;
      if (!isOwner && myAlias && m.anonymousName === myAlias) return true;
      return false;
    },
    [myId, ownerId, myAlias, isOwner]
  );

  // ----- UI -----
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* 상단 헤더 */}
      <div className="absolute top-[18px] left-4">
        <button className="cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color={palette.gray.default} />
        </button>
      </div>

      <strong
        className="text-[18px] font-[Pretendard] leading-none text-center mt-[20px] px-4"
        style={{ color: palette.gray.dark }}
      >
        {title}
      </strong>
      <div
        className="border-b mt-[20px]"
        style={{ borderColor: palette.gray.default }}
      />
      {/* 오류 안내 */}
      {error && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b">
          {error}
        </div>
      )}

      {/* 메시지 리스트 */}
      <main className="flex-1 px-4 py-3 overflow-y-auto">
        {sections.map(([dateLabel, items]) => (
          <div key={dateLabel} className="mb-4 mt-[10px]">
            <div className="my-6 px-1">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#555555]" />
                <span className="text-[14px] leading-none text-[#555555] whitespace-nowrap tracking-[0.02em]">
                  {dateLabel}
                </span>
                <div className="h-px flex-1 bg-[#555555]" />
              </div>
            </div>

            <ul className="space-y-3">
              {items.map((m) => {
                const mine = isMine(m);
                const who = resolveDisplayName(m);
                const showMyAuthor =
                  mine &&
                  (isOwner ||
                    (myId != null && ownerId != null && myId === ownerId));

                return (
                  <li
                    key={`${m.messageId ?? `${m.sentAt}-${Math.random()}`}`}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[82%] flex flex-col gap-1">
                      {/* 상단 라벨 */}
                      <div className={`${mine ? "text-right" : "text-left"}`}>
                        <span className="font-[Pretendard] text-[16px] font-medium text-[#1C1C1E]">
                          {mine ? (showMyAuthor ? "작성자" : undefined) : who}
                        </span>
                      </div>

                      {/* 말풍선 */}
                      <div className="flex flex-col gap-[10px]">
                        <div
                          className={[
                            "inline-block rounded-[10px] py-[10px] px-[15px]",
                            "font-[Pretendard] text-[14px] leading-[22px] whitespace-pre-wrap break-words",
                            mine
                              ? "bg-[#B8CDB9] text-[#12381F]" // 내 버블
                              : "bg-[#555555] text-white", // 상대 버블
                          ].join(" ")}
                        >
                          {m.content}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* 하단 입력바 */}
      <div className="sticky bottom-0 bg-white px-3 py-[10px] border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isConnected ? "메시지 보내기" : "연결 중..."}
            disabled={!isConnected}
            className="flex-1 h-11 px-4 rounded-[15px] border border-[#729A73]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
  onClick={send}
  disabled={!isConnected || !message.trim()}
  className="h-11 w-11 rounded-full bg-emerald-500 text-white flex items-center justify-center disabled:opacity-60 active:scale-[0.98] transition"
  aria-label="전송"
  title="전송"
>
  <img src={sendIcon} alt="전송" className="w-[18px] h-[18px] object-contain" draggable={false} />
</button>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;
