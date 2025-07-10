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
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        maxWidth: "393px",
        backgroundColor: "white",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        fontFamily: "Pretendard",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "55px",
          backgroundColor: palette.primary.primaryLight,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>시간</span>
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[50%] translate-y-[-50%] text-[16px]"
          style={{ width: "20px", height: "20px" }}
        >
          ✕
        </button>
      </div>

      {/* 시간 선택 리스트 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          position: "relative",
        }}
      >
        {/* 오전 시간 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginRight: "40px",
          }}
        >
          {morningTimes.map((time) => (
            <button
              key={time}
              className="!font-bold"
              onClick={() => handleClick(time, "morning")}
              style={{
                width: "67px",
                height: "16px",
                fontSize: "13px",
                color:
                  selectedMorning === time
                    ? palette.primary.primary
                    : "#555555",
              }}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 오후 시간 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {afternoonTimes.map((time) => (
            <button
              className="!font-bold"
              key={time}
              onClick={() => handleClick(time, "afternoon")}
              style={{
                width: "67px",
                height: "16px",
                fontSize: "13px",
                color:
                  selectedAfternoon === time
                    ? palette.primary.primary
                    : "#555555",
              }}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 물결표시 (~) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "66px", // 오전 09:00(3번째)와 오후 06:00(3번째) 사이 중앙
            transform: "translate(-50%, 0)",
            fontSize: "13px",
            color: palette.primary.primary,
          }}
        >
          ~
        </div>
      </div>

      {/* 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "15px",
          paddingBottom: "30px",
        }}
      >
        <button
          onClick={handleReset}
          className="!font-bold"
          style={{
            width: "120px",
            height: "40px",
            fontSize: "15px",
            borderRadius: "10px",
            border: `1px solid ${palette.primary.primary}`,
            color: palette.primary.primary,
          }}
        >
          초기화
        </button>
        <button
          onClick={handleApply}
          className="!font-bold"
          style={{
            width: "160px",
            height: "40px",
            fontSize: "15px",
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
