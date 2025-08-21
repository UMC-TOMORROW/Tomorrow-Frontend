// components/jobPost/JobTitleAndTags.tsx
import { useMemo, useState } from "react";
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

const COLLAPSED_COUNT = 3;

type Props = {
  title: string;
  onTitleChange: (v: string) => void;

  // ✅ 다중 선택(권장)
  selectedTags?: string[];
  onSelectedTagsChange?: (arr: string[]) => void;

  // 🔁 기존(대표+환경) 방식도 지원(옵션)
  primaryCategoryKo?: string;
  onPrimaryCategoryChange?: (v: string) => void;
  envCategoriesKo?: string[];
  onEnvCategoriesChange?: (arr: string[]) => void;

  imageFile?: File;
  onImageFileChange?: (f?: File) => void;
};

export default function JobTitleAndTags(props: Props) {
  const {
    title,
    onTitleChange,
    selectedTags,
    onSelectedTagsChange,
    primaryCategoryKo,
    onPrimaryCategoryChange,
    envCategoriesKo,
    onEnvCategoriesChange,
  } = props;

  const [expanded, setExpanded] = useState(false);

  // 선택 세트(우선순위: selectedTags → primary+env 조합)
  const selectedSet = useMemo(() => {
    const s = new Set<string>();
    if (selectedTags && Array.isArray(selectedTags)) {
      selectedTags.forEach((t) => s.add(t));
      return s;
    }
    if (primaryCategoryKo) s.add(primaryCategoryKo);
    (envCategoriesKo ?? []).forEach((t) => s.add(t));
    return s;
  }, [selectedTags, primaryCategoryKo, envCategoriesKo]);

  const visibleTags = expanded ? TAGS : TAGS.slice(0, COLLAPSED_COUNT);

  const toggleTag = (tag: string) => {
    const isSelected = selectedSet.has(tag);
    console.log("[JobTitleAndTags] toggleTag:", {
      tag,
      isSelected,
      primaryCategoryKo,
      envCategoriesKo,
      selectedTags,
    });

    // 1) 다중선택 제어형 경로
    if (onSelectedTagsChange) {
      if (isSelected) {
        onSelectedTagsChange((selectedTags ?? []).filter((t) => t !== tag));
      } else {
        onSelectedTagsChange([...(selectedTags ?? []), tag]);
      }
      return;
    }
    const hasPrimary = !!primaryCategoryKo;
    const env = envCategoriesKo ?? [];

    if (isSelected) {
      if (tag === primaryCategoryKo) {
        const remaining = env.filter((t) => t !== tag);
        if (remaining.length) {
          onPrimaryCategoryChange?.(remaining[0]);
          onEnvCategoriesChange?.(remaining.slice(1));
        } else {
          onPrimaryCategoryChange?.("");
          onEnvCategoriesChange?.([]);
        }
      } else {
        onEnvCategoriesChange?.(env.filter((t) => t !== tag));
      }
      return;
    }

    if (!hasPrimary) {
      onPrimaryCategoryChange?.(tag);
    } else if (!env.includes(tag)) {
      onEnvCategoriesChange?.([...env, tag]);
    }
  };

  return (
    <div className="w-full">
      <h2
        style={{ marginBottom: "25px", fontWeight: "700" }}
        className="text-[18px] text-[#333] leading-[100%] font-pretendard"
      >
        업무 제목을 작성해주세요.
      </h2>

      <input
        id="jobTitle"
        type="text"
        className=" w-full h-[39px] rounded-[10px] bg-white
             border border-[#555555D9] !px-3 outline-none
             focus:border-[#555555D9] focus:ring-2 focus:ring-[#555555D9]/20 transition"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />

      <div className="relative flex items-start !py-5">
        <div className={`flex-1 gap-[10px] pr-2 ${expanded ? "flex flex-wrap" : "flex flex-nowrap overflow-hidden"}`}>
          {visibleTags.map((tag) => {
            const selected = selectedSet.has(tag);
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
