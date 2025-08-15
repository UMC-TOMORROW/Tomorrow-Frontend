import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobDetail } from "../../apis/jobs";
import ApplySheet from "../../components/jobApply/ApplySheet";
import { getResumeSummary } from "../../apis/resumes";
import { postApplication } from "../../apis/applications";
import { ensureAuth, redirectToLogin, AuthRequiredError } from "../../apis/httpCommon";
import { fetchBookmarkedJobIds, addJobBookmark, deleteJobBookmark } from "../../apis/jobBookmarks";
import { getMe } from "../../apis/mypage"; // /api/v1/members/me
import { authApi } from "../../apis/authApi";

import starEmpty from "../../assets/star/star_empty.png";
import starFilled from "../../assets/star/star_filled.png";
import starHalf from "../../assets/star/star_half_filled.png";
import bmEmpty from "../../assets/bookmark/star_empty.png";
import bmFilled from "../../assets/bookmark/star_filled.png";

const Divider: React.FC = () => <div className="h-px bg-[#EAEAEA] -mx-4" />;

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="items-center !px-2 opacity-100 rounded-[8px] border border-[#EE0606CC]/80 text-[14px] bg-white text-[#EE0606CC]">
    {children}
  </span>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h3 className="text-[16px] leading-[100%] !font-bold text-[#333] font-pretendard font-bold !pb-4">{title}</h3>
    {children}
  </section>
);

const KV: React.FC<{ k: string; v: React.ReactNode; helper?: string }> = ({ k, v, helper }) => (
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
);

const StarsImg: React.FC<{ value?: number; size?: number; gap?: number }> = ({ value = 0, size = 17, gap = 2 }) => {
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
        <img key={idx} src={srcMap[p]} alt="" width={size} height={size} />
      ))}
    </div>
  );
};

// ---------- 매핑 유틸 (응답 → 화면 모델) ----------
const DAY_KO: Record<string, string> = { mon: "월", tue: "화", wed: "수", thu: "목", fri: "금", sat: "토", sun: "일" };
const periodLabel = (p?: string) =>
  p === "SHORT_TERM"
    ? "단기"
    : p === "OVER_ONE_MONTH"
    ? "1개월 이상"
    : p === "OVER_THREE_MONTH"
    ? "3개월 이상"
    : p === "OVER_SIX_MONTH"
    ? "6개월 이상"
    : p === "OVER_ONE_YEAR"
    ? "1년 이상"
    : p ?? "-";
const paymentLabel = (t?: string) =>
  t === "HOURLY" ? "시급" : t === "DAILY" ? "일급" : t === "MONTHLY" ? "월급" : t === "PER_TASK" ? "건별" : t ?? "-";

