import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Devider from "../common/Devider";
import CommonButton from "../common/CommonButton";
import { axiosInstance } from "../../apis/axios";
import { Search } from "lucide-react";

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

const KAKAO_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string;

const ensureKakao = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.kakao?.maps) return resolve();

    const existed = document.querySelector('script[data-kakao-sdk="1"]') as HTMLScriptElement | null;
    if (existed) {
      const wait = () => (window.kakao?.maps ? resolve() : setTimeout(wait, 50));
      return wait();
    }

    if (!KAKAO_KEY) return reject(new Error("VITE_KAKAO_APP_KEY가 설정되지 않았습니다."));

    const s = document.createElement("script");
    s.setAttribute("data-kakao-sdk", "1");
    s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;
    s.onload = () => window.kakao.maps.load(() => resolve());
    s.onerror = () => reject(new Error("카카오 SDK 로드 실패"));
    document.head.appendChild(s);
  });

const ensureDaumPostcode = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.daum?.Postcode) return resolve();
    const existed = document.querySelector('script[data-daum-postcode="1"]');
    if (existed) return resolve();
    const s = document.createElement("script");
    s.setAttribute("data-daum-postcode", "1");
    s.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Daum Postcode 로드 실패"));
    document.head.appendChild(s);
  });

function AddressSearchModal({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (v: { address: string; lat?: number; lng?: number }) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let canceled = false;

    (async () => {
      try {
        await Promise.all([ensureKakao(), ensureDaumPostcode()]);
      } catch (err: any) {
        alert(err?.message ?? "지도 스크립트를 불러오지 못했습니다.");
        onClose();
        return;
      }
      if (canceled || !boxRef.current) return;

      boxRef.current.innerHTML = "";

      const pc = new window.daum.Postcode({
        oncomplete: (data: any) => {
          const addr = data.roadAddress || data.jibunAddress || "";
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(addr, (result: any, status: any) => {
            let lat: number | undefined, lng: number | undefined;
            if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
              lat = parseFloat(result[0].y);
              lng = parseFloat(result[0].x);
            }
            onPick({ address: addr, lat, lng });
            onClose();
          });
        },
        onresize: (size: any) => {
          if (boxRef.current) boxRef.current.style.height = size.height + "px";
        },
        width: "100%",
        height: "100%",
      });

      pc.embed(boxRef.current, { autoClose: true });
    })();

    return () => {
      canceled = true;
    };
  }, [open, onClose, onPick]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center">
      <div className="w-[360px] max-w-[95vw] h-[420px] bg-white rounded-[12px] shadow-lg overflow-hidden relative">
        <button className="absolute right-3 top-3 text-xl leading-none" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <div ref={boxRef} className="w-full h-full" />
      </div>
    </div>
  );
}

// 전화번호 형식: 010-1234-5678
const MOBILE_RE = /^01[016789]-(\d{3}|\d{4})-\d{4}$/;
// 입력값을 숫자만 받아 3-3/4-4로 자동 포맷
const formatMobile = (v: string) => {
  const d = v.replace(/\D/g, "");
  if (d.length <= 3) return d;
  const a = d.slice(0, 3);
  const rest = d.slice(3);

  // 전체 자릿수에 따라 3 또는 4자리로 나눔 (10자리=3, 11자리=4)
  const secondLen = d.length <= 10 ? 3 : 4;

  const b = rest.slice(0, secondLen);
  const c = rest.slice(secondLen, secondLen + 4);
  return [a, b && `-${b}`, c && `-${c}`].filter(Boolean).join("");
};

