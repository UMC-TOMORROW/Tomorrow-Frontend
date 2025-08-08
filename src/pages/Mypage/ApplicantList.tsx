import { SlArrowLeft } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import member from "../../assets/member.png";
import { useApplicantStore } from "../../stores/useApplicantStore";
import { useJobStore } from "../../stores/useJobStore";
import { updateMyPostStatus } from "../../apis/employerMyPage";

const ApplicantList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicants } = useApplicantStore();
  const { jobs, updateJobStatus } = useJobStore();

  const params = new URLSearchParams(location.search);
  const jobId = Number(params.get("jobId"));

  if (!jobId) {
    return (
      <div className="p-4">
        잘못된 접근입니다. 공고 ID가 없습니다.
        <button onClick={() => navigate(-1)} className="underline ml-2">
          돌아가기
        </button>
      </div>
    );
  }

  const targetJob = jobs.find((job) => job.id === jobId);

  const handleComplete = async () => {
    try {
      await updateMyPostStatus(jobId, "모집완료");
      updateJobStatus(jobId, "모집완료");
      navigate("/MyPage/ManageMyJobs");
    } catch (error) {
      console.error("모집 완료 변경 실패:", error);
      alert("모집 완료 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <SlArrowLeft
            className="absolute left-[15px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div className="text-[18px]" style={{ fontWeight: 700 }}>
            지원자 목록
          </div>
        </section>

        <section className="flex items-center h-[50px] border-b border-[#DEDEDE]">
          <p className="ml-[25px] text-[16px] text-[#729A73]" style={{ fontWeight: 600 }}>
            {targetJob?.title ?? "공고 제목"}
          </p>
        </section>

        <section>
          <ul>
            {applicants.map((applicant, index) => (
              <li
                onClick={() => navigate(`/MyPage/ApplicantDetail?name=${applicant.name}`)}
                key={index}
                className="flex h-[123px] items-center gap-[15px] px-[15px] py-[25px] border-b border-[#DEDEDE] cursor-pointer"
              >
                <img src={member} alt="지원자" />
                <div className="flex flex-col gap-[5px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px] min-w-[200px]">
                      <p className="text-[18px]" style={{ fontWeight: 800 }}>{applicant.name}</p>
                      <p className="text-[11px] text-[#555555D9]" style={{ fontWeight: 400 }}>{applicant.phone}</p>
                    </div>
                    <div className="flex overflow-hidden rounded-md border border-[#729A73] shrink-0">
                      <button
                        className={`flex justify-center items-center w-[39px] h-[26px] text-[11px] ${
                          applicant.result === "합격"
                            ? "bg-[#729A73] text-[#FFFFFF]"
                            : "bg-[#FFFFFF] text-[#555555D9]"
                        }`}
                      >
                        합격
                      </button>
                      <button
                        className={`flex justify-center items-center w-[39px] h-[26px] text-[11px] ${
                          applicant.result === "불합"
                            ? "bg-[#EE0606CC] text-[#FFFFFF]"
                            : "bg-[#FFFFFF] text-[#555555D9]"
                        }`}
                      >
                        불합
                      </button>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#555555D9]">{applicant.info}</p>
                  <p className="text-[13px] text-[#555555D9]">{applicant.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="fixed bottom-0 left-0 w-full px-[30px] py-[30px] z-10 flex justify-center items-center">
          <button
            onClick={handleComplete}
            disabled={targetJob?.status === "모집완료"}
            className="text-[#FFFFFF] text-[18px] w-[333px] h-[52px]"
            style={{
              fontWeight: 700,
              borderRadius: "10px",
              backgroundColor: targetJob?.status === "모집완료" ? "#555555" : "#729A73",
              cursor: targetJob?.status === "모집완료" ? "not-allowed" : "pointer",
            }}
          >
            모집 완료
          </button>
        </section>
      </div>
    </div>
  );
};

export default ApplicantList;
