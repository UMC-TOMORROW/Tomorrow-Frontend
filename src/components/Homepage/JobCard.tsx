import { useMemo, useState } from "react";
import palette from "../../styles/theme";
import defaultLogo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
import type { PaymentType } from "../../types/homepage";

const paymentUnitMap: Record<PaymentType, string> = {
  HOURLY: "시",
  DAILY: "일",
  MONTHLY: "월",
  PER_TASK: "건당",
};

const buildS3Candidates = (url?: string) => {
  const raw = (url ?? "").trim();
  if (!raw || raw === "...") return [];
  const out = new Set<string>([raw]);
  try {
    const u = new URL(raw);
    const p = u.pathname;

    if (p.includes("+")) {
      const u20 = new URL(raw);
      u20.pathname = p.replace(/\+/g, "%20");
      out.add(u20.toString());

      const u2b = new URL(raw);
      u2b.pathname = p.replace(/\+/g, "%2B");
      out.add(u2b.toString());
    } else if (p.includes("%20")) {
      const up = new URL(raw);
      up.pathname = p.replace(/%20/g, "+");
      out.add(up.toString());
    }
  } catch {
    // 원본만 사용
  }
  return Array.from(out);
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
  workPeriod?: string; // ✅ 추가
  environment?: Record<string, boolean>; // ✅ 객체 타입으로 받기
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
  workPeriod,
  environment,
  paymentType,
}: JobCardProps) => {
  const [hovered, setHovered] = useState(false);
  const isActive = hovered;

  const candidates = useMemo(() => buildS3Candidates(image), [image]);
  const [srcIdx, setSrcIdx] = useState(0);
  const currentSrc = candidates[srcIdx] ?? "";

  const onImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (srcIdx < candidates.length - 1) {
      setSrcIdx((i) => i + 1);
    } else {
      e.currentTarget.src = defaultLogo;
    }
  };

  const environmentMap: Record<string, string> = {
    canWorkStanding: "서서 근무 중심",
    canWorkSitting: "앉아서 근무 중심",
    canCarryObjects: "가벼운 물건 운반",
    canLiftLightObjects: "가벼운 물건 운반",
    canLiftHeavyObjects: "무거운 물건 운반",
    canMoveActively: "신체 활동 중심",
    canCommunicate: "사람 응대 중심",
  };

  const timeText = isTime ? "시간협의" : "시간 고정";

  const translatedEnv = environment
    ? Object.entries(environment)
        .filter(([, v]) => v === true)
        .map(([k]) => environmentMap[k] ?? "")
        .filter(Boolean)
        .join(", ")
    : "";

  const periodText = workPeriod
    ? workPeriod === "OVER_ONE_MONTH"
      ? "1개월 이상"
      : workPeriod === "OVER_THREE_MONTH"
      ? "3개월 이상"
      : workPeriod === "OVER_SIX_MONTH"
      ? "6개월 이상"
      : workPeriod === "OVER_ONE_YEAR"
      ? "1년 이상"
      : "단기"
    : "기간 고정";

  const paymentUnit = paymentUnitMap[paymentType];

  return (
    <div
      className="bg-white w-[393px] mx-auto overflow-x-hidden"
      style={{ fontFamily: "Pretendard" }}
    >
      <div className="px-[16px] pt-[10px] pb-[6px]">
        <div className="flex justify-between items-start gap-3">
          {/* 텍스트 */}
          <div className="flex-1">
            <p className="text-[12px] text-black">{company}</p>
            <p className="text-[16px] font-bold">{title}</p>
            <p
              className="text-[12px] break-keep"
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
          <div className="flex-shrink-0 self-center w-[79px] h-[79px] flex items-center justify-center">
            <img
              src={currentSrc || defaultLogo}
              alt={title}
              onError={onImgError}
              className="w-[79px] h-[79px] object-contain"
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