export default function PersonalStep() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addrOpen, setAddrOpen] = useState(false);
  console.log(setLatitude, setLongitude);
  // 필수: name, address, contact(phone), registrationPurpose

  const phoneValid = MOBILE_RE.test(phone);
  const canSubmit = !!(name && address && phone && request);

  const onSubmit = async () => {
    if (!canSubmit) {
      alert("필수 항목(이름, 주소, 연락처, 요청 내용)을 입력해주세요.");
      return;
    }

    // 지도 연동 전 임시 좌표(서울시청) 기본값
    const lat = latitude ?? 37.5665;
    const lng = longitude ?? 126.978;

    // ✅ 스웨거 스펙: camelCase만 전송
    const payload = {
      name: name.trim(),
      latitude: lat,
      longitude: lng,
      contact: phone.trim(),
      registrationPurpose: request.trim(),
      address: address.trim(),
    };

    try {
      setSubmitting(true);

      await axiosInstance.post("/api/v1/jobs/personal_registrations", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });

      alert("등록이 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (e: any) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      console.group("[PersonalStep] 제출 실패");
      console.log("status:", e?.response?.status);
      console.log("headers:", e?.response?.headers);
      console.log("data:", e?.response?.data);
      console.groupEnd();

      // 1) 진짜 '드래프트 없음'일 때만 안내 (명시적인 코드/문구가 있을 때만)
      if (data?.code === "JOB_DRAFT_REQUIRED" || /드래프트|세션.*없/i.test(String(data?.message ?? ""))) {
        alert("이전 단계(일자리 등록 1차 폼)를 먼저 제출해주세요.");
        return;
      }
      // 2) 검증 에러(common 400) → 필드별 메시지 우선 노출
      if (status === 400 && (data?.code === "COMMON402" || /Validation/i.test(String(data?.message ?? "")))) {
        const errs = data?.result && typeof data.result === "object" ? data.result : {};

        // 휴대폰(contact) 메시지 최우선
        const contactMsg = errs.contact || errs.phone || errs["contact "] || null;
        if (contactMsg) {
          alert(String(contactMsg));
          return;
        }

        // 다른 필드 에러들 합쳐서 표시
        const merged = Object.values(errs).filter(Boolean).join("\n") || "입력값을 확인해주세요.";
        alert(merged);
        return;
      }

      // 3) 그 외 일반 에러
      const fallback =
        data?.message ||
        data?.result?.message ||
        (data?.result && typeof data.result === "object"
          ? Object.entries(data.result)
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")
          : null);

      alert(fallback ?? "등록에 실패했습니다. 입력값을 다시 확인해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[375px] !px-5 !space-y-6">
      {/* 헤더 */}
      <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative pb-5">
        <button className="text-[20px]" onClick={() => navigate(-1)}>
          ✕
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] !font-bold font-pretendard">
          개인 등록
        </h1>
      </div>

      {/* 인트로 */}
      <div className="!mx-2 mb-6">
        <h2 className="text-[20px] !font-extrabold font-pretendard !leading-[22px] tracking-[-0.41px] text-[#729A73] text-white p-2 rounded !my-5">
          사업자가 아니신가요?
        </h2>
        <p className="font-pretendard !font-semibold text-[14px] leading-[22px] tracking-[-0.41px] !text-[#333] !mb-5">
          간단한 요청 내용을 적어주세요. 구직자가 확인하고 지원하는 데 도움이 됩니다.
        </p>
      </div>

      <Devider />

      {/* 폼 */}
      <div className="flex flex-col gap-6">
        {/* 이름 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">이름</label>
          <input
            type="text"
            placeholder="이내일"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 주소 + 모달 */}
        <div className="relative">
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">주소</label>
          <input
            type="text"
            placeholder="서울 강서구 oo로 ooo"
            className="w-[336px] h-[52px] px-[10px] pr-10 rounded-[10px] border border-[#729A73] !text-[14px]"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setAddrOpen(true)}
            className="absolute right-3 top-[66%] -translate-y-1/2 text-[#707070]"
            aria-label="주소 검색"
            title="주소 검색"
          >
            <Search size={18} />
          </button>

          {/* 위도 경도 테스트용 */}
          {/* {latitude != null && longitude != null && (
            <p className="text-[12px] text-[#888] mt-1">
              위도 {latitude}, 경도 {longitude}
            </p>
          )} */}

          <AddressSearchModal
            open={addrOpen}
            onClose={() => setAddrOpen(false)}
            onPick={({ address, lat, lng }) => {
              setAddress(address);
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>

        {/* 연락처 → contact */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">연락처</label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={13} // 010-1234-5678
            pattern="01[016789]-\d{3,4}-\d{4}"
            placeholder="010-1234-5678"
            className={`w-[336px] h-[52px] px-[10px] rounded-[10px] border !text-[14px] ${
              phone && !phoneValid ? "border-red-500" : "border-[#729A73]"
            }`}
            value={phone}
            onChange={(e) => setPhone(formatMobile(e.target.value))}
          />
          <p className={`mt-1 text-[12px] ${phone && !phoneValid ? "text-red-500" : "text-[#666]"}`}>
            예: 010-1234-5678
          </p>
        </div>

        {/* 요청 내용 → registrationPurpose */}
        <div className="!mb-6">
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">요청 내용</label>
          <textarea
            placeholder="텃밭 관리가 혼자 하기에 벅차서 도움을 부탁드려요."
            className="w-[336px] p-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
          />
        </div>

        {/* (옵션) 좌표 수동 입력 UI 필요 시 */}
        {/*
        <div className="flex gap-2">
          <input type="number" step="0.000001" placeholder="위도" value={latitude ?? ""} onChange={e => setLatitude(Number(e.target.value) || undefined)} />
          <input type="number" step="0.000001" placeholder="경도" value={longitude ?? ""} onChange={e => setLongitude(Number(e.target.value) || undefined)} />
        </div>
        */}
      </div>

      <CommonButton label={submitting ? "등록 중..." : "등록하기"} onClick={onSubmit} />
    </div>
  );
}
