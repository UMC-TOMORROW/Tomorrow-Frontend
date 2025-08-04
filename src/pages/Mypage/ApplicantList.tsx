import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import member from "../../assets/member.png";
import { useApplicantStore } from "../../stores/useApplicantStore";
import { useJobStore } from "../../stores/useJobStore";

const ApplicantList = () => {
  const navigate = useNavigate();
  const { applicants } = useApplicantStore();
  const jobId = 2;
  const { completeJob, jobs } = useJobStore();
  const targetJob = jobs.find((job) => job.id === jobId);

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <SlArrowLeft className="absolute left-[15px] " />
          <div className="text-[18px]" style={{ fontWeight: 700 }}>
            지원자 목록
          </div>
        </section>
        <section className="flex items-center h-[50px] border-b border-[#DEDEDE]">
          <p
            className="ml-[25px] text-[16px] text-[#729A73]"
            style={{ fontWeight: 600 }}
          >
            텃밭 관리 도우미
          </p>
        </section>

        <section>
          <ul>
            {applicants.map((applicant, index) => (
              <li
                onClick={() =>
                  navigate(`/MyPage/ApplicantDetail?name=${applicant.name}`)
                }
                key={index}
                className="flex h-[123px] items-center gap-[15px] px-[15px] py-[25px] border-b border-[#DEDEDE]"
              >
                <img src={member} />
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
            onClick={() => {
              completeJob(jobId);
              navigate("/MyPage/ManageMyJobs");
            }}
            disabled={targetJob?.status === "모집완료"}
            className={`text-[#FFFFFF] text-[18px] w-[333px] h-[52px] ${
              targetJob?.status === "모집완료"
                ? "bg-[#5555558C]"
                : "bg-[#729A73]"
            }`}
            style={{ fontWeight: 700, borderRadius: "10px" }}
          >
            모집 완료
          </button>
        </section>
      </div>
    </div>
  );
};

export default ApplicantList;
