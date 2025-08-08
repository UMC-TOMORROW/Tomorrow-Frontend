import React, { useState } from "react";
import { Search } from "lucide-react";

export default function CompanyInfo() {
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");

  const handleSearch = () => {
    // TODO: 주소 검색 기능 연동
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
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full h-[44px] border border-[#DEDEDE] rounded-[8px] px-3 text-sm text-[#333] !px-3"
        />
      </div>

      <div className="relative">
        <p className="font-semibold text-[#333] !mb-2">장소</p>
        <input
          type="text"
          placeholder="서울 강서구 00로 000"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
