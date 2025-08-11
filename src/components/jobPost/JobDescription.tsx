// components/jobPost/JobDescription.tsx
import React from "react";
import imagePlus from "../../assets/jobRegister/image_plus.png";

const jobTypes = [
  "앉아서 근무 중심",
  "서서 근무 중심",
  "가벼운 물건 운반",
  "무거운 물건 운반",
  "신체 활동 중심",
  "사람 응대 중심",
];

type Props = {
  // 설명 본문
  value: string;
  onChange: (text: string) => void;

  // 작업 환경 태그(다중)
  envTags?: string[];
  onEnvTagsChange?: (arr: string[]) => void;

  // 이미지 파일
  imageFile?: File | null;
  onImageFileChange?: (file: File | null) => void;
};

export default function JobDescription({
  value,
  onChange,
  envTags = [],
  onEnvTagsChange,
  imageFile,
  onImageFileChange,
}: Props) {
  const toggleTag = (tag: string) => {
    if (!onEnvTagsChange) return;
    const next = envTags.includes(tag) ? envTags.filter((t) => t !== tag) : [...envTags, tag];
    console.log("[JobDescription] envTags:", next);
    onEnvTagsChange(next);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    console.log("[JobDescription] image:", file ? file.name : null);
    onImageFileChange?.(file);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <h2
          style={{ marginBottom: "20px", fontWeight: "700" }}
          className="text-[18px] text-[#333] leading-[100%] font-pretendard"
        >
          일에 대해 설명해주세요.
        </h2>

        {/* 태그 – 디자인 그대로 */}
        <div className="flex flex-wrap gap-[10px] !mb-4">
          {jobTypes.map((tag) => {
            const selected = envTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-[10px] py-[4px] rounded-[7px] border-[1px] text-[13px] leading-none whitespace-nowrap transition
                  ${
                    selected
                      ? "bg-[#729A73] !text-white border-[#729A73]"
                      : "bg-white text-[#333] border-[#D9D9D9] hover:border-[#BBB] active:scale-[0.99]"
                  }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* 설명 */}
        <textarea
          placeholder="일에 대한 구체적인 사항을 알려주세요."
          value={value}
          onChange={(e) => {
            console.log("[JobDescription] text change");
            onChange(e.target.value);
          }}
          className="w-full h-[100px] !p-3 border border-[#DEDEDE] rounded-[10px] p-3 text-sm text-[#333] placeholder:text-[#999] resize-none"
        />
      </div>

      {/* 사진 업로드 */}
      <div>
        <h2 className="text-[14px] font-semibold text-[#333] !mb-2">일과 관련된 사진 (선택)</h2>

        <label
          htmlFor="image-upload"
          className="w-[48px] h-[48px] border border-[#DEDEDE] rounded-[10px] flex items-center justify-center cursor-pointer"
        >
          <img src={imagePlus} alt="사진 추가" className="w-5 h-5" />
        </label>
        <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {imageFile && <p className="text-[12px] text-[#666] mt-2">{imageFile.name}</p>}
      </div>
    </div>
  );
}
