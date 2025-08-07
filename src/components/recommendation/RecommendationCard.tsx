import { useState } from "react";
import type { Recommendation, PaymentType, WorkPeriod } from "../../types/recommendation";
import palette from "../../styles/theme";

interface Props {
  job: Recommendation;
  variant?: "default" | "dimmed";
}

const WORK_PERIOD_KOR: Record<WorkPeriod, string> = {
  SHORT_TERM: "단기",
  OVER_ONE_MONTH: "1개월 이상",
  OVER_THREE_MONTH: "3개월 이상",
  OVER_ONE_YEAR: "1년 이상",
};

const PAYMENT_TYPE_KOR: Record<PaymentType, string> = {
  DAILY: "일급",
  HOURLY: "시급",
  MONTHLY: "월급",
  PER_TASK: "건별",
};

const formatTime = (time: string): string => {
  const [hourStr, minuteStr] = time.split(":");
  const hour = hourStr.padStart(2, "0");
  const minute = minuteStr.padStart(2, "0");
  return `${hour}:${minute}`;
};


const RecommendationCard = ({ job, variant = "default" }: Props) => {
  const [isApplied, setIsApplied] = useState(false);
  const backgroundColor =
    variant === "dimmed" ? palette.primary.primary : "rgba(161, 196, 163, 0.75)";

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
        className="max-w-[190px] rounded-[20px] px-[16px] py-[12px] mb-[10px] mx-auto"
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

        <p className="text-[14px] mt-[12px] font-[Pretendard]" style={{ color: palette.gray.dark }}>
          {job.location}
        </p>

        <p className="text-[14px] font-[Pretendard]" style={{ color: palette.gray.dark }}>
          {job.isPeriodNegotiable ? "기간 협의" : WORK_PERIOD_KOR[job.workPeriod]} · {" "}
          {job.isTimeNegotiable ? "시간 협의" : formatTime(job.workStart)}~{formatTime(job.workEnd)}
        </p>

        <p className="text-[14px] font-[Pretendard]" style={{ color: palette.gray.dark }}>
          {PAYMENT_TYPE_KOR[job.paymentType]} {job.salary.toLocaleString()}원
        </p>

        <p
          className="text-[12px] mb-[8px] mt-[12px] font-[Pretendard]"
          style={{ color: palette.gray.default }}
        >
          <span className="text-[12px]">★</span> 후기 {job.reviewCount}건
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
