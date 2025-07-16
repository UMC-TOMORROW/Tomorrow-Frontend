import React, { useState } from "react";
import palette from "../../../styles/theme";

interface TypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const jobs = [
  "서빙",
  "주방보조/설거지",
  "카페/베이커리",
  "과외/학원",
  "심부름/소일거리",
  "어르신 돌봄",
  "아이 돌봄",
  "미용/뷰티",
  "전단지/홍보",
  "사무보조",
];

const TypeModal: React.FC<TypeModalProps> = ({ isOpen, onClose }) => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClick = (job: string) => {
    setSelectedJob((prev) => (prev === job ? null : job));
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "393px",
        height: "233px",
        zIndex: 9999,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
        fontFamily: "Pretendard",
        overflow: "hidden",
      }}
    >
      {/* 상단 바 */}
      <div
        className="flex h-[55px] relative"
        style={{
          backgroundColor: palette.primary.primaryLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="font-bold text-[15px]"
          style={{ fontFamily: "Pretendard" }}
        >
          하는 일
        </span>
        <button
          onClick={onClose}
          className="absolute right-[16px] top-1/2 transform -translate-y-1/2 w-[10px] h-[10px] text-[16px] flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* 버튼들 */}
      <div
        style={{
          padding: "16px",
          paddingBottom: "0px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "flex-start",
        }}
      >
        {jobs.map((job) => {
          const isSelected = selectedJob === job;
          return (
            <button
              key={job}
              onClick={() => handleClick(job)}
              className={`h-[25px] px-[10px] text-[12px] rounded-[10px] font-medium cursor-pointer border ${
                isSelected ? "!text-white" : "text-black border-[#999] bg-white"
              }`}
              style={{
                fontFamily: "Pretendard",
                backgroundColor: isSelected ? palette.primary.primary : "white",
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
    </div>
  );
};

export default TypeModal;
