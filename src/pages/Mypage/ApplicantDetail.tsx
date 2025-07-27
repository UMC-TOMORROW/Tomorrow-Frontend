import Header from "../../components/Header";
import { TfiClose } from "react-icons/tfi";

const applicantdetail = [
  {
    name: "이지현",
    phone: "010-1234-5678",
    info: "이지현/여/56세/광진구",
    comment: "성실히 도움이 되도록 노력하겠습니다.",
    introduction:
      "어르신들과 대화하고 도움을 주는 일을 좋아합니다. 책임감 있게 일하며, 시간을 잘 지킵니다.",
    career: "내일 요양센터 2025년/6개월 이하 어르신 돌봄 업무",
    license: "요양보호사 자격증",
    result: "",
  },
];

const ApplicantDetail = () => {
  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <Header title={"내일"} />
      <div className="mt-[50px] bg-white min-h-screen">
        <div className="relative items-center flex h-[40px]">
          <TfiClose className="ml-[25px]" />
        </div>

        <section>
          {applicantdetail.map((applicant, index) => (
            <div key={index}>
              <div className="flex h-[123px] items-center gap-[15px] px-[15px] py-[25px] border-b border-[#5555558C]">
                <div className="w-[60px] h-[60px] rounded-full bg-gray-300"></div>
                <div className="flex flex-col gap-[5px]">
                  <div className="flex items-center gap-[10px]">
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
              </div>

              <div className="flex flex-col justify-center h-[136px] border-b border-[#5555558C] gap-[15px] p-[15px]">
                <p className="text-[16px]" style={{ fontWeight: 700 }}>
                  자기소개
                </p>
                <div
                  className="flex items-center h-[58px] border border-[#729A73] text-[#707070] text-[13px] p-[15px]"
                  style={{ borderRadius: "12px" }}
                >
                  {applicant.introduction}
                </div>
              </div>

              <div className="flex flex-col justify-center h-[159px] border-b border-[#5555558C] gap-[15px] p-[15px]">
                <p className="text-[16px]" style={{ fontWeight: 700 }}>
                  경력
                </p>
                <div
                  className="flex items-center h-[81px] border border-[#729A73] text-[#707070] text-[13px] p-[15px]"
                  style={{ borderRadius: "12px" }}
                >
                  {applicant.career}
                </div>
              </div>

              <div className="flex flex-col justify-center h-[136px] border-b border-[#5555558C] gap-[15px] p-[15px]">
                <p className="text-[16px]" style={{ fontWeight: 700 }}>
                  자격증
                </p>
                <div
                  className="flex items-center h-[58px] border border-[#729A73] text-[#707070] text-[13px] p-[15px]"
                  style={{ borderRadius: "12px" }}
                >
                  {applicant.license}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="fixed bottom-0 left-0 w-full px-[30px] py-[30px] z-10 flex justify-center items-center gap-[25px]">
          <button
            className="w-[160px] h-[37px] bg-[#729A73] text-[#FFFFFF] text-[15px]"
            style={{ borderRadius: "12px" }}
          >
            합격
          </button>
          <button
            className="w-[160px] h-[37px] border border-[#EE0606] text-[#EE0606] text-[15px]"
            style={{ borderRadius: "12px" }}
          >
            불합격
          </button>
        </section>
      </div>
    </div>
  );
};

export default ApplicantDetail;
