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

  return (
    <div className={`bg-white w-[393px] mx-auto ${isFirst ? "" : ""}`}>
      <div className="px-[16px] pt-[10px] pb-[6px]">
        {/* 텍스트 + 사진 */}
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-3">
            <p className="text-[12px] text-black">{company}</p>
            <p className="text-[14px] font-bold">{title}</p>
            <p
              className="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ color: palette.primary.primary }}
            >
              {tags.join(", ")}
            </p>
            <p className="text-[12px] text-black">
              {duration}
              {review && (
                <>
                  &nbsp; ★ <span>{review}</span>
                </>
              )}
            </p>
          </div>

          {/* 사진 */}
          <div className="flex flex-col items-end justify-between">
            <div className="w-[79px] h-[79px] bg-[#E8EAEE] border mb-[5px]" />
          </div>
        </div>

        {/* 구분선 (카드 내 선) */}
        <div
          className="-mx-[16px] mt-[4px]"
          style={{ height: "1px", backgroundColor: palette.gray.default }}
        />

        {/* 하단 위치 + 버튼 */}
        <div className="flex justify-between items-center mt-[4px]">
          <p className="text-[12px] text-black">
            {location} &nbsp; 시 {wage}
          </p>
          <button
            onClick={() => setClicked(!clicked)}
            className="w-[75px] h-[21px] text-[12px] border rounded-full"
            style={{
              color: clicked ? "#fff" : palette.gray.default,
              backgroundColor: clicked
                ? palette.primary.primary
                : "transparent",
              borderColor: clicked ? palette.primary.primary : "#888",
              fontFamily: "Pretendard",
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
