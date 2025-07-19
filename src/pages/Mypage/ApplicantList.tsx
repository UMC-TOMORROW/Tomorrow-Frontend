import Header from "../../components/Header";
import { SlArrowLeft } from "react-icons/sl";
import { useState } from "react";

const applicantlist = [
  {
    name: "이지현",
    phone: "010-1234-5678",
    info: "이지현/여/56세/광진구",
    comment: "성실히 도움이 되도록 노력하겠습니다.",
    result: "합격",
  },
  {
    name: "김영희",
    phone: "010-1234-5678",
    info: "김영희/여/58세/강남구",
    comment: "경험은 부족하지만 책임감을 가지고 일하겠습니다.",
    result: "불합",
  },
  {
    name: "김유석",
    phone: "010-1234-5678",
    info: "김유석/남/62세/마포구",
    comment: "성실하게 맡은 일을 수행하겠습니다.",
    result: "합격",
  },
];

const ApplicantList = () => {
  const [applicants] = useState(applicantlist);

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title="내일" />

      <div className="mt-[50px] bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[40px] border-b border-[#5555558C]">
          <SlArrowLeft className="absolute left-[15px] " />
          <div className="text-[15px]" style={{ fontWeight: 700 }}>
            지원자 목록
          </div>
        </section>
        <section className="flex items-center h-[50px] border-b border-[#5555558C]">
          <p
            className="ml-[25px] text-[15px] text-[#729A73]"
            style={{ fontWeight: 700 }}
          >
            텃밭 관리 도우미
          </p>
        </section>

        <section>
          <ul>
            {applicants.map((applicant, index) => (
              <li
                key={index}
                className="flex h-[123px] items-center gap-[15px] px-[15px] py-[25px] border-b border-[#5555558C]"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-gray-300 shrink-0"></div>
                <div className="flex flex-col gap-[5px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px] min-w-[200px]">
                      <p className="text-[18px]" style={{ fontWeight: 800 }}>
                        {applicant.name}
                      </p>
                      <p
                        className="text-[11px] text-[#555555D9]"
                        style={{ fontWeight: 400 }}
                      >
                        {applicant.phone}
                      </p>
                    </div>
                    <div className="flex overflow-hidden rounded-md border border-[#729A73] shrink-0">
                      <button
                        className={`flex justify-center items-center w-[39px] h-[26px] text-[11px] gap-[5px] ${
                          applicant.result === "합격"
                            ? "bg-[#729A73] text-[#FFFFFF]"
                            : "bg-[#FFFFFF] text-[#555555D9]"
                        }`}
                      >
                        합격
                      </button>
                      <button
                        className={`flex justify-center items-center w-[39px] h-[26px] text-[11px] gap-[5px] ${
                          applicant.result === "불합"
                            ? "bg-[#EE0606CC] text-[#FFFFFF]"
                            : "bg-[#FFFFFF] text-[#555555D9]"
                        }`}
                      >
                        불합
                      </button>
                    </div>
                  </div>
                  <p
                    className="text-[13px] text-[#555555D9]"
                    style={{ fontWeight: 400 }}
                  >
                    {applicant.info}
                  </p>
                  <p
                    className="text-[13px] text-[#555555D9]"
                    style={{ fontWeight: 400 }}
                  >
                    {applicant.comment}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="fixed bottom-0 left-0 w-full px-[30px] py-[30px] z-10 flex justify-center items-center">
          <button
            className="text-[#FFFFFF] text-[20px] w-[333px] h-[50px] rounded-full bg-[#729A73]"
            style={{ fontWeight: 400 }}
          >
            모집 완료
          </button>
        </section>
      </div>
    </div>
  );
};

export default ApplicantList;
