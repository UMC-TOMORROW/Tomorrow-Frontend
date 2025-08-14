// components/jobPost/SalaryInput.tsx
import React, { useEffect, useState } from "react";
import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

type Props = {
  paymentLabel: string; // 급여 형태 (시급, 건당 등)
  amount: number; // 숫자 (예: 12000)
  negotiable?: boolean;
  onChange: (data: { paymentLabel: string; amount: number; negotiable?: boolean }) => void;
};

const payTypes = ["시급", "건당", "일급", "월급"];

const SalaryInput = ({ paymentLabel, amount, negotiable = false, onChange }: Props) => {
  // 표시/타이핑용 로컬 버퍼
  const [text, setText] = useState("");

  // 부모 amount 동기화
  useEffect(() => {
    setText(amount ? amount.toLocaleString() : "");
    console.log("[SalaryInput] open sync:", { amount }); // JobTimeSelector 스타일
  }, [amount]);

  const handlePayTypeClick = (type: string) => {
    console.log("[SalaryInput] 타입 선택 -> onChange:", { prev: paymentLabel, next: type });
    onChange({ paymentLabel: type, amount, negotiable });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d,]/g, "");
    const num = Number(cleaned.replace(/,/g, "")) || 0;
    setText(cleaned);
    console.log("[SalaryInput] 금액 입력 변경:", { raw, cleaned, num });
    onChange({ paymentLabel, amount: num, negotiable });
  };

  const handleBlur = () => {
    const num = Number((text || "").replace(/,/g, ""));
    console.log("[SalaryInput] blur format:", { textBefore: text, num });
    setText(num ? num.toLocaleString() : "");
  };

  const toggleNegotiable = () => {
    const next = !negotiable;
    console.log("[SalaryInput] 협의 토글 -> onChange:", { prev: negotiable, next });
    onChange({ paymentLabel, amount, negotiable: next });
  };

  return (
    <div className="w-full">
      <h2
        style={{ marginBottom: "20px", fontWeight: "600" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        급여를 작성해주세요.
      </h2>

      {/* 급여 형태 버튼 */}
      <div className="flex flex-wrap gap-[10px] !mb-3">
        {payTypes.map((type) => {
          const selected = paymentLabel === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => handlePayTypeClick(type)}
              className={`px-[10px] py-[4px] rounded-[7px] border-[1px] text-[13px] leading-none whitespace-nowrap transition
                ${
                  selected
                    ? "bg-[#729A73] !text-white border-[#729A73]"
                    : "bg-white text-[#333] border-[#555]/85 hover:border-[#BBB] active:scale-[0.99]"
                }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* 금액 입력 */}
      <div className="relative w-full mb-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9,]*"
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-4 text-[16px] text-[#333] !px-3"
          value={text}
          onChange={handleInputChange}
          onBlur={handleBlur}
          // 협의 시 입력 막고 싶으면 ↓ 주석 해제
          // disabled={negotiable}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333] text-sm pointer-events-none">원</span>
      </div>

      {/* 협의 가능 */}
      <button type="button" className="flex !mt-2 items-center gap-1 text-sm text-[#666]" onClick={toggleNegotiable}>
        <img
          src={negotiable ? checkActive : checkInactive}
          alt={negotiable ? "선택됨" : "선택 안됨"}
          className="w-4 h-4"
        />
        협의 가능
      </button>
    </div>
  );
};

export default SalaryInput;
