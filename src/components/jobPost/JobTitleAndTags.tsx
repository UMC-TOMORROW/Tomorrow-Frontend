import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const TAGS = [
  "서빙",
  "주방보조/설거지",
  "카페/베이커리",
  "과외/학원",
  "심부름/소일거리",
  "전단지/홍보",
  "어르신 돌봄",
  "아이 돌봄",
  "미용/뷰티",
  "사무보조",
  "기타",
];

const COLLAPSED_COUNT = 3; // 접힘 상태에서 보여줄 태그 개수 (3~4 중 선택)

export default function JobTitleAndTags() {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const visibleTags = expanded ? TAGS : TAGS.slice(0, COLLAPSED_COUNT);

  return (
    <div className="w-full">
      <h2
        style={{ marginBottom: "25px", fontWeight: "700" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        업무 제목을 작성해주세요.
      </h2>

      {/* 제목 입력 */}
      <input
        id="jobTitle"
        type="text"
        className="w-[335px] h-[39px] rounded-[10px] bg-white
             border border-[#555555D9] px-3 outline-none
             focus:border-[#555555D9] focus:ring-2 focus:ring-[#555555D9]/20 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 태그 영역 */}
      <div className="relative flex items-start !py-5">
        {/* 태그 리스트 */}
        <div
          className={`flex-1 gap-[10px] pr-2
                ${expanded ? "flex flex-wrap" : "flex flex-nowrap overflow-hidden"}`}
        >
          {visibleTags.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-[10px] py-[4px] rounded-[7px] border-[1px] !border-[#555]/85 text-[13px] leading-none
                      transition whitespace-nowrap
            ${
              selected
                ? "bg-[#729A73] !text-white !border-[#729A73]"
                : "bg-white text-[#333] border-[#D9D9D9] hover:border-[#BBB] active:scale-[0.99]"
            }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* 펼치기/접기 버튼 - 항상 같은 자리 */}
        <button
          type="button"
          aria-label={expanded ? "태그 접기" : "태그 더보기"}
          onClick={() => setExpanded((p) => !p)}
          className="flex-shrink-0 ml-2 h-8 w-8 flex items-center justify-center rounded-full
               hover:bg-[#F4F4F4] active:scale-95"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
    </div>
  );
}
