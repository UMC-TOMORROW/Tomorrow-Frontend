import { useState } from "react";
import palette from "../../../styles/theme";

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (regions: string[]) => void;
}

const RegionModal = ({ isOpen, onClose, onSubmit }: RegionModalProps) => {
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
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ];

  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(selectedRegion === "전체" ? [] : [selectedRegion]);
    onClose();
  };

  // 🔧 모서리 인덱스 계산(3열 그리드)
  const COLS = 3;
  const last = regions.length - 1;
  const rem = regions.length % COLS; // 0, 1, 2
  const bottomRightIdx = last;
  const bottomLeftIdx =
    rem === 0
      ? last - (COLS - 1) // 끝줄이 3개 꽉 찼을 때: length-2
      : rem === 1
      ? last // 끝줄이 1개일 때: 그 1개가 좌/우 아래 모서리 둘 다
      : last - 1; // 끝줄이 2개일 때: length-1이 오른쪽, length-2가 왼쪽

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-end"
      style={{ zIndex: 9999, fontFamily: "Pretendard" }}
    >
      <div className="w-[360px] h-[562px] bg-white rounded-t-[20px] flex flex-col items-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        {/* 상단 바 */}
        <div
          className="w-full h-[55px] flex items-center justify-center text-[18px] font-semibold text-black relative"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          근무 지역 선택
          <button
            onClick={onClose}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[16px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* 선택 경로 박스 */}
        <div
          className="w-[300px] h-[52px] mt-[15px] mb-[25px] rounded-[18px] flex items-center justify-center gap-[8px] text-[16px] font-bold"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          <span>서울</span>
          <span className="text-[18px]">&gt;</span>
          <span>{selectedRegion}</span>
        </div>

        {/* 동 리스트 */}
        <div className="overflow-y-scroll h-[300px]">
          <div className="grid grid-cols-3">
            {regions.map((dong, index) => {
              let radiusClass = "";
              if (index === 0) radiusClass += " rounded-tl-[12px]";
              if (index === COLS - 1) radiusClass += " rounded-tr-[12px]";
              if (index === bottomLeftIdx) radiusClass += " rounded-bl-[12px]";
              if (index === bottomRightIdx) radiusClass += " rounded-br-[12px]";

              const isSelected = selectedRegion === dong;

              return (
                <button
                  key={dong}
                  onClick={() => setSelectedRegion(dong)}
                  className={`w-[110px] h-[60px] text-[14px] border font-bold${radiusClass} ${
                    isSelected
                      ? "bg-[#B8CDB9] text-black"
                      : "bg-white text-black"
                  }`}
                  style={{
                    borderColor: isSelected ? "#B8CDB9" : "#DDDDDD",
                    fontWeight: isSelected ? "700" : "500",
                    fontFamily: "Pretendard",
                  }}
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
            className="w-[316px] h-[50px] rounded-[12px] !text-white text-[16px] !font-bold"
            style={{ backgroundColor: palette.primary.primary }}
            onClick={handleSubmit}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
