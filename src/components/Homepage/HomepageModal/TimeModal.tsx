import { useState } from "react";
import palette from "../../../styles/theme";

interface TimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const morningTimes = [
  "오전 08:00",
  "오전 08:30",
  "오전 09:00",
  "오전 09:30",
  "오전 10:00",
];
const afternoonTimes = [
  "오후 05:00",
  "오후 05:30",
  "오후 06:00",
  "오후 06:30",
  "오후 07:00",
];

export default function TimeModal({ isOpen, onClose }: TimeModalProps) {
  const [selectedMorning, setSelectedMorning] = useState<string | null>(null);
  const [selectedAfternoon, setSelectedAfternoon] = useState<string | null>(
    null
  );
  if (!isOpen) return null;

  const handleClick = (time: string, type: "morning" | "afternoon") => {
    if (type === "morning") setSelectedMorning(time);
    else setSelectedAfternoon(time);
  };

  const handleReset = () => {
    setSelectedMorning(null);
    setSelectedAfternoon(null);
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <div
      className="fixed bg-white z-100 w-[393px] h-[286px]"
      style={{
        bottom: 0,
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        fontFamily: "Pretendard",
      }}
    >
      <div
        className="flex relative justify-center items-center h-[55px]"
        style={{
          backgroundColor: palette.primary.primaryLight,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <span className="text-[15px] font-bold">시간</span>
        <button
          onClick={onClose}
          className="absolute right-[16px] top-1/2 transform -translate-y-1/2 w-[10px] h-[10px] text-[16px] flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* 시간 선택 리스트 */}
      <div className="flex relative justify-center mt-[20px]">
        {/* 오전 시간 */}
        <div
          className="flex gap-[10px] mr-[81px]"
          style={{
            flexDirection: "column",
          }}
        >
          {morningTimes.map((time) => (
            <button
              key={time}
              className="!font-bold w-[67px] h-[16px] text-[13px]"
              onClick={() => handleClick(time, "morning")}
              style={{
                color:
                  selectedMorning === time
                    ? palette.primary.primary
                    : palette.gray.default,
              }}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 오후 시간 */}
        <div className="flex gap-[10px]" style={{ flexDirection: "column" }}>
          {afternoonTimes.map((time) => (
            <button
              className="!font-bold w-[67px] h-[16px] text-[13px]"
              key={time}
              onClick={() => handleClick(time, "afternoon")}
              style={{
                color:
                  selectedAfternoon === time
                    ? palette.primary.primary
                    : palette.gray.default,
              }}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 물결표시 (~) */}
        <div
          className="absolute left-[50%] top-[60px] text-[13px]"
          style={{
            transform: "translate(-50%, 0)",
            color: palette.primary.primary,
          }}
        >
          ~
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center mt-[20px] pb-[15px] gap-[20px]">
        <button
          onClick={handleReset}
          className="!font-bold w-[120px] h-[40px] text-[15px]"
          style={{
            borderRadius: "10px",
            border: `1px solid ${palette.primary.primary}`,
            color: palette.primary.primary,
          }}
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          className="!font-bold w-[160px] h-[40px] text-[15px]"
          style={{
            borderRadius: "10px",
            backgroundColor: palette.primary.primary,
            color: "white",
          }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}
