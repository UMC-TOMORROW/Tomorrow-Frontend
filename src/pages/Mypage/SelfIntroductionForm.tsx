import Header from "../../components/Header";

const SelfIntroductionForm = () => {
  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[15px] h-[38px] border-b border-[#5555558C]"
            style={{ fontWeight: 700 }}
          >
            자기소개
          </div>
        </section>

        <section className="h-[244px] pt-[25px] px-[15px]">
          <p className="text-[15px] pb-[10px]" style={{ fontWeight: 700 }}>
            간단한 자기소개를 남겨주세요.
          </p>
          <p className="text-[12px] pb-[15px]">
            경험, 성격, 일에 대한 생각을 남겨주시면 <br />
            구인자가 더 잘 이해할 수 있어요.
          </p>
          <textarea
            className="w-full h-[91px] border border-[#729A73] pb-[10px] text-[12px] resize-none"
            style={{ borderRadius: "12px" }}
          ></textarea>
          <p className="text-[12px] text-[#EE0606CC]">
            100자 이내로 작성해주세요.
          </p>
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

export default SelfIntroductionForm;
