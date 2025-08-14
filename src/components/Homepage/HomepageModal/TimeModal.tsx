import { useState } from "react";
import palette from "../../../styles/theme";

interface TimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (time: { start?: string; end?: string }) => void;
}

export default function TimeModal({
  isOpen,
  onClose,
  onSubmit,
}: TimeModalProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  if (!isOpen) return null;

  // 30분 간격 라벨
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const period = h < 12 ? "오전" : "오후";
      const hour = h % 12 === 0 ? 12 : h % 12;
      const minute = m === 0 ? "00" : "30";
      times.push(`${period} ${hour.toString().padStart(2, "0")}:${minute}`);
    }
  }

  // 시작(오전 12:00) 위로 2칸, 끝(오후 11:30) 아래로 2칸 패딩
  const paddedTimes = ["", "", ...times, "", ""];

  const to24HourFormat = (time: string): string => {
    const [period, rest] = time.split(" ");
    const [hourStr, minute] = rest.split(":");
    let hour = parseInt(hourStr, 10);
    if (period === "오후" && hour !== 12) hour += 12;
    if (period === "오전" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  };

  const handleReset = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleApply = () => {
    if (selectedLeft && selectedRight) {
      const work_start = to24HourFormat(selectedLeft);
      const work_end = to24HourFormat(selectedRight);
      onSubmit({ start: work_start, end: work_end });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-end bg-black/30 font-[Pretendard]">
      <div className="w-[393px] h-[286px] bg-white rounded-[20px] -translate-y-5 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <div
          className="h-[55px] flex items-center justify-center relative rounded-t-[20px]"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          <span className="text-[18px] font-bold">근무 시간 선택</span>
          <button
            onClick={onClose}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[16px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mt-[20px] relative">
          {/* 왼쪽 리스트 */}
          <div className="h-[120px] overflow-y-scroll flex flex-col gap-[10px] mr-[81px]">
            {paddedTimes.map((time, i) => {
              const isBlank = time === "";
              return (
                <button
                  key={`L-${i}`}
                  onClick={() => {
                    if (!isBlank) setSelectedLeft(time);
                  }}
                  disabled={isBlank}
                  className="w-[67px] h-[16px] text-[13px] !font-bold"
                  style={{
                    // 빈 칸도 같은 높이 유지(텍스트만 없음)
                    color: isBlank
                      ? "transparent"
                      : selectedLeft === time
                      ? palette.primary.primary
                      : palette.gray.default,
                    cursor: isBlank ? "default" : "pointer",
                  }}
                >
                  {isBlank ? " " : time}
                </button>
              );
            })}
          </div>

          {/* 오른쪽 리스트 */}
          <div className="h-[120px] overflow-y-scroll flex flex-col gap-[10px]">
            {paddedTimes.map((time, i) => {
              const isBlank = time === "";
              return (
                <button
                  key={`R-${i}`}
                  onClick={() => {
                    if (!isBlank) setSelectedRight(time);
                  }}
                  disabled={isBlank}
                  className="w-[67px] h-[16px] text-[13px] !font-bold"
                  style={{
                    color: isBlank
                      ? "transparent"
                      : selectedRight === time
                      ? palette.primary.primary
                      : palette.gray.default,
                    cursor: isBlank ? "default" : "pointer",
                  }}
                >
                  {isBlank ? " " : time}
                </button>
              );
            })}
          </div>

          {/* ~ 표시 */}
          <div
            className="absolute left-1/2 top-[60px] text-[13px]"
            style={{
              transform: "translateX(-50%)",
              color: palette.primary.primary,
            }}
          >
            ~
          </div>
        </div>

        <div className="flex justify-center gap-[20px] mt-[20px] pb-[15px]">
          <button
            onClick={handleReset}
            className="w-[132px] h-[50px] text-[18px] !font-bold rounded-[10px] border"
            style={{
              borderColor: palette.primary.primary,
              color: palette.primary.primary,
            }}
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className="w-[172px] h-[50px] text-[18px] !font-bold rounded-[10px]"
            style={{ backgroundColor: palette.primary.primary, color: "white" }}
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
