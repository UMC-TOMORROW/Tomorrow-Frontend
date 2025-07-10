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
      className="fixed inset-0 bg-black/30 flex justify-center items-end font-[Pretendard]"
      style={{ zIndex: 9999 }}
    >
      <div className="w-[393px] h-[589px] bg-[#F3F7F2] rounded-t-[20px] flex flex-col items-center relative overflow-hidden">
        {/* 상단 헤더 */}
        <div
          className="w-full h-[55px] flex items-center justify-center text-[18px] font-bold text-[#222] relative"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          지역 선택
          <button
            onClick={onClose}
            className="absolute right-[16px] top-[50%] translate-y-[-50%] text-[16px]"
            style={{ width: "20px", height: "20px" }}
          >
            ✕
          </button>
        </div>

        {/* 선택 경로 */}
        <div
          className="w-[360px] h-[52px] mt-[15px] mb-[15px] flex items-center justify-center rounded-[12px] text-[16px] font-medium text-[#333]"
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
              className={`w-[120px] h-[70px] text-[12px] border border-[#ccc] ${
                selectedRegion === dong
                  ? "bg-[#BDD7BF] !font-bold"
                  : "bg-white !font-bold"
              }`}
            >
              {dong}
            </button>
          ))}
        </div>

        {/* 선택 완료 버튼 */}
        <div className="w-full mt-auto mb-[20px] flex justify-center">
          <button
            className="w-[270px] h-[45px] rounded-[12px] !text-white text-[15px] !font-bold"
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
