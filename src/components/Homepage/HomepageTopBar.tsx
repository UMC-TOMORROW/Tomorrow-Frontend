import { useEffect, useMemo, useRef, useState } from "react";
import locationIcon from "/src/assets/filter/location.png";
import typeIcon from "/src/assets/filter/type.png";
import calendarIcon from "/src/assets/filter/calender.png";
import timeIcon from "/src/assets/filter/time.png";
import arrowIcon from "/src/assets/jobRegister/icon_arrow_down.png";
import locationIconWhite from "/src/assets/filter/location_white.png";
import typeIconWhite from "/src/assets/filter/type_white.png";
import calendarIconWhite from "/src/assets/filter/calender_white.png";
import timeIconWhite from "/src/assets/filter/time_white.png";
import arrowIconWhite from "/src/assets/jobRegister/icon_arrow_down_white.png";

import RegionModal from "./HomepageModal/RegionModal";
import TypeModal from "./HomepageModal/TypeModal";
import DayModal from "./HomepageModal/DayModal";
import TimeModal from "./HomepageModal/TimeModal";

const TYPE_KOREAN: Record<string, string> = {
  SERVING: "서빙",
  KITCHEN_HELP: "주방보조/설거지",
  CAFE_BAKERY: "카페/베이커리",
  ERRAND: "심부름/소일거리",
  PROMOTION: "전단지/홍보",
  SENIOR_CARE: "어르신 돌봄",
  CHILD_CARE: "아이 돌봄",
  BEAUTY: "미용/뷰티",
  TUTORING: "과외/학원",
  OFFICE_HELP: "사무보조",
};

const DAY_KOREAN: Record<string, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

interface Props {
  onRegionSelect: (regions: string[]) => void;
  onTypeSelect: (types: string[]) => void;
  onDaySelect: (days: string[]) => void;
  onTimeSelect: (time: { start?: string; end?: string }) => void;

  selectedRegion?: string[];
  selectedType?: string[];
  selectedDays?: string[];
  selectedTime?: { start?: string; end?: string };
}

const HomepageTopBar = ({
  onRegionSelect,
  onTypeSelect,
  onDaySelect,
  onTimeSelect,
  selectedRegion = [],
  selectedType = [],
  selectedDays = [],
  selectedTime = {},
}: Props) => {
  const [modal, setModal] = useState<"region" | "type" | "day" | "time" | null>(
    null
  );
  const closeModal = () => setModal(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const recomputeOverflow = () => {
    const el = containerRef.current;
    if (!el) return;
    const over = el.scrollWidth > el.clientWidth + 1;
    setIsOverflowing(over);
    if (over) el.scrollLeft = 0;
  };

  const regionLabel = useMemo(
    () => (selectedRegion.length > 0 ? selectedRegion[0] : null),
    [selectedRegion]
  );

  const typeLabel = useMemo(() => {
    if (selectedType.length === 0) return null;
    return selectedType.map((t) => TYPE_KOREAN[t] ?? t).join("·");
  }, [selectedType]);

  const dayLabel = useMemo(() => {
    if (selectedDays.length === 0) return null;
    const order = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    return [...selectedDays]
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((d) => DAY_KOREAN[d] ?? d)
      .join(", ");
  }, [selectedDays]);

  const timeLabel = useMemo(() => {
    const trim = (t?: string) => (t ? t.slice(0, 5) : "");
    const s = trim(selectedTime.start);
    const e = trim(selectedTime.end);
    if (!s && !e) return null;
    return `${s || "00:00"}~${e || "23:59"}`;
  }, [selectedTime]);

  const isRegionApplied = !!regionLabel;
  const isTypeApplied = !!typeLabel;
  const isDayApplied = !!dayLabel;
  const isTimeApplied = !!timeLabel;

  useEffect(() => {
    const id = setTimeout(recomputeOverflow, 0);
    return () => clearTimeout(id);
  }, [regionLabel, typeLabel, dayLabel, timeLabel, modal]);

  useEffect(() => {
    const onResize = () => recomputeOverflow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleRegionSubmit = (regions: string[]) => {
    onRegionSelect(regions);
    closeModal();
  };
  const handleTypeSubmit = (types: string[]) => {
    onTypeSelect(types);
    closeModal();
  };
  const handleDaySubmit = (days: string[]) => {
    onDaySelect(days);
    closeModal();
  };
  const handleTimeSubmit = (time: { start?: string; end?: string }) => {
    onTimeSelect(time);
    closeModal();
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`flex items-center gap-[8px] px-4 pb-[3px] pt-[3px]
                    bg-white w-[393px] h-[40px] mx-auto
                    overflow-x-auto flex-nowrap
                    ${isOverflowing ? "justify-start" : "justify-center"}`}
        style={{ fontFamily: "Pretendard" }}
      >
        <FilterButton
          label={isRegionApplied ? regionLabel! : "서울 전체"}
          img={locationIcon}
          imgActive={locationIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("region")}
          isActive={modal === "region" || isRegionApplied}
        />
        <FilterButton
          label={isTypeApplied ? typeLabel! : "업무 유형"}
          img={typeIcon}
          imgActive={typeIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("type")}
          isActive={modal === "type" || isTypeApplied}
        />
        <FilterButton
          label={isDayApplied ? dayLabel! : "요일"}
          img={calendarIcon}
          imgActive={calendarIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("day")}
          isActive={modal === "day" || isDayApplied}
        />
        <FilterButton
          label={isTimeApplied ? timeLabel! : "시간"}
          img={timeIcon}
          imgActive={timeIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("time")}
          isActive={modal === "time" || isTimeApplied}
        />
      </div>

      <RegionModal
        isOpen={modal === "region"}
        onClose={closeModal}
        onSubmit={handleRegionSubmit}
        selected={selectedRegion}
      />
      <TypeModal
        isOpen={modal === "type"}
        onClose={closeModal}
        onSubmit={handleTypeSubmit}
        selected={selectedType}
      />
      <DayModal
        isOpen={modal === "day"}
        onClose={closeModal}
        onSubmit={handleDaySubmit}
        selected={selectedDays}
      />
      <TimeModal
        isOpen={modal === "time"}
        onClose={closeModal}
        onSubmit={handleTimeSubmit}
        selected={selectedTime}
      />
    </>
  );
};

const FilterButton = ({
  label,
  className = "",
  img,
  imgActive,
  arrow,
  arrowActive,
  onClick,
  isActive = false,
}: {
  label: string;
  className?: string;
  img: string;
  imgActive?: string;
  arrow: string;
  arrowActive?: string;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const iconSrc = isActive && imgActive ? imgActive : img;
  const arrowSrc = isActive && arrowActive ? arrowActive : arrow;

  return (
    <button
      onClick={onClick}
      className={`
        shrink-0 whitespace-nowrap
        flex items-center justify-center gap-[4px] h-[25px] px-[8px]
        rounded-full text-[12px] border
        ${
          isActive
            ? "bg-[#729A73] !text-white border-[#729A73]"
            : "bg-white text-[#555555D9] border-[#555555D9]"
        }
        ${className}
      `}
      style={{ fontFamily: "Pretendard" }}
    >
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          className="w-[14px] h-[14px] object-contain"
        />
      )}
      <span className="leading-[1]">{label}</span>
      {arrow && (
        <img src={arrowSrc} alt="" className="w-[9px] h-[9px] object-contain" />
      )}
    </button>
  );
};

export default HomepageTopBar;
