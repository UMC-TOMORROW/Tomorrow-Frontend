import { useState } from "react";
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

interface Props {
  onRegionSelect: (regions: string[]) => void;
  onTypeSelect: (types: string[]) => void;
  onDaySelect: (days: string[]) => void;
  onTimeSelect: (time: { start?: string; end?: string }) => void;
}

const HomepageTopBar = ({
  onRegionSelect,
  onTypeSelect,
  onDaySelect,
  onTimeSelect,
}: Props) => {
  const [modal, setModal] = useState<"region" | "type" | "day" | "time" | null>(
    null
  );
  const closeModal = () => setModal(null);

  // 지역만 라벨 변경
  const [regionLabel, setRegionLabel] = useState<string | null>(null);

  // 나머지는 적용 여부만 표시(라벨은 고정)
  const [isTypeApplied, setIsTypeApplied] = useState(false);
  const [isDayApplied, setIsDayApplied] = useState(false);
  const [isTimeApplied, setIsTimeApplied] = useState(false);

  // 모달 submit 핸들러들
  const handleRegionSubmit = (regions: string[]) => {
    setRegionLabel(regions.length > 0 ? regions[0] : null);
    onRegionSelect(regions);
    closeModal();
  };

  const handleTypeSubmit = (types: string[]) => {
    setIsTypeApplied(types.length > 0);
    onTypeSelect(types);
    closeModal();
  };

  const handleDaySubmit = (days: string[]) => {
    setIsDayApplied(days.length > 0);
    onDaySelect(days);
    closeModal();
  };

  const handleTimeSubmit = (time: { start?: string; end?: string }) => {
    const hasTime = Boolean(
      (time.start && time.start.trim()) || (time.end && time.end.trim())
    );
    setIsTimeApplied(hasTime);
    onTimeSelect(time);
    closeModal();
  };

  const isRegionApplied = !!regionLabel;

  return (
    <>
      <div
        className="flex flex-wrap justify-center items-center gap-[8px] px-4 pb-[3px] pt-[3px] bg-white w-[393px] h-[40px] mx-auto"
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
          label="업무 유형" // ← 라벨 고정
          img={typeIcon}
          imgActive={typeIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("type")}
          isActive={modal === "type" || isTypeApplied}
        />
        <FilterButton
          label="요일" // ← 라벨 고정
          img={calendarIcon}
          imgActive={calendarIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("day")}
          isActive={modal === "day" || isDayApplied}
        />
        <FilterButton
          label="시간" // ← 라벨 고정
          img={timeIcon}
          imgActive={timeIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("time")}
          isActive={modal === "time" || isTimeApplied}
        />
      </div>

      {/* 모달들 */}
      <RegionModal
        isOpen={modal === "region"}
        onClose={closeModal}
        onSubmit={handleRegionSubmit}
      />
      <TypeModal
        isOpen={modal === "type"}
        onClose={closeModal}
        onSubmit={handleTypeSubmit}
      />
      <DayModal
        isOpen={modal === "day"}
        onClose={closeModal}
        onSubmit={handleDaySubmit}
      />
      <TimeModal
        isOpen={modal === "time"}
        onClose={closeModal}
        onSubmit={handleTimeSubmit}
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
        flex items-center justify-center gap-[4px] h-[25px] px-[8px] rounded-full text-[12px] border 
        ${
          isActive
            ? "bg-[#729A73] !text-white border-[#729A73]"
            : "bg-white text-[#555555D9] border-[#555555D9]"
        } 
        ${className}
      `}
      style={{
        fontFamily: "Pretendard",
        minWidth: label.length <= 3 ? "70px" : "90px",
      }}
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
