import React, { useEffect, useMemo, useState, lazy, Suspense, startTransition, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getJobDetail } from "../../apis/jobs";
const ApplySheet = lazy(() => import("../../components/jobApply/ApplySheet"));

import { createApplication, AuthRequiredError, fetchAppliedJobIdsFromServer } from "../../apis/applications";
import { fetchBookmarkedJobIds, addJobBookmark, deleteJobBookmark } from "../../apis/jobBookmarks";
import { getMe } from "../../apis/mypage";
import { authApi } from "../../apis/authApi";
import { axiosInstance } from "../../apis/axios";

import starEmpty from "../../assets/star/star_empty.png";
import starFilled from "../../assets/star/star_filled.png";
import starHalf from "../../assets/star/star_half_filled.png";
import bmEmpty from "../../assets/bookmark/star_empty.png";
import bmFilled from "../../assets/bookmark/star_filled.png";

/* ───────────────── 로컬 캐시 유틸 (파일 내부 인라인) ───────────────── */
const BM_KEY = "bookmark.ids.v1";
type CacheShape = { ids: number[]; updatedAt: number };

function readBm(): CacheShape {
  try {
    const s = localStorage.getItem(BM_KEY);
    if (!s) return { ids: [], updatedAt: 0 };
    const p = JSON.parse(s) as Partial<CacheShape>;
    const raw = Array.isArray((p as any)?.ids) ? ((p as any).ids as unknown[]) : [];
    const nums = raw.map((x) => Number(x)).filter((n): n is number => Number.isFinite(n));
    const cleaned = Array.from(new Set(nums));
    const ts = Number((p as any)?.updatedAt) || 0;
    return { ids: cleaned, updatedAt: ts };
  } catch {
    return { ids: [], updatedAt: 0 };
  }
}
function writeBm(ids: number[]) {
  const unique = Array.from(new Set(ids.filter((n) => Number.isFinite(n))));
  const payload: CacheShape = { ids: unique, updatedAt: Date.now() };
  localStorage.setItem(BM_KEY, JSON.stringify(payload));
}
// function bmHas(id: number): boolean {
//   if (!Number.isFinite(id)) return false;
//   return readBm().ids.includes(id);
// }
function bmAdd(id: number) {
  if (!Number.isFinite(id)) return;
  const cur = readBm().ids;
  if (cur.includes(id)) return;
  writeBm([...cur, id]);
}
function bmRemove(id: number) {
  if (!Number.isFinite(id)) return;
  const nxt = readBm().ids.filter((x) => x !== id);
  writeBm(nxt);
}
function bmReplace(ids: number[]) {
  writeBm(ids.filter((n) => Number.isFinite(n)));
}

const APPLIED_KEY = "applied.job.ids.v1";
const readApplied = () => {
  try {
    const s = localStorage.getItem(APPLIED_KEY);
    const ids = s ? (JSON.parse(s).ids as number[]) : [];
    return Array.isArray(ids) ? ids.filter((n) => Number.isFinite(n)) : [];
  } catch {
    return [];
  }
};
const writeApplied = (ids: number[]) =>
  localStorage.setItem(APPLIED_KEY, JSON.stringify({ ids: Array.from(new Set(ids)), updatedAt: Date.now() }));
const appliedHas = (id: number) => readApplied().includes(id);
const appliedAdd = (id: number) => writeApplied([...readApplied(), id]);
const appliedReplace = (ids: number[]) => writeApplied(ids);

/* ───────────────── 리뷰 요약 SWR 캐시(+TTL) ───────────────── */
const REV_SUM_KEY = "review.summary.v1";
type RevSummary = { count: number; avg: number; updatedAt: number };
const memSummary = new Map<number, RevSummary>(); // 메모리 캐시
const inflight = new Map<number, Promise<RevSummary>>(); // 중복 요청 제거

