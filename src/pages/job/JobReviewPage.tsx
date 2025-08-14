// src/pages/job/JobDetailPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

// 별 아이콘 (프로젝트에 이미 있는 자산 경로 그대로)
import starEmpty from "../../assets/star/star_empty.png";
import starFilled from "../../assets/star/star_filled.png";
import starHalf from "../../assets/star/star_half_filled.png";

// ---- 더미 데이터 (UI 확인용) ----
const DUMMY_REVIEWS = [
  {
    id: 101,
    createdAt: "2025-06-01T00:00:00Z",
    content: "은퇴 후 무료하게 시간을 보내다가 시작했어요.\n몸에 일이 익으면 어렵지 않게 일할 수 있어요!",
    rating: 4,
  },
  {
    id: 102,
    createdAt: "2025-05-10T00:00:00Z",
    content: "하루 몇 시간이라 큰 부담 없고, 생활비 보탬도 되어서 좋아요.",
    rating: 4,
  },
  {
    id: 103,
    createdAt: "2025-03-20T00:00:00Z",
    content: "처음엔 걱정했는데, 잘 가르쳐주셔서 금방 익숙해졌어요.",
    rating: 3.5,
  },
];

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

export default function JobDetailPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="max-w-[375px] bg-white min-h-screen">
      {/* 상단 헤더 */}
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
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold font-pretendard">후기</h1>
        </div>
      </div>

      {/* 본문 */}
      <div className="!px-4 !pt-[50px] !pb-[max(24px,env(safe-area-inset-bottom))] !space-y-6">
        {DUMMY_REVIEWS.map((r) => (
          <article
            key={r.id}
            className="rounded-[12px] border border-[#729A73] !p-4"
            style={{ boxShadow: "0 0 0 1px rgba(114,154,115,0.06) inset" }}
          >
            <p className="text-[16px] !font-semibold text-[#3D3D3D] !mb-2">{fmtDate(r.createdAt)}</p>
            <p className="text-[16px] text-[#000] leading-6 whitespace-pre-wrap !mb-3">{r.content}</p>
            <StarsRow value={r.rating} />
          </article>
        ))}
      </div>
    </div>
  );
}
