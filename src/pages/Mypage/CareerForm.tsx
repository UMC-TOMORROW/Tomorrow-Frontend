import { useState } from "react";
import Header from "../../components/Header";

const CareerForm = () => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const labels = [
    "단기",
    "3개월 이하",
    "6개월 이하",
    "6개월~1년",
    "1년~2년",
    "2년~3년",
    "3년 이상",
  ];

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />
      <div className="mt-[50px] bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[15px] h-[38px] border-b border-[#5555558C]"
            style={{ fontWeight: 700 }}
          >
            경력
          </div>
        </section>

        <div className="flex flex-col gap-[10px] px-[15px] pt-[25px] h-[151px]">
          <p className="text-[15px]" style={{ fontWeight: 700 }}>
            일한 곳
          </p>
          <input
            type="text"
            placeholder="예. 내일 요양센터"
            className="flex px-[10px] placeholder:text-[#555555D9] placeholder:text-[11px] placeholder:text-center w-full border border-[#729A73] h-[70px]"
            style={{ borderRadius: "12px" }}
          />
        </div>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

        <div className="flex flex-col gap-[10px] px-[15px] pt-[15px] h-[132px]">
          <p className="text-[15px]" style={{ fontWeight: 700 }}>
            했던 일
          </p>
          <input
            type="text"
            placeholder="예. 요양 보호사"
            className="flex px-[10px] placeholder:text-[#555555D9] placeholder:text-[11px] placeholder:text-center w-full border border-[#729A73] h-[70px]"
            style={{ borderRadius: "12px" }}
          />
        </div>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

        <div className="flex flex-col gap-[10px] px-[15px] pt-[15px] h-[132px]">
          <p className="text-[15px]" style={{ fontWeight: 700 }}>
            일한 연도
          </p>
          <input
            type="text"
            placeholder="예. 2025년"
            className="flex px-[10px] placeholder:text-[#555555D9] placeholder:text-[11px] placeholder:text-center w-full border border-[#729A73] h-[70px]"
            style={{ borderRadius: "12px" }}
          />
        </div>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

        <div className="flex flex-col px-[15px] pt-[15px] gap-[10px] h-[112px]">
          <p className="text-[15px]" style={{ fontWeight: 700 }}>
            일한 기간
          </p>
          <div className="flex flex-wrap gap-[10px]">
            {labels.map((label) => (
              <button
                key={label}
                onClick={() => setSelectedLabel(label)}
                className={`flex items-center justify-center border rounded-full h-[20px] px-[14px] py-[6px] text-[12px] ${
                  selectedLabel === label
                    ? " bg-[#729A73] border-[#729A73] text-[#FFFFFF]"
                    : "border-[#555555D9] text-[#555555D9]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

        <section className="flex justify-center items-center py-[40px]">
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

export default CareerForm;
