import { useState } from "react";
import type { Recommendation } from "../../data/recommendationData";
import palette from "../../styles/theme";

interface Props {
  job: Recommendation;
  variant?: "default" | "dimmed";
}

const RecommendationCard = ({ job, variant = "default" }: Props) => {
  const backgroundColor =
    variant === "dimmed" ? palette.primary.primary : "rgba(161, 196, 163, 0.75)";

  const [isApplied, setIsApplied] = useState(false);

  const handleApplyClick = () => {
    setIsApplied(true);
  };

  return (
    <div
      className="min-w-[270px] max-h-[394px] rounded-[20px] px-[16px] py-[20px] flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      style={{ backgroundColor }}
    >
      <p
        className="text-[16px] leading-[18px] mb-[15px] mt-[12px] text-center font-[Pretendard]"
        style={{ color: palette.gray.dark }}
      >
        OO님의 근무 스타일에<br />맞는 일자리를 추천드려요!
      </p>

      <div
        className="max-w-[180px] rounded-[20px] px-[16px] py-[12px] mb-[10px] mx-auto"
        style={{ backgroundColor: palette.gray.light }}
      >
        <p
          className="text-[14px] mt-[8px] mb-[2px] font-[Pretendard]"
          style={{ color: palette.gray.default }}
        >
          {job.companyName}
        </p>
        <strong
          className="text-[18px] font-bold font-[Pretendard]"
          style={{ color: palette.gray.dark }}
        >
          {job.title}
        </strong>
        <p
          className="text-[14px] mt-[12px] font-[Pretendard]"
          style={{ color: palette.gray.dark }}
        >
          {job.location}
        </p>
        <p
          className="text-[14px] font-[Pretendard]"
          style={{ color: palette.gray.dark }}
        >
          {job.workPeriod} · {job.workDays.join(", ")}
        </p>
        <p
          className="text-[14px] font-[Pretendard]"
          style={{ color: palette.gray.dark }}
        >
          시 {job.salary.toLocaleString()}원
        </p>
        <p
          className="text-[12px] mb-[8px] mt-[12px] font-[Pretendard]"
          style={{ color: palette.gray.dark }}
        >
          <span className="text-[12px]">★</span> 후기 {job.reviewsCount}건
        </p>
      </div>

      <button
        onClick={handleApplyClick}
        className="w-[180px] mt-[30px] mb-[10px] mx-auto block text-[15px] font-[Pretendard] px-[20px] py-[8px] rounded-[10px] font-semibold"
        style={{
          backgroundColor: isApplied ? palette.primary.primary : palette.gray.light,
          color: isApplied ? "#ffffff" : palette.primary.primary,
          border: isApplied ? "none" : `1px solid ${palette.primary.primary}`,
        }}
      >
        지원하기
      </button>
    </div>
  );
};

export default RecommendationCard;
