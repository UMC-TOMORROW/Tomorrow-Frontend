import React, { useState } from "react";
import Devider from "../common/Devider";
import CommonButton from "../common/CommonButton";

export default function PersonalStep() {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");

  return (
    <div className="max-w-[375px] !px-5 !space-y-6">
      {/* 헤더 */}
      <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative pb-5">
        <button className="text-[20px]">✕</button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] !font-bold font-pretendard">
          개인 등록
        </h1>
      </div>

      {/* 인트로 */}
      <div className="!mx-2 mb-6">
        <h2 className="text-[20px] !font-extrabold font-pretendard !leading-[22px] tracking-[-0.41px] text-[#729A73] text-white p-2 rounded !my-5">
          사업자가 아니신가요?
        </h2>
        <p className="font-pretendard !font-semibold text-[14px] leading-[22px] tracking-[-0.41px] !text-[#333] !mb-5">
          간단한 정보를 입력해주세요.
          <br />
          구직자가 확인하고 지원하는 데에 도움이 됩니다.
        </p>
      </div>

      <Devider />

      {/* 폼 */}
      <div className="flex flex-col gap-6">
        {/* 이름 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">이름</label>
          <input
            type="text"
            placeholder="배수현"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
          />
        </div>

        {/* 동네 위치 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">동네 위치</label>
          <input
            type="text"
            placeholder="서울 강서구 oo로 ooo"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">연락처</label>
          <input
            type="tel"
            placeholder="010-****-****"
            className="w-[336px] h-[52px] px-[10px] rounded-[10px] border border-[#729A73] !text-[14px]"
          />
        </div>

        {/* 요청 내용 */}
        <div className="!mb-6">
          <label className="block text-[14px] font-semibold text-[#333] !mb-2">요청 내용</label>
          <textarea
            placeholder="텃밭 관리가 혼자 하기에 벅차서 도움을 부탁드려요."
            className="w-[336px]  p-[10px] rounded-[10px] border border-[#729A73] !text-[14px] "
          />
        </div>
      </div>

      {/* 버튼 */}
      <CommonButton label={"등록하기"} />
    </div>
  );
}
