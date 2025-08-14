import { useState } from "react";
import palette from "../../../styles/theme";

interface TypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (types: string[]) => void;
}

const jobCategoryMap = {
  서빙: "SERVING",
  "주방보조/설거지": "KITCHEN_HELP",
  "과외/학원": "TUTORING",
  "카페/베이커리": "CAFE_BAKERY",
  "심부름/소일거리": "ERRAND",
  "전단지/홍보": "PROMOTION",
  "어르신 돌봄": "SENIOR_CARE",
  "아이 돌봄": "CHILD_CARE",
  "미용/뷰티": "BEAUTY",
  사무보조: "OFFICE_HELP",
} as const;

const jobs = Object.keys(jobCategoryMap);

const TypeModal = ({ isOpen, onClose, onSubmit }: TypeModalProps) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClick = (job: string) => {
    setSelectedJob((prev) => (prev === job ? null : job));
  };

  const handleSubmit = () => {
    const englishType = selectedJob
      ? jobCategoryMap[selectedJob as keyof typeof jobCategoryMap]
      : null;
    onSubmit(englishType ? [englishType] : []);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-end bg-black/30 font-[Pretendard]">
      <div className="w-[380px] bg-white rounded-[20px] flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.1)] -translate-y-5">
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

        <div className="flex flex-wrap !px-3 !py-5 gap-x-[10px] gap-y-[20px] justify-start">
          {jobs.map((job) => {
            const isSelected = selectedJob === job;
            return (
              <button
                key={job}
                onClick={() => handleClick(job)}
                className={`h-[25px] px-[10px] text-[14px] rounded-[10px] cursor-pointer border ${
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

        <div className="w-full !mt-2 !mb-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-[316px] h-[50px] rounded-[12px] text-[18px] !font-bold !text-white"
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
