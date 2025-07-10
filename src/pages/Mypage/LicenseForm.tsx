import Header from "../../components/Header";

const LicenseForm = () => {
  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[15px] h-[38px] border-b border-[#5555558C]"
            style={{ fontWeight: 700 }}
          >
            자격증
          </div>
        </section>

        <section className="h-[173] pt-[25px] px-[15px]">
          <p className="text-[15px] pb-[10px]" style={{ fontWeight: 700 }}>
            자격증을 추가해주세요.
          </p>
          <p className="text-[12px] pb-[15px]">
            필수는 아니지만, 구인자가 신뢰를 가질 수 있는 정보입니다.
          </p>
          <textarea
            className="w-full h-[91px] border border-[#729A73] pb-[10px] text-[12px] resize-none pl-[10px] py-[10px]"
            placeholder={`예. 운전면허증 2종(2008년 취득), 요양보호사 자격증(2020년 취득), 바리스타 2급(2022년 취득) 등`}
            style={{ borderRadius: "12px" }}
          ></textarea>
        </section>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

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

export default LicenseForm;
