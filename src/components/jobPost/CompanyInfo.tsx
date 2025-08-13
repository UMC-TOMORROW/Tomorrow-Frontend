// components/jobPost/CompanyInfo.tsx
import React from "react";
import { Search } from "lucide-react";

type Props = {
  companyName: string;
  location: string; // 주소(장소)
  alwaysHiring: boolean; // 상시모집 (UI에 노출은 안 하지만 상태는 유지)
  isActive: boolean; // 활성화 (UI에 노출은 안 하지만 상태는 유지)
  onChange: (v: { companyName: string; location: string; alwaysHiring: boolean; isActive: boolean }) => void;
  onSearchClick?: () => void; // (옵션) 주소검색 연동용
};

export default function CompanyInfo({ companyName, location, alwaysHiring, isActive, onChange, onSearchClick }: Props) {
  const handleSearch = () => {
    console.log("[CompanyInfo] 주소 검색 버튼 클릭");
    if (onSearchClick) return onSearchClick();
    alert("주소 검색 기능은 추후 구현 예정입니다.");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <h2
          style={{ marginBottom: "20px", fontWeight: "700" }}
          className="text-[18px] text-[#333] leading-[100%] font-pretendard"
        >
          업체 정보를 알려주세요.
        </h2>

        <p className="font-semibold text-[#333] !mb-2">업체명</p>
        <input
          type="text"
          placeholder="예) 내일"
          value={companyName}
          onChange={(e) => {
            const next = { companyName: e.target.value, location, alwaysHiring, isActive };
            console.log("[CompanyInfo] 업체명 변경:", next.companyName);
            onChange(next);
          }}
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 text-sm text-[#333] !px-3"
        />
      </div>

      <div className="relative">
        <p className="font-semibold text-[#333] !mb-2">장소</p>
        <input
          type="text"
          placeholder="서울 강서구 00로 000"
          value={location}
          onChange={(e) => {
            const next = { companyName, location: e.target.value, alwaysHiring, isActive };
            console.log("[CompanyInfo] 장소 변경:", next.location);
            onChange(next);
          }}
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 pr-10 text-sm text-[#333] !px-3"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute top-[70%] right-3 -translate-y-1/2  text-[#707070]"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
