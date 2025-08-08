import React, { useState } from "react";
import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const JobWeekdaysSelector = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isNegotiable, setIsNegotiable] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <h2
        style={{ margin: "10px 0", fontWeight: "600" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        요일 선택
      </h2>

      {/* 요일 버튼 */}
      <div className="flex flex-wrap gap-[10px]">
        {weekdays.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-[10px] py-[4px] rounded-[7px] border-[1px] text-[13px] leading-none whitespace-nowrap transition
                ${
                  selected
                    ? "bg-[#729A73] !text-white !border-[#729A73]"
                    : "bg-white text-[#333] border-[#D9D9D9] hover:border-[#BBB] active:scale-[0.99]"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 협의 가능 */}
      <button
        type="button"
        className="flex items-center gap-1 mt-1 text-sm text-[#666]"
        onClick={() => setIsNegotiable((prev) => !prev)}
      >
        <img
          src={isNegotiable ? checkActive : checkInactive}
          alt={isNegotiable ? "선택됨" : "선택 안됨"}
          className="w-4 h-4"
        />
        협의 가능
      </button>
    </div>
  );
};

export default JobWeekdaysSelector;
