import { useState } from "react";
import palette from "../../../styles/theme";
import { getJobsByRegion } from "../../../apis/HomePage";
import type { Job } from "../../../types/homepage";

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  setJobList: (jobs: Job[]) => void;
}

const RegionModal = ({ isOpen, onClose, setJobList }: RegionModalProps) => {
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

  const [selectedRegion, setSelectedRegion] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const queryRegions = ["서울특별시"];
    if (selectedRegion && selectedRegion !== "전체") {
      queryRegions.push(selectedRegion);
    }

    try {
      const jobList = await getJobsByRegion(queryRegions);
      setJobList(jobList);
    } catch (e) {
      console.error("일자리 목록 불러오기 실패:", e);
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-end"
      style={{ zIndex: 9999, fontFamily: "Pretendard" }}
    >
      <div className="w-[360px] h-[562px] bg-white rounded-t-[20px] flex flex-col items-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        {/* 상단 바 */}
        <div
          className="w-full h-[55px] flex items-center justify-center text-[15px] font-semibold text-black relative"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          근무 지역 선택
          <button
            onClick={onClose}
            className="absolute right-[16px] top-1/2 transform -translate-y-1/2 text-[10px] w-[20px] h-[20px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* 선택 경로 박스 */}
        <div
          className="w-[300px] h-[52px] mt-[15px] mb-[25px] rounded-[12px] flex items-center justify-center gap-[8px] text-[16px] font-bold"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          <span>서울</span>
          <span className="text-[18px]">&gt;</span>
          <span>{selectedRegion || "전체"}</span>
        </div>

        {/* 동 리스트 */}
        <div className="overflow-y-scroll h-[300px]">
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
                  className={`w-[110px] h-[60px] text-[14px] border font-bold ${radiusClass} ${
                    selectedRegion === dong
                      ? "bg-[#B8CDB9] text-black"
                      : "bg-white text-black"
                  }`}
                  style={{
                    borderColor:
                      selectedRegion === dong ? "#B8CDB9" : "#DDDDDD",
                    fontWeight: selectedRegion === dong ? "700" : "500",
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
            className="w-[316px] h-[50px] rounded-[12px] text-white text-[16px] font-bold"
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
