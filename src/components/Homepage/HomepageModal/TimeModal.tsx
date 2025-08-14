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

  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const period = h < 12 ? "오전" : "오후";
      const hour = h % 12 === 0 ? 12 : h % 12;
      const minute = m === 0 ? "00" : "30";
      times.push(`${period} ${hour.toString().padStart(2, "0")}:${minute}`);
    }
  }

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
          <div className="h-[120px] overflow-y-scroll flex flex-col gap-[10px] mr-[81px]">
            {times.map((time) => (
              <button
                key={"L-" + time}
                onClick={() => setSelectedLeft(time)}
                className="w-[67px] h-[16px] text-[13px] !font-bold"
                style={{
                  color:
                    selectedLeft === time
                      ? palette.primary.primary
                      : palette.gray.default,
                }}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="h-[120px] overflow-y-scroll flex flex-col gap-[10px]">
            {times.map((time) => (
              <button
                key={"R-" + time}
                onClick={() => setSelectedRight(time)}
                className="w-[67px] h-[16px] text-[13px] !font-bold"
                style={{
                  color:
                    selectedRight === time
                      ? palette.primary.primary
                      : palette.gray.default,
                }}
              >
                {time}
              </button>
            ))}
          </div>

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
            style={{
              backgroundColor: palette.primary.primary,
              color: "white",
            }}
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
