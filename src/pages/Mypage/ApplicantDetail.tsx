import { TfiClose } from "react-icons/tfi";
import member from "../../assets/member.png";
import { useApplicantStore } from "../../stores/useApplicantStore";
import { useLocation, useNavigate } from "react-router-dom";

const ApplicantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = new URLSearchParams(location.search).get("name");
  const { applicants, setResult } = useApplicantStore();

  const applicant = applicants.find((a) => a.name === name);
  if (!applicant) return <div>지원자를 찾을 수 없습니다.</div>;

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <div className="relative items-center flex h-[40px]">
          <TfiClose className="ml-[25px]" />
        </div>

        <section>
          <div>
            <div className="flex h-[123px] items-center gap-[15px] px-[15px] py-[25px] border-b border-[#DEDEDE]">
              <img src={member} />
              <div className="flex flex-col gap-[3px]">
                <div className="flex items-center gap-[10px]">
                  <p className="text-[18px]" style={{ fontWeight: 800 }}>
                    {applicant.name}
                  </p>
                  <p
                    className="text-[12px] text-[#555555D9]"
                    style={{ fontWeight: 400 }}
                  >
                    {applicant.phone}
                  </p>
                </div>
                <p
                  className="text-[14px] text-[#555555D9]"
                  style={{ fontWeight: 400 }}
                >
                  {applicant.info}
                </p>
                <p
                  className="text-[14px] text-[#555555D9]"
                  style={{ fontWeight: 400 }}
                >
                  {applicant.comment}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center h-[136px] gap-[15px] p-[15px]">
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                자기소개
              </p>
              <div
                className="flex items-center h-[58px] border border-[#729A73] text-[#333333] text-[14px] p-[15px]"
                style={{ borderRadius: "12px" }}
              >
                {applicant.introduction}
              </div>
            </div>

            <div className="flex flex-col justify-center h-[159px] gap-[15px] p-[15px]">
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                경력
              </p>
              <div
                className="flex items-center h-[81px] border border-[#729A73] text-[#333333] text-[14px] p-[15px]"
                style={{ borderRadius: "12px" }}
              >
                {applicant.career}
              </div>
            </div>

            <div className="flex flex-col justify-center h-[136px] gap-[15px] p-[15px]">
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                자격증
              </p>
              <div
                className="flex items-center h-[58px] border border-[#729A73] text-[#333333] text-[14px] p-[15px]"
                style={{ borderRadius: "12px" }}
              >
                {applicant.license}
              </div>
            </div>
          </div>
        </section>

        <section className="fixed bottom-0 left-0 w-full px-[30px] py-[30px] z-10 flex justify-center items-center gap-[25px]">
          <button
            onClick={() => {
              setResult(applicant.name, "합격");
              navigate("/MyPage/ApplicantList");
            }}
            className="w-[160px] h-[48px] bg-[#729A73] text-[#FFFFFF] text-[18px]"
            style={{ borderRadius: "12px", fontWeight: 600 }}
          >
            합격
          </button>
          <button
            onClick={() => {
              setResult(applicant.name, "불합");
              navigate("/MyPage/ApplicantList");
            }}
            className="w-[160px] h-[48px] border border-[#EE0606] text-[#EE0606] text-[18px]"
            style={{ borderRadius: "12px", fontWeight: 600 }}
          >
            불합격
          </button>
        </section>
      </div>
    </div>
  );
};

export default ApplicantDetail;
