import Header from "../../components/Header";
import settings from "../../assets/settings.png";

const ResumeManage = () => {
  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section>
          <div
            className="flex justify-center items-center text-[15px] h-[38px] border-b border-[#5555558C]"
            style={{ fontWeight: 700 }}
          >
            이력서 관리
          </div>
        </section>
        <section className="flex items-center justify-between px-[20px] py-[15px] h-[110px]">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200" />
            <div>
              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                이내일
              </p>
              <p className="text-[13px]">010-1234-5678</p>
            </div>
          </div>
          <div className="flex gap-1 text-[13px] text-[#707070]">
            <img src={settings} />
            회원 정보
          </div>
        </section>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

        <div className="flex flex-col h-[144px] px-[15px] py-[15px] gap-[30px]">
          <p className="text-[18px]" style={{ fontWeight: 800 }}>
            자기소개
          </p>
          <button
            className="w-full h-[58px] border border-[#729A73] text-[13px] text-[#729A73]"
            style={{ borderRadius: "12px" }}
          >
            + 추가하기
          </button>
        </div>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

        <div className="flex flex-col h-[144px] px-[15px] py-[15px] gap-[30px]">
          <p className="text-[18px]" style={{ fontWeight: 800 }}>
            경력
          </p>
          <button
            className="w-full h-[58px] border border-[#729A73] text-[13px] text-[#729A73]"
            style={{ borderRadius: "12px" }}
          >
            + 추가하기
          </button>
        </div>

        <div className="px-[15px]">
          <div className="h-[20px] w-full bg-white border-b border-[#55555526]"></div>
          <div className="h-[20px] w-full bg-white"></div>
        </div>

        <div className="flex flex-col h-[144px] px-[15px] py-[15px] gap-[30px]">
          <p className="text-[18px]" style={{ fontWeight: 800 }}>
            자격증
          </p>
          <button
            className="w-full h-[58px] border border-[#729A73] text-[13px] text-[#729A73]"
            style={{ borderRadius: "12px" }}
          >
            + 추가하기
          </button>
        </div>

        <section className="flex justify-center items-center py-[70px]">
          <button
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] rounded-full bg-[#729A73]"
            style={{ fontWeight: 600 }}
          >
            이력서 저장
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResumeManage;
