import { useState } from "react";
import palette from "../../../styles/theme";

const RegionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const regions = [
    "전체",
    "개포동",
    "논현동",
    "대치동",
    "도곡동",
    "삼성동",
    "새곡동",
    "수서동",
    "신사동",
    "압구정동",
    "역삼동",
    "율현동",
    "일원동",
    "자곡동",
    "청담동",
  ];

  const [selectedRegion, setSelectedRegion] = useState("");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-end"
      style={{ zIndex: 9999, fontFamily: "Pretendard" }}
    >
      <div className="w-[393px] h-[589px] bg-white rounded-[20px] flex flex-col items-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] -translate-y-5">
        {/* 상단 헤더 */}
        <div
          className="w-full h-[55px] flex items-center justify-center text-[18px] font-bold text-black relative"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          근무 지역 선택
          <button
            onClick={onClose}
            className="absolute right-[16px] top-1/2 transform -translate-y-1/2 w-[10px] h-[10px] text-[16px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* 선택 경로 */}
        <div
          className="w-[360px] h-[52px] mt-[15px] mb-[15px] flex items-center justify-center rounded-[12px] text-[16px] font-bold text-black"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          서울 &gt; 강남구 &gt;&nbsp;
          <span className="font-bold">{selectedRegion || "전체"}</span>
        </div>

        {/* 동 리스트 */}
        <div className="grid grid-cols-3 gap-[0px] w-[360px]">
          {regions.map((dong) => (
            <button
              key={dong}
              onClick={() => setSelectedRegion(dong)}
              style={{ fontFamily: "Pretendard" }}
              className={`w-[120px] h-[70px] text-[14px] border border-[#ccc] ${
                selectedRegion === dong ? "bg-[#B8CDB9] !font-bold" : "bg-white"
              }`}
            >
              {dong}
            </button>
          ))}
        </div>

        {/* 선택 완료 버튼 */}
        <div className="w-full mt-auto mb-[30px] flex justify-center">
          <button
            className="w-[316px] h-[50px] rounded-[12px] !text-white text-[18px] !font-bold"
            style={{ backgroundColor: palette.primary.primary }}
            onClick={onClose}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
