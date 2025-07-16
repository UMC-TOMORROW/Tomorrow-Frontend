import { useState } from "react";
import palette from "../../../styles/theme";

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const days = ["월", "화", "수", "목", "금", "토", "일"];

const DayModal = ({ isOpen, onClose }: DayModalProps) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleClick = (day: string) => {
    setSelectedDay((prev) => (prev === day ? null : day));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-0 left-1/2 w-[393px] h-[155px] bg-white rounded-t-[15px] z-[1000]"
      style={{
        transform: "translateX(-50%)",
        fontFamily: "Pretendard",
      }}
    >
      {/* 상단 초록색 박스 */}
      <div
        className="relative flex items-center justify-center h-[55px] text-[15px] font-bold w-full rounded-t-[15px]"
        style={{
          backgroundColor: palette.primary.primaryLight,
          fontFamily: "Pretendard",
        }}
      >
        요일
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-1/2 transform -translate-y-1/2 w-[10px] h-[10px] text-[16px] flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-between items-center px-[15px] py-[30px]">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => handleClick(day)}
              className={`w-[40px] h-[30px] text-[12px] rounded-[8px] font-medium cursor-pointer border`}
              style={{
                fontFamily: "Pretendard",
                backgroundColor: isSelected ? palette.primary.primary : "white",
                color: isSelected ? "white" : "black",
                border: `1px solid ${palette.primary.primary}`,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayModal;
