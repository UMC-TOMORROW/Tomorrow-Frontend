import { useState } from "react";
import palette from "../../../styles/theme";

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (days: string[]) => void;
  selected?: string[];
}

const days = ["월", "화", "수", "목", "금", "토", "일"] as const;
const dayToEng: Record<
  (typeof days)[number],
  "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
> = {
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
  일: "SUN",
};

const DayModal = ({ isOpen, onClose, onSubmit }: DayModalProps) => {
  const [selectedDays, setSelectedDays] = useState<(typeof days)[number][]>([]);

  const toggleDay = (day: (typeof days)[number]) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    if (selectedDays.length === 0) return;
    const query = selectedDays.map((d) => dayToEng[d]);
    onSubmit(query);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center items-end bg-black/30"
      style={{ fontFamily: "Pretendard" }}
    >
      <div className="w-[393px] bg-white rounded-[20px] -translate-y-5">
        <div
          className="relative flex items-center justify-center h-[55px] text-[18px] font-bold w-full rounded-t-[20px]"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          근무 요일 선택
          <button
            onClick={onClose}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] text-[16px] flex items-center justify-center"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between items-center px-[15px] py-[30px]">
          {days.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className="w-[40px] h-[30px] text-[16px] rounded-[8px] font-medium cursor-pointer border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: isSelected
                    ? palette.primary.primary
                    : "white",
                  color: isSelected ? "white" : "black",
                  border: `1px solid ${palette.primary.primary}`,
                }}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="w-full !mb-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-[316px] h-[50px] rounded-[12px] text-[18px] !font-bold !text-white"
            style={{ backgroundColor: palette.primary.primary }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayModal;
