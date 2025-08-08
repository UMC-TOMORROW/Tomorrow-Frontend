import React, { useState } from "react";
import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

const RecruitInfo = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);
  const [recruitCount, setRecruitCount] = useState("");
  const [preference, setPreference] = useState("");

  const handleOngoingChange = () => {
    setIsOngoing((v) => {
      const next = !v;
      if (next) {
        setYear("");
        setMonth("");
        setDay("");
      }
      return next;
    });
  };

  return (
    <div className="w-full space-y-5">
      {/* 타이틀 */}
      <h2
        style={{ marginBottom: "20px", fontWeight: "700" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        모집 관련 정보를 알려주세요.
      </h2>

      {/* 모집 마감 */}
      <div className="space-y-2">
        <p className="font-semibold text-[16px] text-[#333] !pb-5">모집 마감</p>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={isOngoing}
            className={`w-[72px] h-[40px] px-3 rounded-[10px] border text-sm 
                        ${
                          isOngoing
                            ? "border-[#DEDEDE] bg-[#F7F7F7] text-[#999]"
                            : "border-[#DEDEDE] bg-white text-[#333]"
                        }`}
          />
          <span className="text-[#333] text-[12px]">년</span>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            disabled={isOngoing}
            className={`w-[56px] h-[40px] px-3 rounded-[10px] border text-sm
                        ${
                          isOngoing
                            ? "border-[#DEDEDE] bg-[#F7F7F7] text-[#999]"
                            : "border-[#DEDEDE] bg-white text-[#333]"
                        }`}
          />
          <span className="text-[#333] text-[12px]">월</span>
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={isOngoing}
            className={`w-[56px] h-[40px] px-3 rounded-[10px] border text-sm
                        ${
                          isOngoing
                            ? "border-[#DEDEDE] bg-[#F7F7F7] text-[#999]"
                            : "border-[#DEDEDE] bg-white text-[#333]"
                        }`}
          />
          <span className="text-[#333] text-[12px]">일</span>
        </div>

        {/* 상시 모집 — 캡처/다른 섹션과 동일한 체크 UI */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isOngoing}
          onClick={handleOngoingChange}
          className="flex items-center !my-3 gap-3 mt-1 text-[12px] text-[#555]/85"
        >
          <img
            src={isOngoing ? checkActive : checkInactive}
            alt={isOngoing ? "선택됨" : "선택 안됨"}
            className="w-4 h-4"
          />
          상시 모집
        </button>
      </div>

      {/* 모집 인원 */}
      <div className="space-y-1">
        <p className="font-semibold text-[16px] text-[#333] !pb-5">모집 인원</p>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={recruitCount}
            onChange={(e) => setRecruitCount(e.target.value)}
            className="w-[100px] h-[40px] px-3 rounded-[10px] border border-[#DEDEDE] text-sm"
          />
          <span className="text-sm text-[#333]">명</span>
        </div>
      </div>

      {/* 우대사항 */}
      <div className="space-y-1 !mt-3">
        <p className="font-semibold text-[16px] text-[#333] !pb-5">우대사항</p>
        <input
          type="text"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          className="w-full h-[40px] px-3 rounded-[10px] border border-[#DEDEDE] "
        />
        <p className="text-[12px] text-[#555]/85 !mt-2">예) 유사 업무 경험, 인근 거주</p>
      </div>
    </div>
  );
};

export default RecruitInfo;
