import { useState } from "react";
import { SlArrowLeft } from "react-icons/sl";

const MemberInfo = () => {
  const [gender, setGender] = useState<"남자" | "여자">();

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <SlArrowLeft className="absolute left-[15px] " />
          <div className="text-[20px]" style={{ fontWeight: 600 }}>
            회원 정보
          </div>
        </section>
        <section className="">
          <p
            className="text-[18px] px-[25px] pt-[30px] pb-[20px]"
            style={{ fontWeight: 800 }}
          >
            기본 정보
          </p>
          <form className="flex flex-col px-[25px] gap-[20px] pb-[30px]">
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                이메일 <span style={{ color: "#EE0606CC" }}>*</span>
              </p>
              <input
                type="text"
                className="w-full h-[42px] px-[5px] border border-[#5555558C] text-[13px]"
                style={{ borderRadius: "10px" }}
              />
              <p className="text-[12px] text-[#555555D9]">
                카카오 로그인 사용중
              </p>
            </div>

            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                이름 <span style={{ color: "#EE0606CC" }}>*</span>
              </p>
              <input
                type="text"
                className="w-full h-[42px] px-[5px] border border-[#5555558C] text-[13px]"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                성별
              </p>
              <div className="flex gap-[14px] w-full">
                <button
                  onClick={() => setGender("남자")}
                  type="button"
                  className={`w-full h-[42px] text-[14px] ${
                    gender === "남자"
                      ? "bg-[#729A73] text-[#FFFFFF]"
                      : "border border-[#729A73] text-[#555555D9]"
                  }`}
                  style={{ borderRadius: "10px" }}
                >
                  남자
                </button>
                <button
                  onClick={() => setGender("여자")}
                  type="button"
                  className={`w-full h-[42px] text-[14px] ${
                    gender === "여자"
                      ? "bg-[#729A73] text-[#FFFFFF]"
                      : "border border-[#729A73] text-[#555555D9]"
                  }`}
                  style={{ borderRadius: "10px" }}
                >
                  여자
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                휴대폰
              </p>
              <div className="flex gap-[32px] w-full">
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  className="flex-1 w-[235px] h-[44px] px-[10px] border border-[#5555558C] text-[13px]"
                  style={{ borderRadius: "10px" }}
                />
                <button
                  type="button"
                  className="w-[66px] h-[44px] bg-[#B8CDB9BF] text-[13px]"
                  style={{ borderRadius: "10px" }}
                >
                  변경
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>
                주소
              </p>
              <div className="flex gap-[32px] w-full">
                <input
                  type="tel"
                  placeholder="서울시 00구 00동"
                  className="flex-1 w-[235px] h-[44px] px-[10px] border border-[#5555558C] text-[13px]"
                  style={{ borderRadius: "10px" }}
                />
                <button
                  type="button"
                  className="w-[66px] h-[44px] bg-[#B8CDB9BF] text-[13px]"
                  style={{ borderRadius: "10px" }}
                >
                  검색
                </button>
              </div>
            </div>
          </form>
        </section>
        <section className="flex justify-center items-center">
          <button
            className="text-[#FFFFFF] text-[16px] w-[333px] h-[50px] bg-[#729A73]"
            style={{ fontWeight: 600, borderRadius: "10px" }}
          >
            수정 완료
          </button>
        </section>
      </div>
    </div>
  );
};

export default MemberInfo;
