import React, { useState } from "react";
import palette from "../../../styles/theme";
import { getJobsByType } from "../../../apis/HomePage"; // ✅ 이 부분 필요
import type { Job } from "../../../types/homepage";

interface TypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  setJobList: (jobs: Job[]) => void;
}

const jobs = [
  "서빙",
  "주방보조/설거지",
  "카페/베이커리",
  "심부름/소일거리",
  "전단지/홍보",
  "어르신 돌봄",
  "아이 돌봄",
  "미용/뷰티",
  "과외/학원",
  "사무보조",
];

const TypeModal: React.FC<TypeModalProps> = ({
  isOpen,
  onClose,
  setJobList,
}) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClick = (job: string) => {
    setSelectedJob((prev) => (prev === job ? null : job));
  };

  const handleSubmit = async () => {
    try {
      const jobList = await getJobsByType(
        selectedJob && selectedJob !== "전체" ? [selectedJob] : []
      );
      setJobList(jobList);
    } catch (error) {
      console.error("업무 유형별 일자리 조회 실패:", error);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center items-end bg-black/30"
      style={{ fontFamily: "Pretendard" }}
    >
      {/* 모달 내용 */}
      <div className="w-[380px] bg-white rounded-[20px] flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.1)] -translate-y-5">
        {/* 상단 영역 */}
        <div
          className="w-full h-[55px] flex items-center justify-center relative rounded-t-[20px]"
          style={{ backgroundColor: palette.primary.primaryLight }}
        >
          <span className="text-[18px] font-bold">업무 유형 선택</span>
          <button
            onClick={onClose}
            className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[16px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* 버튼들 */}
        <div className="flex flex-wrap !px-3 !py-5 gap-x-[10px] gap-y-[20px] justify-start">
          {jobs.map((job) => {
            const isSelected = selectedJob === job;
            return (
              <button
                key={job}
                onClick={() => handleClick(job)}
                className={`h-[25px] px-[10px] text-[16px] rounded-[10px] cursor-pointer border ${
                  isSelected
                    ? "!text-white"
                    : "text-[#555555D9] border-[#555555D9] bg-white"
                }`}
                style={{
                  backgroundColor: isSelected
                    ? palette.primary.primary
                    : "white",
                  borderColor: isSelected
                    ? palette.primary.primary
                    : palette.gray.default,
                }}
              >
                {job}
              </button>
            );
          })}
        </div>

        {/* 하단 버튼 + 여백 포함 */}
        <div className="w-full !mt-2 !mb-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-[316px] h-[50px] rounded-[12px] text-[18px] font-bold !text-white"
            style={{ backgroundColor: palette.primary.primary }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypeModal;
