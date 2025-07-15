import type { Recommendation } from "../../data/recommendationData";
import palette from "../../styles/theme";

interface Props {
  job: Recommendation;
}

const RecommendationCard = ({ job }: Props) => {
  return (
    <div
      className="min-w-[280px] max-h-[360px] rounded-[20px] px-[16px] py-[20px] flex-shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
      style={{ backgroundColor: palette.primary.primary }}
    >
      <p
        className="text-[16px] leading-[18px] mb-[15px] mt-[12px] text-center font-[Pretendard]"
        style={{ color: palette.gray.light }}
      >
        실내외에서 가볍게 활동하는 일이<br />잘 맞는 OO님께 추천드려요!
      </p>

      <div
        className="max-w-[180px] rounded-[20px] px-[16px] py-[12px] mb-[10px] mx-auto"
        style={{ backgroundColor: palette.gray.light }}
      >
        <p
          className="text-[14px] mb-[2px] font-[Pretendard]"
          style={{ color: palette.gray.dark }}
        >
          {job.companyName}
        </p>
        <strong
          className="text-[24px] font-bold font-[Pretendard]"
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
      </div>

      <p
        className="text-[12px] mb-[12px] text-center font-[Pretendard]"
        style={{ color: palette.gray.light }}
      >
        <span className="text-[12px]">★</span> 후기 {job.reviewsCount}건
      </p>

      <button
        className="w-[118px] mx-auto block text-[15px] font-[Pretendard] px-[20px] py-[6px] rounded-full"
        style={{
          backgroundColor: palette.gray.light,
          color: palette.primary.primary,
        }}
      >
        <strong>지원하기</strong>
      </button>
    </div>
  );
};

export default RecommendationCard;