function readRevLS(): Record<string, RevSummary> {
  try {
    return JSON.parse(localStorage.getItem(REV_SUM_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeRevLS(obj: Record<string, RevSummary>) {
  localStorage.setItem(REV_SUM_KEY, JSON.stringify(obj));
}
function getCachedSummary(postId: number): RevSummary | null {
  const m = memSummary.get(postId);
  if (m) return m;
  const all = readRevLS();
  const v = all[String(postId)];
  if (v) memSummary.set(postId, v);
  return v ?? null;
}
function setCachedSummary(postId: number, s: RevSummary) {
  memSummary.set(postId, s);
  const all = readRevLS();
  all[String(postId)] = s;
  writeRevLS(all);
}

// 느린 기존 API를 사용하되, 최소 계산만 수행
async function fetchReviewSummarySlowAPI(postId: number, signal?: AbortSignal): Promise<RevSummary> {
  const { data } = await axiosInstance.get(`/api/v1/reviews/${postId}`, { signal });
  const arr = Array.isArray(data?.result) ? data.result : [];
  const count = arr.length;
  const sum = arr.reduce((s: number, r: any) => s + Number(r?.stars ?? 0), 0);
  const avg = count ? Number((sum / count).toFixed(1)) : 0;
  return { count, avg, updatedAt: Date.now() };
}
async function withTimeout<T>(p: Promise<T>, ms = 2000, ctrl?: AbortController): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => {
        ctrl?.abort();
        rej(new Error("timeout"));
      }, ms)
    ),
  ]);
}

/* ───────────────── UI 컴포넌트 (메모이제이션) ───────────────── */
const Divider = React.memo(() => <div className="h-px bg-[#EAEAEA] -mx-4" />);

const Badge = React.memo<{ children: React.ReactNode }>(({ children }) => (
  <span className="items-center !px-2 opacity-100 rounded-[8px] border border-[#EE0606CC]/80 text-[14px] bg-white text-[#EE0606CC]">
    {children}
  </span>
));

const Section = React.memo<{ title: string; children: React.ReactNode }>(({ title, children }) => (
  <section className="space-y-3">
    <h3 className="text-[16px] leading-[100%] !font-bold text-[#333] font-pretendard !pb-4">{title}</h3>
    {children}
  </section>
));

const KV = React.memo<{ k: string; v: React.ReactNode; helper?: string }>(({ k, v, helper }) => (
  <div className="!py-1 ">
    <div className="flex items-start gap-4 ">
      <span className="w-[72px] shrink-0 text-[12px] text-[#666] whitespace-nowrap">{k}</span>
      <div className="text-[14px] text-[#222] leading-5">{v}</div>
    </div>
    {helper ? (
      <div className="mt-1 flex items-start gap-4 ">
        <span className="w-[72px] shrink-0" />
        <p className="text-[11px] text-[#8A8A8A]">{helper}</p>
      </div>
    ) : null}
  </div>
));

const StarsImg = React.memo<{
  value?: number;
  size?: number;
  gap?: number;
}>(({ value = 0, size = 17, gap = 2 }) => {
  const safe = Math.max(0, Math.min(5, Number.isFinite(value as number) ? (value as number) : 0));
  const full = Math.floor(safe);
  const frac = safe - full;
  const parts = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "full" as const;
    if (i === full) {
      if (frac >= 0.75) return "full" as const;
      if (frac >= 0.25) return "half" as const;
    }
    return "empty" as const;
  });
  const srcMap = { full: starFilled, half: starHalf, empty: starEmpty } as const;
  return (
    <div className="flex items-center" style={{ gap }} aria-label={`평점 ${safe.toFixed(1)} / 5`}>
      {parts.map((p, idx) => (
        <img key={idx} loading="lazy" src={srcMap[p]} alt="" width={size} height={size} />
      ))}
    </div>
  );
});

