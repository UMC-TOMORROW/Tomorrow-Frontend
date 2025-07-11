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
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "393px",
        height: "155px",
        backgroundColor: "white",
        borderTopLeftRadius: "15px",
        borderTopRightRadius: "15px",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        fontFamily: "Pretendard",
        zIndex: 1000,
      }}
    >
      {/* 상단 초록색 박스 */}
      <div
        style={{
          width: "100%",
          height: "55px",
          backgroundColor: palette.primary.primaryLight,
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "15px",
          fontWeight: "bold",
          position: "relative",
        }}
      >
        요일
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[50%] translate-y-[-50%] text-[16px]"
          style={{ width: "20px", height: "20px" }}
        >
          ✕
        </button>
      </div>

      {/* 버튼 그룹 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px 28px", // 여백 넓힘
        }}
      >
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleClick(day)}
            style={{
              width: "40px",
              height: "30px",
              fontSize: "12px",
              fontFamily: "Pretendard",
              borderRadius: "8px",
              border: `1px solid ${palette.primary.primary}`,
              backgroundColor:
                selectedDay === day ? palette.primary.primary : "white",
              color: selectedDay === day ? "white" : "black",
              cursor: "pointer",
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayModal;
