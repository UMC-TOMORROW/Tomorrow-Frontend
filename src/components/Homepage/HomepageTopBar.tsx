import { useState } from "react";
import locationIcon from "/src/assets/filter/location.png";
import typeIcon from "/src/assets/filter/type.png";
import calendarIcon from "/src/assets/filter/calender.png";
import timeIcon from "/src/assets/filter/time.png";
import arrowIcon from "/src/assets/jobRegister/icon_arrow_down.png";
import RegionModal from "./HomepageModal/RegionModal";
import TypeModal from "./HomepageModal/TypeModal";
import DayModal from "./HomepageModal/DayModal";
import TimeModal from "./HomepageModal/TimeModal";

const HomepageTopBar = () => {
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
          arrow={arrowIcon}
          onClick={() => setModal("region")}
        />
        <FilterButton
          label="업무 유형"
          img={typeIcon}
          arrow={arrowIcon}
          onClick={() => setModal("type")}
        />
        <FilterButton
          label="요일"
          img={calendarIcon}
          arrow={arrowIcon}
          onClick={() => setModal("day")}
        />
        <FilterButton
          label="시간"
          img={timeIcon}
          arrow={arrowIcon}
          onClick={() => setModal("time")}
        />
      </div>

      <RegionModal isOpen={modal === "region"} onClose={closeModal} />
      <TypeModal isOpen={modal === "type"} onClose={closeModal} />
      <DayModal isOpen={modal === "day"} onClose={closeModal} />
      <TimeModal isOpen={modal === "time"} onClose={closeModal} />
    </>
  );
};

const FilterButton = ({
  label,
  className = "",
  img,
  arrow,
  onClick,
}: {
  label: string;
  className?: string;
  img: string;
  arrow: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-[4px] h-[25px] px-[8px] rounded-full text-[12px] text-[#333] border border-[#ccc] bg-white ${className}`}
      style={{
        fontFamily: "Pretendard",
        minWidth: label.length <= 3 ? "70px" : "90px",
      }}
    >
      {img && (
        <img
          src={img}
          alt=""
          className="w-[14px] h-[14px] object-contain opacity-50"
        />
      )}
      <span className="leading-[1]">{label}</span>
      {arrow && (
        <img
          src={arrow}
          alt=""
          className="w-[9px] h-[9px] object-contain opacity-50"
        />
      )}
    </button>
  );
};

export default HomepageTopBar;
