// components/jobPost/RecruitInfo.tsx
import { useEffect, useMemo, useState } from "react";
import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";

type Props = {
  deadlineISO?: string; // "2025-08-10T00:00:00.000Z"
  headCount?: number;
  preferenceText?: string;
  alwaysHiring?: boolean; // ✅ 부모 제어 (없으면 기본 false로 처리)
  onChange: (v: { deadlineISO?: string; headCount?: number; preferenceText?: string; alwaysHiring?: boolean }) => void;
};

const RecruitInfo = ({ deadlineISO, headCount, preferenceText, alwaysHiring, onChange }: Props) => {
  // 내부 입력 필드(연/월/일) 화면 전용
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // ✅ 부모가 주지 않으면 기본 false
  const isOngoing = useMemo(() => (typeof alwaysHiring === "boolean" ? alwaysHiring : false), [alwaysHiring]);

  // deadlineISO → 연/월/일 동기화
  useEffect(() => {
    if (!deadlineISO) {
      setYear("");
      setMonth("");
      setDay("");
      return;
    }
    const d = new Date(deadlineISO);
    if (isNaN(d.getTime())) return;
    setYear(String(d.getUTCFullYear()));
    setMonth(String(d.getUTCMonth() + 1).padStart(2, "0")); // ✅ 2자리
    setDay(String(d.getUTCDate()).padStart(2, "0")); // ✅ 2자리
  }, [deadlineISO]);

  const ymdToISO = (y: string, m: string, d: string): string | undefined => {
    if (!y || !m || !d) return undefined;
    const yy = Number(y);
    const mm = Number(m);
    const dd = Number(d);
    if (!yy || !mm || !dd) return undefined;
    return new Date(Date.UTC(yy, mm - 1, dd, 0, 0, 0)).toISOString();
  };

  const pushDate = (nextY: string, nextM: string, nextD: string) => {
    const iso = ymdToISO(nextY, nextM, nextD);
    onChange({
      deadlineISO: iso,
      headCount,
      preferenceText,
      // ✅ 날짜 변경이 상시모집 상태를 바꾸지 않도록 유지
      alwaysHiring: isOngoing,
    });
    console.log("[RecruitInfo] deadline ->", { year: nextY, month: nextM, day: nextD, iso });
  };

  const handleOngoingChange = () => {
    const next = !isOngoing;
    // ✅ 상시 ON이면 마감일 비우기, OFF면 날짜는 그대로 (사용자가 다시 입력)
    onChange({
      deadlineISO: next ? undefined : deadlineISO,
      headCount,
      preferenceText,
      alwaysHiring: next,
    });
    if (next) {
      setYear("");
      setMonth("");
      setDay("");
    }
    console.log("[RecruitInfo] 상시모집 토글 ->", next);
  };

  return (
    <div className="w-full space-y-5">
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
            onChange={(e) => {
              const v = e.target.value;
              setYear(v);
              pushDate(v, month, day);
            }}
            disabled={isOngoing}
            className={`w-[72px] h-[40px] !px-3 rounded-[10px] border text-sm 
              ${isOngoing ? "border-[#DEDEDE] bg-[#F7F7F7] text-[#999]" : "border-[#DEDEDE] bg-white text-[#333]"}`}
          />
          <span className="text-[#333] text-[12px]">년</span>
          <input
            type="number"
            value={month}
            onChange={(e) => {
              const v = e.target.value;
              setMonth(v);
              pushDate(year, v, day);
            }}
            disabled={isOngoing}
            className={`w-[56px] h-[40px] !px-3 rounded-[10px] border text-sm
              ${isOngoing ? "border-[#DEDEDE] bg-[#F7F7F7] text-[#999]" : "border-[#DEDEDE] bg-white text-[#333]"}`}
          />
          <span className="text-[#333] text-[12px]">월</span>
          <input
            type="number"
            value={day}
            onChange={(e) => {
              const v = e.target.value;
              setDay(v);
              pushDate(year, month, v);
            }}
            disabled={isOngoing}
            className={`w-[56px] h-[40px] !px-3 rounded-[10px] border text-sm
              ${isOngoing ? "border-[#DEDEDE] bg-[#F7F7F7] text-[#999]" : "border-[#DEDEDE] bg-white text-[#333]"}`}
          />
          <span className="text-[#333] text-[12px]">일</span>
        </div>

        {/* 상시 모집 */}
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
            value={headCount ?? ""}
            onChange={(e) => {
              const v = e.target.value ? Number(e.target.value) : undefined;
              onChange({ deadlineISO, headCount: v, preferenceText, alwaysHiring: isOngoing });
              console.log("[RecruitInfo] headCount ->", v);
            }}
            className="w-[100px] h-[40px] !px-3 rounded-[10px] border border-[#DEDEDE] text-sm"
          />
          <span className="text-sm text-[#333]">명</span>
        </div>
      </div>

      {/* 우대사항 */}
      <div className="space-y-1 !mt-3">
        <p className="font-semibold text-[16px] text-[#333] !pb-5">우대사항</p>
        <input
          type="text"
          value={preferenceText ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({ deadlineISO, headCount, preferenceText: v, alwaysHiring: isOngoing });
            console.log("[RecruitInfo] preferenceText ->", v);
          }}
          className="w-full h-[40px] !px-3 rounded-[10px] border border-[#DEDEDE] "
        />
        <p className="text-[12px] text-[#555]/85 !mt-2">예) 유사 업무 경험, 인근 거주</p>
      </div>
    </div>
  );
};

export default RecruitInfo;
