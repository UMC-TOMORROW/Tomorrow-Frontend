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
import type { Job } from "../../types/homepage";

interface Props {
  setJobList: (jobs: Job[]) => void;
  onRegionSelect: (regions: string[]) => void;
  onTypeSelect: (types: string[]) => void;
  onDaySelect: (days: string[]) => void;
  onTimeSelect: (time: { start?: string; end?: string }) => void;
}

const HomepageTopBar = ({
  setJobList,
  onTypeSelect,
  onDaySelect,
  onTimeSelect,
}: Props) => {
  const [modal, setModal] = useState<"region" | "type" | "day" | "time" | null>(
    null
  );
  const closeModal = () => setModal(null);

  return (
    <>
      <div
        className="flex flex-wrap justify-center items-center gap-[8px] px-4 pb-[3px] pt-[3px] bg-white w-[393px] h-[40px] mx-auto"
        style={{ fontFamily: "Pretendard" }}
      >
        <FilterButton
          label="서울 전체"
          img={locationIcon}
          imgActive={locationIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("region")}
          isActive={modal === "region"}
        />
        <FilterButton
          label="업무 유형"
          img={typeIcon}
          imgActive={typeIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("type")}
          isActive={modal === "type"}
        />
        <FilterButton
          label="요일"
          img={calendarIcon}
          imgActive={calendarIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("day")}
          isActive={modal === "day"}
        />
        <FilterButton
          label="시간"
          img={timeIcon}
          imgActive={timeIconWhite}
          arrow={arrowIcon}
          arrowActive={arrowIconWhite}
          onClick={() => setModal("time")}
          isActive={modal === "time"}
        />
      </div>

      {/* 모달들 */}
      <RegionModal
        isOpen={modal === "region"}
        onClose={closeModal}
        setJobList={setJobList}
      />
      <TypeModal
        isOpen={modal === "type"}
        onClose={closeModal}
        onSubmit={onTypeSelect}
      />
      <DayModal
        isOpen={modal === "day"}
        onClose={closeModal}
        onSubmit={onDaySelect}
      />
      <TimeModal
        isOpen={modal === "time"}
        onClose={closeModal}
        onSubmit={onTimeSelect}
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
            : "bg-white text-[#555555D9] border-[#ccc]"
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
