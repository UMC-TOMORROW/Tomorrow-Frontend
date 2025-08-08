import React, { useState } from "react";
import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

const SalaryInput = () => {
  const [payType, setPayType] = useState("시급");
  const [amount, setAmount] = useState(10030);
  const [isNegotiable, setIsNegotiable] = useState(false);

  const payTypes = ["시급", "건당", "일급", "월급"];

  return (
    <div className="w-full">
      <h2
        style={{ marginBottom: "20px", fontWeight: "600" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        급여를 작성해주세요.
      </h2>

      <div className="flex flex-wrap gap-[10px] !mb-3">
        {payTypes.map((type) => {
          const selected = payType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setPayType(type)}
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

      <div className="relative w-full mb-2">
        <input
          type="number"
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-4 text-[16px] text-[#333] !px-3"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333] text-sm">원</span>
      </div>

      <div
        className="flex !mt-2 items-center gap-1 text-sm text-[#666] cursor-pointer"
        onClick={() => setIsNegotiable((prev) => !prev)}
      >
        <img
          src={isNegotiable ? checkActive : checkInactive}
          alt={isNegotiable ? "선택됨" : "선택 안됨"}
          className="w-4 h-4"
        />
        협의 가능
      </div>
    </div>
  );
};

export default SalaryInput;