const JOB_CATEGORY_KO: Record<string, string> = {
  SERVING: "서빙",
  KITCHEN_ASSIST: "주방보조/설거지",
  CAFE_BAKERY: "카페/베이커리",
  TUTORING: "과외/학원",
  ERRAND: "심부름/소일거리",
  PROMOTION: "전단지/홍보",
  ELDER_CARE: "어르신 돌봄",
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

function mapSwaggerJobDetail(api: any) {
  // 근무요일
  let weekdays = "요일협의";
  if (api?.workDays && api.workDays.isDayNegotiable === false) {
    const arr = Object.entries(api.workDays)
      .filter(([k, v]) => k !== "isDayNegotiable" && v)
      .map(([k]) => DAY_KO[k] ?? (k as string).toUpperCase());
    weekdays = arr.length ? arr.join(", ") : "요일협의";
  }
  // 근무시간
  const time = api?.isTimeNegotiable
    ? "시간협의"
    : api?.workStart || api?.workEnd
    ? `${hhmm(api.workStart)}${api.workStart && api.workEnd ? " - " : ""}${hhmm(api.workEnd)}`
    : "-";
  // 환경 태그
  const envTags = Array.isArray(api?.workEnvironment) ? api.workEnvironment.map((k: string) => ENV_KO[k] ?? k) : [];

  return {
    jobId: api.jobId ?? api.id,
    category: JOB_CATEGORY_KO[api.jobCategory] ?? api.jobCategory ?? "",
    title: api.title ?? "",
    companyName: api.companyName ?? "",
    place: undefined,
    rating: 0,
    reviewCount: api.reviewCount ?? 0,

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

function isHtmlResponse(res: any): boolean {
  const ct = String(res?.headers?.["content-type"] || "");
  const url = String(res?.request?.responseURL || "");
  return ct.includes("text/html") || url.includes("/login");
}

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  console.log(loading, error);
  useEffect(() => {
    const effectiveId = jobId ?? "36"; // 존재하는 ID로 테스트
    (async () => {
      try {
        setLoading(true);
        console.log("[JobDetail] GET /api/v1/jobs/", effectiveId);
        const res = await getJobDetail(effectiveId); // 본문 타입으로 반환됨
        console.log("[JobDetail] OK ▶", res);
        setData(mapSwaggerJobDetail(res));
      } catch (e: any) {
        console.error("[JobDetail] error ▶", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = Number(jobId ?? data?.jobId);
        if (!Number.isFinite(id)) return;

        const ids = await fetchBookmarkedJobIds();
        if (!cancelled) setBookmarked(ids.includes(id));
      } catch (e: any) {
        console.warn("[Bookmark] init failed ▶", e?.response ?? e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  // 화면 바인딩용 기본값 (값이 비어도 레이아웃 유지)
  const job = data ?? {
    category: "",
    title: "",
    companyName: "",
    place: "",
    rating: 0,
    reviewCount: 0,
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

  const envTags: string[] = job.envTags ?? [];

  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyContent, setApplyContent] = useState("");
  const [attachChecked, setAttachChecked] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function onClickApplyCTA() {
    if (applied) return;
    console.log("[Apply] open apply sheet");
    setApplyOpen(true);
  }

  // 체크박스 토글 시: 체크=이력서 확인 → 없으면 이동, 있으면 resumeId 저장
  async function handleToggleAttach(checked: boolean) {
    if (!checked) {
      setAttachChecked(false);
      console.log("[Apply] attach unchecked");
      return;
    }
    try {
      const { hasResume, resumeId: rid } = await getResumeSummary();
      console.log("[Apply] resume summary ▶", { hasResume, resumeId: rid });
      if (!hasResume || !rid) {
        // 이력서 없으면 즉시 이동(요구사항)
        console.warn("[Apply] resume not found → navigate /Mypage/ResumeManage");
        setApplyOpen(false);
        setAttachChecked(false);
        navigate("/Mypage/ResumeManage");
        return;
      }
      console.log("[Apply] resume found → use resumeId:", rid);
      setResumeId(rid);
      setAttachChecked(true);
    } catch (e: any) {
      console.error("[Apply] resume summary error ▶", e?.response ?? e);
      alert(e?.response?.data?.message ?? "이력서 확인 중 오류가 발생했어요.");
    }
  }
  useEffect(() => {
    if (data) {
      console.log(
        "[Detail IDs] route jobId:",
        jobId,
        "api.jobId:",
        data?.jobId,
        "api.id:",
        data?.id,
        "api.postId:",
        data?.postId
      );
    }
  }, [data, jobId]);

  // 파일 안에 유틸 추가
  async function ensureLoggedIn(): Promise<boolean> {
    // 1) 바로 me 확인 (쿠키가 붙어야 200)
    const me1 = await getMe();
    if (me1) return true;

    // 2) 세션 갱신 한 번 더 시도(쿠키 기반)
    const ok = await authApi.refresh();
    if (!ok) return false;

    const me2 = await getMe();
    return !!me2;
  }

  function gotoLogin() {
    // 서버 로그인 페이지로 이동(탑레벨 네비게이션 → 쿠키 1st-party로 심김)
    window.location.href = `https://umctomorrow.shop/login?redirect=${encodeURIComponent(window.location.href)}`;
  }

  // 지원하기
  async function onSubmitApply() {
    try {
      if (submitting || applied) return;
      setSubmitting(true);

      await ensureAuth(); // ✅ 세션 확인

      const postId = Number(data?.jobId ?? jobId);
      if (!Number.isFinite(postId)) {
        alert("공고 식별자가 올바르지 않습니다.");
        return;
      }

      const payload = {
        content: applyContent.trim(),
        ...(attachChecked && resumeId ? { resumeId } : {}),
      };

      const res = await postApplication(postId, payload);
      console.log("[Apply] success ▶", res);
      const ct = String(res.headers?.["content-type"] || "");
      if (!ct.includes("application/json")) {
        throw new Error("로그인이 필요합니다."); // 서버가 HTML을 돌려주면 여기로
      }

      alert("지원이 완료되었습니다.");
      setApplied(true);
      setApplyOpen(false);
      setApplyContent("");
      setAttachChecked(false);
    } catch (e: any) {
      if (e instanceof AuthRequiredError) {
        alert("로그인이 필요합니다.");
        redirectToLogin();
        return;
      }
      console.error("[Apply] error ▶", e?.response ?? e);
      alert(e?.response?.data?.message ?? e?.message ?? "지원 중 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/"); // 필요하면 "/jobs" 등으로 변경
  };
  async function onToggleBookmark() {
    const authed = await ensureLoggedIn();
    if (!authed) {
      alert("로그인이 필요합니다.");
      gotoLogin();
      return;
    }
    const id = Number(jobId ?? data?.jobId);
    if (!Number.isFinite(id) || bookmarking) return;

    try {
      setBookmarking(true);

      if (!bookmarked) {
        // ▷ 찜 추가 시도
        try {
          await addJobBookmark(id);
          setBookmarked(true);
        } catch (e: any) {
          const status = e?.response?.status;
          const code = e?.response?.data?.code;
          if (status === 409 || code === "BOOKMARK4002") {
            // 이미 찜됨 → 성공으로 간주하고 UI만 채움
            setBookmarked(true);
          } else if (status === 401) {
            alert("로그인이 필요합니다.");
          } else {
            alert(e?.response?.data?.message ?? "찜 처리 중 오류가 발생했어요.");
            console.error("[Bookmark] add error ▶", e?.response ?? e);
          }
        }
      } else {
        // ▷ 찜 취소 시도
        try {
          await deleteJobBookmark(id);
          setBookmarked(false);
        } catch (e: any) {
          const status = e?.response?.status;
          const code = e?.response?.data?.code;
          if (status === 404 || code === "BOOKMARK4001") {
            // 서버엔 없지만 우리 UI는 찜 상태였던 케이스 → 성공으로 간주하고 비움
            setBookmarked(false);
          } else if (status === 401) {
            alert("로그인이 필요합니다.");
          } else {
            alert(e?.response?.data?.message ?? "찜 취소 중 오류가 발생했어요.");
            console.error("[Bookmark] delete error ▶", e?.response ?? e);
          }
        }
      }
    } finally {
      setBookmarking(false);
    }
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
            <StarsImg value={job.rating} />
            <button
              type="button"
              onClick={() => navigate(`/jobs/${job.jobId ?? jobId}/reviews`)}
              className="inline-flex items-center gap-2 focus:outline-none"
              aria-label={`후기 ${job.reviewCount}건 보기`}
            >
              <span className="inline-flex items-center !px-2 !py-0.5 rounded-full border border-[#BFD6C0] text-[#557E59]">
                후기 {job.reviewCount}건
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

          <div className="w-[335px] h-[92px] rounded-[10px] p-[15px] flex flex-col gap-[15px] bg-[#B8CDB959] text-[#3F5A41] !mt-7">
            <p className="mb-3 font-bold text-[14px] text-[#333]">
              <span className="text-[#729A73]">✨ 내 몸에 맞는 일,</span> 지금 추천해드릴게요.
            </p>
            <div className="flex flex-wrap gap-[10px]">
              {envTags.map((t, i) => (
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
                applied ? "bg-[#C9C9C9]" : "bg-[#729A73]"
              } !text-white font-semibold`}
              onClick={onClickApplyCTA}
              disabled={applied}
            >
              {applied ? "지원완료" : "지원하기"}
            </button>
          </div>
        </div>
      </div>
      <ApplySheet
        open={applyOpen}
        content={applyContent}
        setContent={setApplyContent}
        attachChecked={attachChecked}
        onToggleAttach={handleToggleAttach}
        canSubmit={!submitting && applyContent.trim().length > 0}
        submitting={submitting}
        onClose={() => setApplyOpen(false)}
        onSubmit={onSubmitApply}
      />
      ;
    </div>
  );
}
