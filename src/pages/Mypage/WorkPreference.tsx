import Header from "../../components/Header";
import { SlArrowLeft } from "react-icons/sl";
import check_active from "../../assets/check_active.png";
import check_inactive from "../../assets/check_inactive.png";
import { useState } from "react";

const WorkPreference = () => {
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

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[40px] border-b border-[#5555558C]">
          <SlArrowLeft className="absolute left-[15px] " />
          <div className="text-[15px]" style={{ fontWeight: 700 }}>
            내 몸에 맞는 일 찾기
          </div>
        </section>
        <section
          className="pt-[40px] pb-[40px] pl-[37px]"
          style={{ fontWeight: 700 }}
        >
          <p className="text-[18px] text-[#729A73]">몸과 마음에 맞는 일,</p>
          <p className="text-[18px]">원하는 조건을 알려주세요.</p>
        </section>

        <section className="px-[37px] grid grid-cols-2 gap-[41px]">
          {options.map((option) => {
            const isSelected = selected?.includes(option);
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
                  className="absolute top-[10px] right-[10px] h-[15px] w-[15px]"
                />
                <p className="flex justify-center items-center">{option}</p>
              </button>
            );
          })}
        </section>

        <section className="fixed bottom-[10px] px-[30px]">
          <button
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] rounded-full bg-[#729A73]"
            style={{ fontWeight: 600 }}
          >
            추가하기
          </button>
        </section>
      </div>
    </div>
  );
};

export default WorkPreference;
