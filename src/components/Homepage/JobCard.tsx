import { useState } from "react";
import palette from "../../styles/theme";

interface JobCardProps {
  company: string;
  title: string;
  tags: string[];
  duration: string;
  review: string;
  location: string;
  wage: string;
  isFirst?: boolean;
}

const JobCard = ({
  company,
  title,
  tags,
  duration,
  review,
  location,
  wage,
  isFirst,
}: JobCardProps) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isActive = clicked || hovered;

  return (
    <div className={`bg-white w-[393px] mx-auto ${isFirst ? "" : ""}`}>
      <div className="px-[16px] pt-[10px] pb-[6px]">
        {/* 텍스트 + 사진 */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-3">
            <p className="text-[12px] text-black">{company}</p>
            <p className="text-[16px] font-bold">{title}</p>
            <p
              className="text-[14px] whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ color: palette.primary.primary }}
            >
              {tags.join(", ")}
            </p>
            <p className="text-[12px] !mt-1.5 text-black">
              <span style={{ color: palette.gray.default }}>{duration}</span>
              {review && (
                <>
                  &nbsp; ★ <span>{review}</span>
                </>
              )}
            </p>
          </div>

          {/* 사진 */}
          <div className="flex items-center !mt-3 justify-center h-full w-[60px]">
            <img
              src="/src/assets/logo/logo.png"
              className="h-[50px] w-[60px]"
            />
          </div>
        </div>

        {/* 구분선 (카드 내 선) */}
        <div className="-mx-[0px] mt-[4px] h-[1px] bg-[#BFBFBF8C]" />

        {/* 하단 위치 + 버튼 */}
        <div className="flex justify-between items-center !mb-1 !mt-2">
          <p className="text-[13px] text-black">
            {location} &nbsp; 시 {wage}
          </p>
          <button
            onClick={() => setClicked(!clicked)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-[80px] h-[28px] text-[14px] mt-1 border rounded-[7px] transition-colors duration-200"
            style={{
              fontFamily: "Pretendard",
              backgroundColor: isActive ? "#729A73" : "transparent",
              color: isActive ? "#fff" : "#555555D9",
              borderColor: isActive ? "#729A73" : "#555555D9",
            }}
          >
            지원하기
          </button>
        </div>
      </div>

      {/* 바깥쪽 1px 회색 구분선 */}
      <div
        className="-mx-[16px]"
        style={{ height: "1px", backgroundColor: palette.gray.default }}
      />
    </div>
  );
};

export default JobCard;
