import { useState } from "react";
import palette from "../../styles/theme";
import defaultLogo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import type { PaymentType } from "../../types/recommendation";

const paymentUnitMap: Record<PaymentType, string> = {
  HOURLY: "시",
  DAILY: "일",
  MONTHLY: "월",
  PER_TASK: "건당",
};

interface JobCardProps {
  jobId: number;
  company: string;
  title: string;
  review: string;
  location: string;
  wage: string;
  image: string;
  isTime: boolean;
  isPeriod: boolean;
  environment?: string[];
  paymentType: PaymentType;
}

const JobCard = ({
  jobId,
  company,
  title,
  review,
  location,
  wage,
  image,
  isTime,
  isPeriod,
  environment,
  paymentType,
}: JobCardProps) => {
  const [hovered, setHovered] = useState(false);
  const isActive = hovered;

  const environmentMap: Record<string, string> = {
    can_work_standing: "서서 근무 중심",
    can_work_sitting: "앉아서 근무 중심",
    can_lift_light_objects: "가벼운 물건 운반",
    can_lift_heavy_objects: "무거운 물건 운반",
    use_arm_frequently: "손과 팔을 자주 사용하는 작업",
    repetitive_hand_work: "반복 손작업 포함",
  };

  const timeText = isTime ? "시간협의" : "시간 고정";
  const periodText = isPeriod ? "기간협의" : "기간 고정";

  const translatedEnv =
    environment
      ?.map((e) => environmentMap[e])
      .filter(Boolean)
      .join(", ") || "";

  const paymentUnit = paymentUnitMap[paymentType]; // ✅ 타입 안전

  const isValidImageUrl =
    typeof image === "string" && !!image.trim() && image.trim() !== "...";
  const imageSrc = isValidImageUrl ? image : defaultLogo;

  return (
    <div
      className="bg-white w-[393px] mx-auto overflow-x-hidden"
      style={{ fontFamily: "Pretendard" }}
    >
      <div className="px-[16px] pt-[10px] pb-[6px]">
        {/* 텍스트 + 사진 */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-[80px]">
            <p className="text-[12px] text-black">{company}</p>
            <p className="text-[16px] font-bold">{title}</p>
            <p
              className="text-[14px] whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ color: palette.primary.primary }}
            >
              {translatedEnv}
            </p>
            <p className="text-[12px] !mt-1.5 text-black">
              <span style={{ color: palette.gray.default }}>
                {timeText}, {periodText}
              </span>
              {review && (
                <>
                  &nbsp; ★ <span>{review}</span>
                </>
              )}
            </p>
          </div>

          {/* 사진 */}
          <div className="flex items-center !mt-[3px] justify-center h-full w-[60px]">
            <img src={imageSrc} alt={title} className="!h-15 !w-15 rounded" />
          </div>
        </div>

        {/* 구분선 (카드 내 선) */}
        <div className="-mx-[0px] !mt-[10px] h-[1px] bg-[#BFBFBF8C]" />

        {/* 하단 위치 + 버튼 */}
        <div className="flex justify-between items-center !mb-1 !mt-2">
          <p className="text-[13px] text-black">
            {location} &nbsp; {paymentUnit} {wage}
          </p>

          <Link
            to={`/jobs/${jobId}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`w-[80px] h-[28px] text-[14px] mt-1 border rounded-[7px] transition-colors duration-200 flex items-center justify-center ${
              isActive ? "!text-white" : "text-[#555555D9]"
            }`}
            style={{
              fontFamily: "Pretendard",
              backgroundColor: isActive ? "#729A73" : "transparent",
              borderColor: isActive ? "#729A73" : "#555555D9",
            }}
            role="button"
          >
            지원하기
          </Link>
        </div>
      </div>

      {/* 바깥쪽 1px 회색 구분선 */}
      <div
        className="-mx-[16px]"
        style={{ height: "1px", backgroundColor: palette.gray.default }}
      />
    </div>
  );
};

export default JobCard;
