import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaClock } from "react-icons/fa";
import checkActive from "../../assets/check_active.png";
import checkInactive from "../../assets/check_inactive.png";
import time from "../../assets/filter/time.png";

const timeOptions = [
  "오전 08:00",
  "오전 08:30",
  "오전 09:00",
  "오전 09:30",
  "오전 10:00",
  "오전 10:30",
  "오전 11:00",
  "오전 11:30",
  "오후 12:00",
  "오후 12:30",
  "오후 01:00",
  "오후 01:30",
  "오후 02:00",
  "오후 02:30",
  "오후 03:00",
  "오후 03:30",
  "오후 04:00",
  "오후 04:30",
  "오후 05:00",
  "오후 05:30",
  "오후 06:00",
  "오후 06:30",
  "오후 07:00",
];

const toKey = (t: string) => {
  const [ampm, hhmm] = t.split(" ");
  let [hh, mm] = hhmm.split(":").map(Number);
  if (ampm === "오전") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh += 12;
  }
  return hh * 60 + mm;
};

const ITEM_H = 32;

export default function JobTimeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);

  const [startTime, setStartTime] = useState("오전 09:00");
  const [endTime, setEndTime] = useState("오후 06:00");

  const [draftStart, setDraftStart] = useState(startTime);
  const [draftEnd, setDraftEnd] = useState(endTime);

  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const startIdx = useMemo(() => timeOptions.findIndex((t) => t === draftStart), [draftStart]);
  const endIdx = useMemo(() => timeOptions.findIndex((t) => t === draftEnd), [draftEnd]);

  const openAndSync = () => {
    setDraftStart(startTime);
    setDraftEnd(endTime);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    if (startRef.current && startIdx >= 0) {
      startRef.current.scrollTo({ top: Math.max(0, startIdx * ITEM_H - ITEM_H), behavior: "smooth" });
    }
    if (endRef.current && endIdx >= 0) {
      endRef.current.scrollTo({ top: Math.max(0, endIdx * ITEM_H - ITEM_H), behavior: "smooth" });
    }
  }, [isOpen, startIdx, endIdx]);

  const disabledEnd = (t: string) => !!draftStart && toKey(t) <= toKey(draftStart);

  return (
    <div className="w-full">
      <h2
        style={{ marginBottom: "20px", fontWeight: "600" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        일하는 시간
      </h2>

      {/* 표시 영역 */}
      <div
        className="!px-3 border border-[#555]/85 rounded-[10px] h-[44px] flex items-center justify-between cursor-pointer"
        onClick={() => (isOpen ? setIsOpen(false) : openAndSync())}
      >
        <span className="text-[14px] text-[#555]/85">
          {startTime && endTime ? `${startTime} ~ ${endTime}` : "시간을 선택해주세요"}
        </span>
        <img src={time} alt="시간" className="w-5 h-5" />
      </div>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="!mt-3 rounded-[12px] bg-[#DFE8DE] p-4">
          <div className="grid grid-cols-[1fr_24px_1fr] gap-2 items-start">
            {/* 시작 */}
            <div ref={startRef} className="h-40 overflow-y-auto rounded-[8px] bg-transparent">
              {timeOptions.map((t) => {
                const active = t === draftStart;
                return (
                  <button
                    key={`start-${t}`}
                    type="button"
                    onClick={() => {
                      setDraftStart(t);
                      if (draftEnd && toKey(draftEnd) <= toKey(t)) setDraftEnd("");
                    }}
                    className={`w-full h-[32px] flex items-center justify-center
    ${active ? "text-[#5E7C62] font-semibold" : "text-[#6B736B] opacity-60"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* ~ */}
            <div className="h-40 flex items-center justify-center text-[#6B736B] opacity-60">~</div>

            {/* 종료 */}
            <div ref={endRef} className="h-40 overflow-y-auto rounded-[8px] bg-transparent">
              {timeOptions.map((t) => {
                const disabled = disabledEnd(t);
                const active = t === draftEnd;
                return (
                  <button
                    key={`end-${t}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setDraftEnd(t)}
                    className={`w-full h-[32px] flex items-center justify-center
    ${active ? "text-[#5E7C62] font-semibold" : "text-[#6B736B] opacity-60"}
    ${disabled ? "!opacity-30 cursor-not-allowed" : ""}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 액션 */}
          <div className="!my-4 !mx-6 !pb-5 flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                setDraftStart(startTime);
                setDraftEnd(endTime);
              }}
              className="flex-3 h-[40px] rounded-[10px] !bg-white border border-[#729A73] text-[#729A73] !font-semibold hover:bg-[#729A73] hover:text-white transition"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => {
                if (!draftStart || !draftEnd) return;
                if (toKey(draftEnd) <= toKey(draftStart)) return;
                setStartTime(draftStart);
                setEndTime(draftEnd);
                setIsOpen(false);
              }}
              disabled={!draftStart || !draftEnd || toKey(draftEnd) <= toKey(draftStart)}
              className="flex-4 w-[145px] h-[40px] rounded-[10px] bg-[#729A73]
             text-white text-[14px] leading-[100%] text-center
             font-pretendard !font-semibold
             disabled:opacity-40 disabled:cursor-not-allowed"
            >
              적용하기
            </button>
          </div>
        </div>
      )}

      {/* 협의 가능 */}
      <button
        type="button"
        className="flex items-center gap-1 !mt-1 text-sm text-[#666]"
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
}
