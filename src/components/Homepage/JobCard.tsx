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

const normalizeS3Url = (url: string) => {
  try {
    const u = new URL(url);
    // '+'는 공백 의도로 들어온 경우가 많으므로 우선 %20으로 치환
    const cleaned = u.pathname.replace(/\+/g, "%20");
    // 세그먼트 단위로 재인코딩 (슬래시는 유지)
    const parts = cleaned
      .split("/")
      .map((seg) => encodeURIComponent(decodeURIComponent(seg)));
    u.pathname = parts.join("/");
    return u.toString();
  } catch {
    return url;
  }
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

  // 🔽 여기서부터 내부에서 계산
  const rawImage = image ?? "";
  const normalizedImage = normalizeS3Url(rawImage);
  const isValidImageUrl =
    typeof normalizedImage === "string" &&
    !!normalizedImage.trim() &&
    normalizedImage.trim() !== "...";
  const imageSrc = isValidImageUrl ? normalizedImage : defaultLogo;

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

  const paymentUnit = paymentUnitMap[paymentType];

  return (
    <div
      className="bg-white w-[393px] mx-auto overflow-x-hidden"
      style={{ fontFamily: "Pretendard" }}
    >
      <div className="px-[16px] pt-[10px] pb-[6px]">
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
            <img
              src={imageSrc}
              alt={title}
              onError={(e) => {
                e.currentTarget.src = defaultLogo;
              }}
              className="!h-15 !w-15 rounded"
            />
          </div>
        </div>

        <div className="-mx-[0px] !mt-[10px] h-[1px] bg-[#BFBFBF8C]" />

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

      <div
        className="-mx-[16px]"
        style={{ height: "1px", backgroundColor: palette.gray.default }}
      />
    </div>
  );
};

export default JobCard;
