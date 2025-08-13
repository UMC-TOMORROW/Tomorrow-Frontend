import { useState } from "react";

type RegistrantType = "BUSINESS" | "PERSONAL";

export default function JobTypeSelector({
  value,
  onChange,
}: {
  value: RegistrantType;
  onChange: (v: RegistrantType) => void;
}) {
  const selected = value === "BUSINESS" ? "기업" : "개인";

  const handleClick = (v: RegistrantType) => {
    console.log("[JobTypeSelector] 선택:", v);
    onChange(v);
  };

  return (
    <div className="gap-4 flex flex-col px-4 py-8">
      <h2
        style={{ marginTop: "20px", marginBottom: "10px", fontWeight: "700" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        어떤 형태로 일자리를 등록하시나요?
      </h2>
      <div className="flex gap-4 justify-between">
        {/* 기업 버튼 */}
        <button
          type="button"
          onClick={() => handleClick("BUSINESS")}
          className={`w-[185px] h-[80px] rounded-[10px] flex flex-col items-center justify-center gap-2
    ${selected === "기업" ? "bg-[#729A73]" : "bg-white border border-[#D1D5DB]"}`}
        >
          <div className={`text-[16px] font-semibold ${selected === "기업" ? "text-white" : "text-[#555555D9]"}`}>
            기업
          </div>
          <div className={`text-[12px] ${selected === "기업" ? "text-white/80" : "text-[#555555D9]"}`}>
            사업체나 기관이 일손 모집
          </div>
        </button>

        {/* 개인 버튼 */}
        <button
          type="button"
          onClick={() => handleClick("PERSONAL")}
          className={`w-[185px] h-[80px] rounded-[10px] px-4 py-2 flex flex-col items-center justify-center gap-2
            ${selected === "개인" ? "bg-[#729A73]" : "bg-white border border-[#D1D5DB]"}`}
        >
          <div className={`text-[16px] font-semibold ${selected === "개인" ? "text-white" : "text-[#555555D9]"}`}>
            개인
          </div>
          <div className={`text-[12px] ${selected === "개인" ? "text-white/80" : "text-[#555555D9]"}`}>
            개인이 일손 모집
          </div>
        </button>
      </div>
    </div>
  );
}
