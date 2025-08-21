import { SlArrowLeft } from "react-icons/sl";
import check_active from "../../assets/check_active.png";
import check_inactive from "../../assets/check_inactive.png";
import { useState } from "react";
import type { WorkPreferenceType } from "../../types/workPreference";
import { patchPreferences } from "../../apis/recommendation";
import { Link, useNavigate } from "react-router-dom";

const PREFERENCE_MAP: Record<string, WorkPreferenceType> = {
  "앉아서 근무 중심": "SIT",
  "서서 근무 중심": "STAND",
  "물건 운반": "DELIVERY",
  "활동 중심": "PHYSICAL",
  "사람 응대 중심": "HUMAN",
};

const WorkPreference = () => {
  const navigate = useNavigate();
  const options = [
    "앉아서 근무 중심",
    "서서 근무 중심",
    "물건 운반",
    "활동 중심",
    "사람 응대 중심",
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    const preferences: WorkPreferenceType[] = selected
      .map((option) => PREFERENCE_MAP[option])
      .filter(Boolean);

    try {
      const saved = await patchPreferences(preferences);
      if (saved) {
        alert("희망 조건이 저장되었습니다!");
      }
    } catch (error) {
      console.error("조건 저장 실패", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        {/* 상단 헤더 */}
        <section className="relative flex justify-center items-center h-[52px] border-b-[1.5px] border-[#DEDEDE]">
          <SlArrowLeft
            className="absolute left-[15px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div className="text-[20px]" style={{ fontWeight: 700 }}>
            내 몸에 맞는 일 찾기
          </div>
        </section>

        {/* 설명 텍스트 */}
        <section
          className="pt-[40px] pb-[40px] pl-[37px]"
          style={{ fontWeight: 700 }}
        >
          <p className="text-[18px] text-[#729A73]">몸과 마음에 맞는 일,</p>
          <p className="text-[18px]">원하는 조건을 알려주세요.</p>
        </section>

        {/* 선택 버튼들 */}
        <section className="px-[37px] grid grid-cols-2 gap-[41px]">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                className={`relative w-[143px] h-[160px] rounded-[10px] text-[16px] ${
                  isSelected ? "bg-[#B8CDB9BF]" : "border border-[#B8CDB9BF]"
                }`}
              >
                <img
                  src={isSelected ? check_active : check_inactive}
                  alt="check"
                  className="absolute top-[10px] right-[10px] h-[15px] w-[15px]"
                />
                <p className="flex justify-center items-center h-full px-2 text-center">
                  {option}
                </p>
              </button>
            );
          })}
        </section>

        {/* 저장 버튼 */}
        <section className="mt-[40px] px-[37px]">
          <Link to={"/recommendation"}>
            <button
              onClick={handleSubmit}
              className="w-full h-[50px] bg-[#729A73] text-white rounded-[10px] font-semibold text-[16px]"
            >
              저장하기
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default WorkPreference;
