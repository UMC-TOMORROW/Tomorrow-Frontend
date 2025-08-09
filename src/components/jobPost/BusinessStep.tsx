import React, { useState } from "react";
import Devider from "../common/Devider";
import CommonButton from "../common/CommonButton";

export default function BusinessStep() {
  const [regNo, setRegNo] = useState("");
  const [corpName, setCorpName] = useState("");
  const [owner, setOwner] = useState("");
  const [openDate, setOpenDate] = useState("");
  const canSubmit = regNo && corpName && owner && openDate;

  return (
    <div className="max-w-[375px] !px-5 !space-y-6">
      <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative pb-5">
        <button className="text-[20px]">✕</button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] !font-bold font-pretendard">
          사업자 인증
        </h1>
      </div>

      <div className="!mx-2 mb-6">
        <h2 className="text-[20px] !font-extrabold font-pretendard !leading-[22px] tracking-[-0.41px] text-[#729A73] text-white p-2 rounded !my-5">
          사업자이신가요?
        </h2>
        <p className="font-pretendard !font-semibold text-[14px] leading-[22px] tracking-[-0.41px] !text-[#333] !mb-5">
          정확한 사업자 정보를 입력해주세요.
          <br />
          신뢰할 수 있는 광고 등록을 위해 꼭 필요한 과정입니다.
        </p>
      </div>

      <Devider />

      <div className="flex flex-col gap-6">
        {/* 사업자 등록 번호 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">사업자 등록 번호</label>
          <input
            type="text"
            placeholder="1234567890"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73]"
          />
        </div>

        {/* 상호 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">상호 (법인/단체명)</label>
          <input
            type="text"
            placeholder="(주) 내일"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73]"
          />
        </div>

        {/* 성명 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">성명 (대표자)</label>
          <input
            type="text"
            placeholder="이내일"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73]"
          />
        </div>

        {/* 개업연월일 */}
        <div className="!mb-6">
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">개업연월일</label>
          <input
            type="date"
            className="w-[336px] h-[52px] px-[10px] !text-[#555]/85 rounded-[10px] border border-[#729A73]"
          />
        </div>
      </div>

      <CommonButton label={"등록하기"} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[14px] font-semibold !text-[#333]">{label}</p>
      {children}
    </div>
  );
}
