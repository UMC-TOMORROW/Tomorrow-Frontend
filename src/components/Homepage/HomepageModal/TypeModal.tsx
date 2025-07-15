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
        bottom: "0", // 넷바를 가리도록 화면 바닥에 붙임
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
        style={{
          backgroundColor: "#CFE3CE",
          height: "55px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>하는 일</span>
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[50%] translate-y-[-50%] text-[16px]"
          style={{ width: "20px", height: "20px" }}
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
              style={{
                height: "25px",
                padding: "0 10px",
                fontSize: "12px",
                border: `1px solid ${
                  isSelected ? palette.primary.primary : "#999"
                }`,
                borderRadius: "10px",
                backgroundColor: isSelected ? palette.primary.primary : "#fff",
                color: isSelected ? "#fff" : "#000",
                fontWeight: 500,
                cursor: "pointer",
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
