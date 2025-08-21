// src/pages/job/JobDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../apis/axios";

// 별 아이콘 (프로젝트에 이미 있는 자산 경로 그대로)
import starEmpty from "../../assets/star/star_empty.png";
import starFilled from "../../assets/star/star_filled.png";
import starHalf from "../../assets/star/star_half_filled.png";

// 날짜 포맷: YYYY.MM.DD
const fmtDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

// 별 0~5 렌더
const StarsRow: React.FC<{ value?: number; size?: number; gap?: number }> = ({ value = 0, size = 16, gap = 2 }) => {
  const safe = Math.max(0, Math.min(5, Number(value) || 0));
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

// API 응답 → UI 모델 정규화 (스웨거 예시: { result: [{ stars, review, createdAt }, ...] })
type UiReview = { id: number | string; stars: number; content: string; createdAt: string };

function normalizeReviews(payload: any): UiReview[] {
  const res = payload?.result ?? payload;

  // 다양한 포맷 처리: [], {content:[]}, {items:[]}, {reviews:[]}, {…단일객체…}
  const arr = Array.isArray(res)
    ? res
    : Array.isArray(res?.content)
    ? res.content
    : Array.isArray(res?.items)
    ? res.items
    : Array.isArray(res?.reviews)
    ? res.reviews
    : res
    ? [res]
    : [];

  return arr.map((r: any, idx: number) => ({
    id: r.id ?? r.reviewId ?? idx,
    stars: Number(r.stars ?? r.rating ?? r.score ?? 0),
    content: String(r.review ?? r.content ?? r.text ?? ""),
    createdAt: r.createdAt ?? r.created_at ?? new Date().toISOString(),
  }));
}
// const { data } = await axiosInstance.get(`/api/v1/reviews/1`);
// console.debug("[reviews] raw:", data);
// const normalized = normalizeReviews(data);

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<UiReview[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        if (!jobId) {
          setList([]);
          setError("postId가 없습니다.");
          return;
        }
        // ✅ API 연결: GET /api/v1/reviews/{postId}
        const { data } = await axiosInstance.get(`/api/v1/reviews/${jobId}`);
        const normalized = normalizeReviews(data);
        if (!mounted) return;
        setList(normalized);
      } catch (e: any) {
        console.error("[reviews] fetch error ▶", e?.response ?? e);
        if (!mounted) return;
        setError(e?.response?.data?.message ?? "후기 조회 중 오류가 발생했습니다.");
        setList([]); // 오류 시에도 목록은 비움
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [jobId]);

  return (
    <div className="max-w-[375px] bg-white h-[100dvh] flex flex-col">
      <div className="shrink-0 bg-white border-b border-[#DEDEDE]">
        <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative">
          <button
            type="button"
            onClick={handleBack}
            className="text-[20px] w-12 h-12 flex items-center justify-center"
            aria-label="뒤로가기"
          >
            ✕
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold font-pretendard">후기</h1>
        </div>
      </div>

      {/* 본문 (디자인 그대로/spacing 동일) */}
      <div className="flex-1 overflow-y-auto !px-4 !pt-[50px] !pb-[max(24px,env(safe-area-inset-bottom))] !space-y-6">
        {!loading && list.length === 0 && (
          <p className="text-[14px] text-[#666]">
            {error ? "후기가 등록되지 않았습니다" : "후기가 등록되지 않았습니다"}
          </p>
        )}

        {list.map((r) => (
          <article
            key={r.id}
            className="rounded-[12px] border border-[#729A73] !p-4"
            style={{ boxShadow: "0 0 0 1px rgba(114,154,115,0.06) inset" }}
          >
            <p className="text-[16px] !font-semibold text-[#3D3D3D] !mb-2">{fmtDate(r.createdAt)}</p>
            <p className="text-[16px] text-[#000] leading-6 whitespace-pre-wrap !mb-3">{r.content}</p>
            <StarsRow value={r.stars} />
          </article>
        ))}
      </div>
    </div>
  );
}