/* ───────────────── 매핑 유틸 (응답 → 화면 모델) ───────────────── */
const DAY_KO: Record<string, string> = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};
function periodLabel(p?: string) {
  if (p === "SHORT_TERM") return "단기";
  if (p === "OVER_ONE_MONTH") return "1개월 이상";
  if (p === "OVER_THREE_MONTH") return "3개월 이상";
  if (p === "OVER_SIX_MONTH") return "6개월 이상";
  if (p === "OVER_ONE_YEAR") return "1년 이상";
  return p ?? "-";
}
function paymentLabel(t?: string) {
  if (t === "HOURLY") return "시급";
  if (t === "DAILY") return "일급";
  if (t === "MONTHLY") return "월급";
  if (t === "PER_TASK") return "건별";
  return t ?? "-";
}
const JOB_CATEGORY_KO: Record<string, string> = {
  SERVING: "서빙",
  KITCHEN_HELP: "주방보조/설거지",
  CAFE_BAKERY: "카페/베이커리",
  TUTORING: "과외/학원",
  ERRAND: "심부름/소일거리",
  PROMOTION: "전단지/홍보",
  SENIOR_CARE: "어르신 돌봄",
  CHILD_CARE: "아이 돌봄",
  BEAUTY: "미용/뷰티",
  OFFICE_HELP: "사무보조",
  ETC: "기타",
};
const ENV_KO: Record<string, string> = {
  canWorkSitting: "앉아서 근무 중심",
  canWorkStanding: "서서 근무 중심",
  canMoveActively: "신체 활동 중심",
  canCarryObjects: "가벼운 물건 운반",
  canCommunicate: "사람 응대 중심",
};
const hhmm = (s?: string) => (s ? s.slice(0, 5) : "");

// 상세 응답 → 화면 모델
function mapSwaggerJobDetail(api: any) {
  let weekdays = "요일협의";
  if (api?.workDays && api.workDays.isDayNegotiable === false) {
    const arr = Object.entries(api.workDays)
      .filter(([k, v]) => k !== "isDayNegotiable" && v)
      .map(([k]) => DAY_KO[k] ?? (k as string).toUpperCase());
    if (arr.length > 0) weekdays = arr.join(", ");
  }
  const time = api?.isTimeNegotiable
    ? "시간협의"
    : api?.workStart || api?.workEnd
    ? `${hhmm(api.workStart)}${api.workStart && api.workEnd ? " - " : ""}${hhmm(api.workEnd)}`
    : "-";

  const envTags = Array.isArray(api?.workEnvironment) ? api.workEnvironment.map((k: string) => ENV_KO[k] ?? k) : [];

  return {
    jobId: api.jobId ?? api.id,
    category: JOB_CATEGORY_KO[api.jobCategory] ?? api.jobCategory ?? "",
    title: api.title ?? "",
    companyName: api.companyName ?? "",
    place: undefined,

    // 상세의 rating/reviewCount는 참고용(렌더는 reviewMeta 사용)
    rating: api.avgRating ?? api.rating ?? 0,
    reviewCount: api.reviewCount,

    paymentType: paymentLabel(api.paymentType),
    salary: api.salary ?? 0,
    minWageNote: api.paymentType === "HOURLY" ? "2025년 최저시급 10,030원" : undefined,
    period: `${periodLabel(api.workPeriod)}${api.isPeriodNegotiable ? " (협의가능)" : ""}`,
    weekdays,
    time,

    role: api.alwaysHiring ? "상시모집" : api.deadline ? String(api.deadline).slice(0, 10) : "상시모집",
    headcount: api.recruitmentLimit ?? "-",
    preference: api.preferredQualifications ?? "-",

    address: api.location ?? api.address ?? "-",
    description: api.jobDescription ?? api.description ?? "-",

    envTags,
  };
}

/* ───────────────── 고정 기본값 (재생성 방지) ───────────────── */
const JOB_FALLBACK = {
  category: "",
  title: "",
  companyName: "",
  place: "",
  rating: 0,
  paymentType: "",
  salary: 0,
  minWageNote: undefined as string | undefined,
  period: "",
  weekdays: "",
  time: "",
  role: "",
  headcount: "-",
  preference: "-",
  address: "",
  description: "",
  envTags: [] as string[],
};

