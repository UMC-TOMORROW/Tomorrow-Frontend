import Header from "../../components/Header";
import { SlArrowLeft } from "react-icons/sl";

const MemberInfo = () => {
  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className=" bg-white min-h-screen">
        <section className="mt-[50px] flex items-center h-[40px] border-b border-[#5555558C]">
          <SlArrowLeft className="ml-[20px]" />
          <div
            className="flex justify-center items-center text-[15px]"
            style={{ fontWeight: 700 }}
          >
            회원 정보
          </div>
        </section>
        <section className="">
          <p
            className="text-[18px] px-[25px] py-[25px]"
            style={{ fontWeight: 800 }}
          >
            필수 항목
          </p>
          <form className="flex flex-col px-[25px]">
            <p
              className="text-[13px] h-[22px] mb-[5px]"
              style={{ fontWeight: 600 }}
            >
              아이디
            </p>
            <input
              type="text"
              className="w-full h-[42px] px-[5px] mb-[5px] border border-[#729A73]"
              style={{ borderRadius: "12px" }}
            />
            <p className="text-[12px] h-[22px] text-[#555555D9] mb-[25px]">
              카카오 로그인 사용중
            </p>

            <p
              className="text-[13px] h-[22px] mb-[5px]"
              style={{ fontWeight: 600 }}
            >
              이름
            </p>
            <input
              type="text"
              className="w-full h-[42px] px-[5px] border border-[#729A73] mb-[25px]"
              style={{ borderRadius: "12px" }}
            />

            <p
              className="text-[13px] h-[22px] mb-[5px]"
              style={{ fontWeight: 600 }}
            >
              성별
            </p>
            <div className="flex gap-8 w-full mb-[25px]">
              <button
                type="button"
                className="w-full h-[42px] border border-[#729A73] text-[13px] text-[#555555D9]"
                style={{ borderRadius: "12px" }}
              >
                남자
              </button>
              <button
                type="button"
                className="w-full h-[42px] border border-[#729A73] text-[13px] text-[#555555D9]"
                style={{ borderRadius: "12px" }}
              >
                여자
              </button>
            </div>

            <p
              className="text-[13px] h-[22px] mb-[5px]"
              style={{ fontWeight: 600 }}
            >
              휴대폰
            </p>
            <div className="flex gap-[20px] w-full mb-[25px]">
              <input
                type="tel"
                placeholder="010-1234-5678"
                className="flex-1 w-[266px] h-[42px] px-[5px] border border-[#729A73] text-[13px]"
                style={{ borderRadius: "12px" }}
              />
              <button
                type="button"
                className="w-[66px] h-[42px] bg-[#B8CDB9BF] text-[13px]"
                style={{ borderRadius: "12px" }}
              >
                변경
              </button>
            </div>

            <p
              className="text-[13px] h-[22px] mb-[5px]"
              style={{ fontWeight: 600 }}
            >
              주소
            </p>
            <div className="flex gap-[20px] w-full mb-[25px]">
              <input
                type="tel"
                placeholder="서울시 00구 00동"
                className="flex-1 w-[266px] h-[42px] px-[5px] border border-[#729A73] text-[13px]"
                style={{ borderRadius: "12px" }}
              />
              <button
                type="button"
                className="w-[66px] h-[42px] bg-[#B8CDB9BF] text-[13px]"
                style={{ borderRadius: "12px" }}
              >
                검색
              </button>
            </div>
          </form>
        </section>
        <section className="flex justify-center items-center py-[30px]">
          <button
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] rounded-full bg-[#729A73]"
            style={{ fontWeight: 600 }}
          >
            수정 완료
          </button>
        </section>
      </div>
    </div>
  );
};

export default MemberInfo;
