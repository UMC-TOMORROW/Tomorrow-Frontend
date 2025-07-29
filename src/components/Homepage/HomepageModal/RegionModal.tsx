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
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
  ];

  const [selectedRegion, setSelectedRegion] = useState("");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-end"
      style={{ zIndex: 9999, fontFamily: "Pretendard" }}
    >
      <div className="w-[360px] h-[562px] bg-white rounded-[20px] flex flex-col items-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] -translate-y-5">
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
          className="w-[300px] h-[52px] mt-[15px] mb-[15px] flex items-center justify-center rounded-[12px] text-[16px] font-bold text-black gap-[8px]"
          style={{
            backgroundColor: palette.primary.primaryLight,
            fontFamily: "Pretendard",
          }}
        >
          <span className="font-bold">서울</span>
          <span className="text-[18px] font-medium">&gt;</span>
          <span className="font-bold">{selectedRegion || "전체"}</span>
        </div>
        {/* 동 리스트 */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-3">
            {regions.map((dong, index) => {
              let radiusClass = "";
              if (index === 0) radiusClass = "rounded-tl-[12px]";
              if (index === 2) radiusClass = "rounded-tr-[12px]";
              if (index === regions.length - 3)
                radiusClass = "rounded-bl-[12px]";
              if (index === regions.length - 1)
                radiusClass = "rounded-br-[12px]";

              return (
                <button
                  key={dong}
                  onClick={() => setSelectedRegion(dong)}
                  className={`w-[110px] h-[60px] text-[14px] border border-[#ccc] font-[Pretendard] ${radiusClass} ${
                    selectedRegion === dong
                      ? "bg-[#B8CDB9] !font-bold"
                      : "bg-white"
                  }`}
                >
                  {dong}
                </button>
              );
            })}
          </div>
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
