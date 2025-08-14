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

  // ====== [추가] 버튼 표시용 상태 ======
  const [regionLabel, setRegionLabel] = useState<string | null>(null); // 예: "강남구"
  const [typeLabel, setTypeLabel] = useState<string | null>(null); // 예: "서빙"
  const [dayLabel, setDayLabel] = useState<string | null>(null); // 예: "토"
  const [timeLabel, setTimeLabel] = useState<string | null>(null); // 예: "11:00~17:00"

  // 영문 카테고리를 한국어 라벨로 (TypeModal이 영문코드 반환)
  const typeKorean: Record<string, string> = {
    SERVING: "서빙",
    KITCHEN_ASSIST: "주방보조/설거지",
    CAFE: "카페/베이커리",
    ODD_JOBS: "심부름/소일거리",
    PROMOTION: "전단지/홍보",
    ELDERLY_CARE: "어르신 돌봄",
    CHILD_CARE: "아이 돌봄",
    BEAUTY: "미용/뷰티",
    TUTORING: "과외/학원",
    OFFICE_WORK: "사무보조",
  };

  const dayKorean: Record<string, string> = {
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
    SUN: "일",
  };

  // ====== [추가] 모달 onSubmit을 한 번 감싸서 표시용 라벨도 갱신 ======
  const handleRegionSubmit = (regions: string[]) => {
    // RegionModal은 [] 또는 ["강남구"] 형태로 전달
    setRegionLabel(regions.length > 0 ? regions[0] : null);
    onRegionSelect(regions);
    closeModal();
  };

  const handleTypeSubmit = (types: string[]) => {
    // TypeModal은 ["SERVING"] 등 영문 코드 배열로 전달
    const label = types.length > 0 ? typeKorean[types[0]] ?? types[0] : null;
    setTypeLabel(label);
    onTypeSelect(types);
    closeModal();
  };

  const handleDaySubmit = (days: string[]) => {
    // DayModal은 한 개만 선택하도록 되어 있음 (예: ["SAT"])
    const label = days.length > 0 ? dayKorean[days[0]] ?? days[0] : null;
    setDayLabel(label);
    onDaySelect(days);
    closeModal();
  };

  const handleTimeSubmit = (time: { start?: string; end?: string }) => {
    // "HH:MM" 형태만 표시(초 제거)
    const trim = (t?: string) => (t ? t.slice(0, 5) : "");
    const s = trim(time.start);
    const e = trim(time.end);
    const label = s || e ? `${s || "00:00"}~${e || "23:59"}` : null;
    setTimeLabel(label);
    onTimeSelect(time);
    closeModal();
  };

  // 적용 여부
  const isRegionApplied = !!regionLabel;
  const isTypeApplied = !!typeLabel;
  const isDayApplied = !!dayLabel;
  const isTimeApplied = !!timeLabel;

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
          // 모달 열림(active) 이거나 적용됨(applied)이면 초록 배경/흰 글씨
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

      {/* 모달들 */}
      <RegionModal
        isOpen={modal === "region"}
        onClose={closeModal}
        onSubmit={handleRegionSubmit} // ← 변경
      />
      <TypeModal
        isOpen={modal === "type"}
        onClose={closeModal}
        onSubmit={handleTypeSubmit} // ← 변경
      />
      <DayModal
        isOpen={modal === "day"}
        onClose={closeModal}
        onSubmit={handleDaySubmit} // ← 변경
      />
      <TimeModal
        isOpen={modal === "time"}
        onClose={closeModal}
        onSubmit={handleTimeSubmit} // ← 변경
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
            : "bg-white text-[#555555D9] border-[##555555D9]"
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