/* ───────────────── 페이지 컴포넌트 ───────────────── */
export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 리뷰 메타(요약) 전용 상태: 캐시 → 즉시 표시, 네트워크 → 조용히 갱신
  const [reviewMeta, setReviewMeta] = useState<{ count: number | null; avg: number | null }>({
    count: null,
    avg: null,
  });

  // 북마크 캐시 메모리 사본(파싱 최소화)
  const bmRef = useRef<CacheShape>({ ids: [], updatedAt: 0 });

  // 내 정보(role) 조회
  async function fetchMyRole(): Promise<string | null> {
    try {
      const { data } = await axiosInstance.get("/api/v1/members/me");
      return data?.result?.role ?? data?.role ?? null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    (async () => {
      const role = await fetchMyRole();
      setUserRole(role);
    })();
  }, []);

  // 라우트/응답에서 안전하게 식별자 뽑기
  const effectivePostId = useMemo(() => {
    const cands = [data?.jobId, data?.id, data?.postId, jobId ? Number(jobId) : undefined];
    for (let i = 0; i < cands.length; i += 1) {
      const n = Number(cands[i]);
      if (Number.isFinite(n)) return n as number;
    }
    return null;
  }, [jobId, data]);

  // 상세 불러오기
  useEffect(() => {
    const effectiveId = jobId ?? "10";
    (async () => {
      try {
        setLoading(true);
        const res = await getJobDetail(effectiveId);
        const api = (res as any)?.result ?? res;
        startTransition(() => {
          setData(mapSwaggerJobDetail(api));
          setError(null);
        });
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const job = useMemo(() => (data ? data : JOB_FALLBACK), [data]);

  // 초기 북마크 상태(캐시 → 즉시)
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    if (effectivePostId == null) return;
    bmRef.current = readBm();
    setBookmarked(bmRef.current.ids.includes(effectivePostId));
  }, [effectivePostId]);

  // 서버 북마크 동기화(1회)
  useEffect(() => {
    if (effectivePostId == null) return;
    let alive = true;
    (async () => {
      try {
        const ids = await fetchBookmarkedJobIds();
        if (!alive) return;
        bmRef.current = { ids, updatedAt: Date.now() };
        bmReplace(ids);
        setBookmarked(ids.includes(effectivePostId));
      } catch {
        // 실패 시 캐시 유지
      }
    })();
    return () => {
      alive = false;
    };
  }, [effectivePostId]);

  const navigate = useNavigate();
  const location = useLocation();
  const backTo = location.pathname + location.search + location.hash;
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyContent, setApplyContent] = useState("");
  const [attachChecked, setAttachChecked] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEmployer = (userRole ?? "").toUpperCase() === "EMPLOYER";

  async function onClickApplyCTA() {
    if (applied) return;

    const authed = await ensureLoggedIn();
    if (!authed) {
      alert("로그인이 필요합니다.");
      gotoLogin();
      return;
    }

    const roleNow = userRole ?? (await fetchMyRole());
    if ((roleNow ?? "").toUpperCase() === "EMPLOYER") {
      alert("구인자는 공고에 지원할 수 없습니다.");
      return;
    }

    setApplyOpen(true);
    setAttachChecked(false);
  }

  // 이력서 존재 판단
  function hasMeaningfulResume(r: any): boolean {
    if (!r || typeof r !== "object") return false;
    if (Object.keys(r).length === 0) return false;

    const hasIntro = typeof r.introduction === "string" && r.introduction.trim().length > 0;
    const hasCareer =
      Array.isArray(r.career) &&
      r.career.some(
        (c: any) =>
          (c?.companyName && String(c.companyName).trim().length > 0) ||
          (c?.description && String(c.description).trim().length > 0)
      );
    const hasCerts = Array.isArray(r.certificates) && r.certificates.length > 0;
    const hasEtc =
      (Array.isArray(r.skills) && r.skills.length > 0) || (Array.isArray(r.education) && r.education.length > 0);

    return hasIntro || hasCareer || hasCerts || hasEtc;
  }

  async function resumeExists(): Promise<{ exists: boolean; id?: number }> {
    try {
      const { data } = await axiosInstance.get("/api/v1/resumes/summary");
      const r = data?.result;

      const exists = hasMeaningfulResume(r);
      const rawId = Number(r?.resumeId);
      const id = Number.isFinite(rawId) ? rawId : undefined;

      return { exists, id };
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 404 || status === 204) return { exists: false };
      console.debug("[ensureResumeExists] error, treat as no resume", e?.response ?? e);
      return { exists: false };
    }
  }

  async function handleToggleAttach(checked: boolean) {
    if (!checked) {
      setAttachChecked(false);
      return;
    }

    const { exists, id } = await resumeExists();

    if (!exists) {
      alert("이력서가 없어요. 이력서를 작성해 주세요.");
      setAttachChecked(false);
      setApplyOpen(false);
      navigate("/Mypage/ResumeManage", {
        state: { from: "jobDetail", backTo },
      });
      return;
    }

    if (id && Number.isFinite(id)) setResumeId(id);
    setAttachChecked(true);
  }

  async function ensureLoggedIn(): Promise<boolean> {
    const me1 = await getMe();
    if (me1) return true;
    const ok = await authApi.refresh();
    if (!ok) return false;
    const me2 = await getMe();
    return !!me2;
  }

  function gotoLogin() {
    window.location.href = `https://umctomorrow.shop/login?redirect=${encodeURIComponent(window.location.href)}`;
  }

  async function onSubmitApply() {
    if (submitting || applied) return;
    setSubmitting(true);
    try {
      const postId = Number(data?.jobId ?? jobId);
      if (!Number.isFinite(postId)) {
        alert("공고 식별자가 올바르지 않습니다.");
        return;
      }
      const payload: any = { content: applyContent.trim() };
      if (attachChecked && resumeId) payload.resumeId = resumeId;
      await createApplication(postId, payload);
      alert("지원이 완료되었습니다.");
      appliedAdd(postId);
      setApplied(true);
      setApplyOpen(false);
      setApplyContent("");
      setAttachChecked(false);
    } catch (e: any) {
      const status = e?.response?.status;
      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.message;
      if (e instanceof AuthRequiredError) {
        alert("로그인이 필요합니다.");
        navigate("/login", { state: { backTo } });
        return;
      }
      if (status === 400) {
        alert(msg || "요청을 처리할 수 없습니다.");
        return;
      }
      alert(msg || "지원 중 오류가 발생했어요.");
      console.error("[Apply] error ▶", e?.response ?? e);

      if (status === 409 || msg?.includes("이미 지원") || code === "APPLICATION_ALREADY_APPLIED") {
        appliedAdd(Number(data?.jobId ?? jobId));
        setApplied(true);
        setApplyOpen(false);
        return;
      }
    } finally {
      setSubmitting(false);
    }
  }

  const handleBack = () => {
    navigate("/");
  };

  async function onToggleBookmark() {
    const authed = await ensureLoggedIn();
    if (!authed) {
      alert("로그인이 필요합니다.");
      gotoLogin();
      return;
    }
    if (!Number.isFinite(Number(effectivePostId)) || bookmarking) return;

    try {
      setBookmarking(true);
      if (!bookmarked) {
        setBookmarked(true);
        bmAdd(Number(effectivePostId));
        try {
          await addJobBookmark(Number(effectivePostId));
        } catch (e: any) {
          const status = e?.response?.status;
          const code = e?.response?.data?.code;
          if (status === 409 || code === "BOOKMARK4002") {
            // 이미 서버에도 있음 → 유지
          } else if (status === 401) {
            setBookmarked(false);
            bmRemove(Number(effectivePostId));
            alert("로그인이 필요합니다.");
          } else {
            setBookmarked(false);
            bmRemove(Number(effectivePostId));
            alert(e?.response?.data?.message ?? "찜 처리 중 오류가 발생했어요.");
            console.error("[Bookmark] add error ▶", e?.response ?? e);
          }
        }
      } else {
        setBookmarked(false);
        bmRemove(Number(effectivePostId));
        try {
          await deleteJobBookmark(Number(effectivePostId));
        } catch (e: any) {
          const status = e?.response?.status;
          const code = e?.response?.data?.code;
          if (status === 404 || code === "BOOKMARK4001") {
            // 서버엔 없었음 → 해제 유지
          } else if (status === 401) {
            setBookmarked(true);
            bmAdd(Number(effectivePostId));
            alert("로그인이 필요합니다.");
          } else {
            setBookmarked(true);
            bmAdd(Number(effectivePostId));
            alert(e?.response?.data?.message ?? "찜 취소 중 오류가 발생했어요.");
            console.error("[Bookmark] delete error ▶", e?.response ?? e);
          }
        }
      }
    } finally {
      setBookmarking(false);
    }
  }

  /* ───────────────── 리뷰 요약 SWR 호출 ───────────────── */
  async function refreshReviewSummary(postId: number, { ttlMs = 60_000 } = {}) {
    if (!Number.isFinite(postId)) return;

    // 1) 캐시 즉시 표시
    const cached = getCachedSummary(postId);
    const isStale = !cached || Date.now() - cached.updatedAt > ttlMs;
    if (cached) {
      setReviewMeta((prev) =>
        prev?.count === cached.count && prev?.avg === cached.avg ? prev : { count: cached.count, avg: cached.avg }
      );
      if (!isStale) return; // 신선하면 네트워크 스킵
    }

    // 2) 중복 요청 제거
    if (inflight.has(postId)) {
      const s = await inflight.get(postId)!;
      setReviewMeta({ count: s.count, avg: s.avg });
      return;
    }

    // 3) 타임아웃 포함 네트워크(FG)
    const ctrl = new AbortController();
    const task = (async () => {
      try {
        const s = await withTimeout(fetchReviewSummarySlowAPI(postId, ctrl.signal), 2000, ctrl);
        setCachedSummary(postId, s);
        startTransition(() => setReviewMeta({ count: s.count, avg: s.avg }));
        return s;
      } catch (e) {
        // 실패/타임아웃: 캐시가 없으면 '-' 유지
        if (!cached) startTransition(() => setReviewMeta({ count: null, avg: null }));
        throw e;
      } finally {
        inflight.delete(postId);
      }
    })();

    inflight.set(postId, task);
    await task.catch(() => {});
  }

  // id 확정 시 요약 호출 + 포커스/가시성 복귀 시 디바운스 갱신
  useEffect(() => {
    if (effectivePostId == null) return;

    let t: ReturnType<typeof setTimeout> | null = null;

    const run = () => refreshReviewSummary(effectivePostId);
    run(); // 최초 1회 (캐시→즉시 표시, 필요 시 BG 갱신)

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (t) clearTimeout(t);
      t = setTimeout(run, 200);
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    // 아이들 타임에도 백그라운드 갱신 시도(체감 개선)
    (window as any).requestIdleCallback?.(() => refreshReviewSummary(effectivePostId), { timeout: 1500 });

    return () => {
      if (t) clearTimeout(t);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [effectivePostId]);

  // 지원 이력 캐시/서버 동기화
  useEffect(() => {
    if (effectivePostId == null) return;

    // 1) 캐시로 즉시 반영
    setApplied(appliedHas(effectivePostId));

    // 2) 로그인 되어 있으면 서버에서 보정
    (async () => {
      try {
        const authed = await ensureLoggedIn().catch(() => false);
        if (!authed) return;
        const ids = await fetchAppliedJobIdsFromServer(); // /api/v1/applications?type=all
        appliedReplace(ids);
        if (ids.includes(effectivePostId)) setApplied(true);
      } catch (e) {
        console.debug("[applied] sync skipped", e);
      }
    })();
  }, [effectivePostId]);

  // 간단한 로딩/에러 UI
  if (loading) {
    return (
      <div className="max-w-[375px] mx-auto p-6 text-[#333]" style={{ fontFamily: "Pretendard" }}>
        로딩 중...
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-[375px] mx-auto p-6 text-[#333]" style={{ fontFamily: "Pretendard" }}>
        오류가 발생했어요. 다시 시도해 주세요.
      </div>
    );
  }

  return (
    <div className="max-w-[375px] mx-auto bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative">
          <button
            type="button"
            onClick={handleBack}
            className="text-[20px] w-12 h-12 flex items-center justify-center"
            aria-label="뒤로가기"
          >
            ✕
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold font-pretendard">일자리 정보</h1>
        </div>
      </div>

      <div className="!px-4 !pt-4 !pb-28 !space-y-8">
        {/* Summary */}
        <section className="!space-y-2">
          <p className="text-[14px] leading-[100%] text-[#729A73] font-pretendard font-normal">{job.category}</p>
          <h2 className="text-[18px] font-extrabold leading-[100%] text-[#333] font-pretendard">{job.title}</h2>
          <p className="text-[12px] leading-[100%] text-[#333] font-pretendard font-normal">
            {job.companyName ?? job.place}
          </p>
          <div className="flex items-center gap-2 text-[12px] text-[#777]">
            <StarsImg value={reviewMeta.avg ?? 0} />
            <button
              type="button"
              onClick={() => navigate(`/jobs/${job.jobId ?? jobId}/reviews`)}
              className="inline-flex items-center gap-2 focus:outline-none"
              aria-label={`후기 ${reviewMeta.count ?? 0}건 보기`}
            >
              <span
                className="inline-flex items-center !px-2 !py-0.5 rounded-full border border-[#BFD6C0] text-[#557E59]"
                style={{ minHeight: 20 }}
              >
                후기 {reviewMeta.count == null ? "-" : reviewMeta.count}건
              </span>
            </button>
          </div>
        </section>

        <Divider />

        {/* 근무조건 */}
        <Section title="근무조건">
          <KV
            k="급여"
            v={
              <span className="inline-flex items-center gap-2">
                <Badge>{job.paymentType}</Badge>
                <span>{Number(job.salary ?? 0).toLocaleString()}원</span>
              </span>
            }
            helper={job.minWageNote}
          />
          <KV k="근무기간" v={<span>{job.period}</span>} />
          <KV k="근무요일" v={<span>{job.weekdays}</span>} />
          <KV k="근무시간" v={<span>{job.time}</span>} />
        </Section>

        <Divider />

        {/* 모집조건 */}
        <Section title="모집조건">
          <KV k="모집마감" v={<span>{job.role}</span>} />
          <KV k="모집인원" v={<span>{job.headcount}명</span>} />
          <KV k="우대사항" v={<span>{job.preference}</span>} />

          <div className="w-[335px] rounded-[10px] p-[15px] flex flex-col gap-[15px] bg-[#B8CDB959] text-[#3F5A41] !mt-7">
            <p className="mb-3 font-bold text-[14px] text-[#333]">
              <span className="text-[#729A73]">✨ 내 몸에 맞는 일,</span> 지금 추천해드릴게요.
            </p>
            <div className="flex flex-wrap gap-[10px]">
              {(job.envTags ?? []).map((t: string, i: number) => (
                <span
                  key={i}
                  className="min-w-[108px] h-[24px] rounded-[7px] px-[6px] py-[1px] inline-flex items-center justify-center text-[12px] font-pretendard text-[#3F5A41]"
                  style={{ background: "#729A7380" }}
                >
                  <span className="mr-[6px]">✅</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Section>

        <Divider />

        {/* 근무지역 */}
        <Section title="근무지역">
          <div className="text-[14px] text-[#333] !mt-3">{job.address}</div>
        </Section>

        <Divider />

        {/* 상세요강 */}
        <Section title="상세요강">
          <div className="rounded-[12px] !p-4 border border-[#555]/85 ">
            <p className="text-[14px] text-[#333] leading-6 whitespace-pre-wrap">{job.description}</p>
          </div>
        </Section>
      </div>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t border-[#E5E7EB]">
        <div className="px-4 !pt-4 !pb-[max(16px,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <button
              aria-label={bookmarked ? "찜 취소" : "찜하기"}
              className={`w-12 h-12 shrink-0 rounded-[10px] ${
                bookmarking ? "opacity-70" : ""
              } bg-[#729A73] flex items-center justify-center`}
              onClick={onToggleBookmark}
              disabled={bookmarking}
            >
              <img src={bookmarked ? bmFilled : bmEmpty} alt="" className="w-[45px] h-[45px]" />
            </button>
            <button className="flex-1 min-w-0 h-12 rounded-[10px] border border-[#729A73] text-[#729A73] font-semibold">
              전화하기
            </button>
            <button
              className={`flex-1 min-w-0 h-12 rounded-[10px] ${
                applied || isEmployer ? "bg-[#C9C9C9]" : "bg-[#729A73]"
              } !text-white font-semibold`}
              onClick={onClickApplyCTA}
              disabled={applied}
              aria-disabled={isEmployer}
              title={isEmployer ? "구인자는 지원할 수 없어요" : undefined}
            >
              {applied ? "지원완료" : "지원하기"}
            </button>
          </div>
        </div>
      </div>

      {applyOpen ? (
        <Suspense fallback={null}>
          <ApplySheet
            open={applyOpen}
            content={applyContent}
            setContent={(v) => startTransition(() => setApplyContent(v))}
            attachChecked={attachChecked}
            onToggleAttach={handleToggleAttach}
            canSubmit={!submitting && applyContent.trim().length > 0}
            submitting={submitting}
            onClose={() => setApplyOpen(false)}
            onSubmit={onSubmitApply}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
