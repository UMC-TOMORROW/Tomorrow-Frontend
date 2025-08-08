import React, { useState } from "react";
import { CheckCircle } from "lucide-react"; // 아이콘 사용 (lucide-react 설치 필요)

import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

const periods = ["단기", "1개월 이상", "3개월 이상", "6개월 이상", "1년 이상"];

const JobPeriodSelector = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>("단기");
  const [isNegotiable, setIsNegotiable] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2">
      <h2
        style={{ marginBottom: "25px", fontWeight: "700" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        일하는 기간을 작성해주세요.
      </h2>

      <div className="flex flex-wrap gap-[10px]">
        {periods.map((period) => {
          const selected = selectedPeriod === period;
          return (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`px-[10px] py-[4px] rounded-[7px] border-[1px] text-[13px] leading-none whitespace-nowrap transition
          ${
            selected
              ? "bg-[#729A73] !text-white border-[#729A73]"
              : "bg-white text-[#333] border-[#D9D9D9] hover:border-[#BBB] active:scale-[0.99]"
          }`}
            >
              {period}
            </button>
          );
        })}
      </div>

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

export default JobPeriodSelector;
