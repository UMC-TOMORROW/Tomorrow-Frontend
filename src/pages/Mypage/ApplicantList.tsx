import { SlArrowLeft } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import member from "../../assets/member.png";
import { useEffect, useMemo } from "react";
import { useApplicantStore } from "../../stores/useApplicantStore";
import { useJobStore } from "../../stores/useJobStore";
import { updateMyPostStatus } from "../../apis/employerMyPage";
import type { ParsedApplicantContent } from "../../types/applicant";
import { parseApplicantContent } from "../../utils/parseApplicantContent";

const ApplicantList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const jobId = Number(params.get("jobId"));

  const { jobs, updateJobStatus } = useJobStore();
  const targetJob = useMemo(() => jobs.find((job) => job.id === jobId), [jobs, jobId]);

  const {
    applicants,
    loading,
    error,
    fetchApplicants,
    setResultLocal, // 로컬 상태 합/불 변경(임시)
  } = useApplicantStore();

  useEffect(() => {
    if (!jobId) return;
    // 필요 시 status 필터: fetchApplicants(jobId, "open" | "closed")
    fetchApplicants(jobId);
  }, [jobId, fetchApplicants]);

  // applicants에서 바로 content 파싱하여 캐시 없이 메모로 사용
  const parsedById = useMemo<Record<number, ParsedApplicantContent>>(() => {
    const map: Record<number, ParsedApplicantContent> = {};
    for (const a of applicants) {
      map[a.applicationId] = parseApplicantContent(a.content ?? null);
    }
    return map;
  }, [applicants]);

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

  const handleComplete = async () => {
    try {
      await updateMyPostStatus(jobId, "모집완료");
      updateJobStatus(jobId, "모집완료");
      navigate("/MyPage/ManageMyJobs");
    } catch (e) {
      console.error("모집 완료 변경 실패:", e);
      alert("모집 완료 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        {/* 헤더 */}
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <SlArrowLeft
            className="absolute left-[15px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div className="text-[18px]" style={{ fontWeight: 700 }}>
            지원자 목록
          </div>
        </section>

        {/* 공고 제목 */}
        <section className="flex items-center h-[50px] border-b border-[#DEDEDE]">
          <p className="ml-[25px] text-[16px] text-[#729A73]" style={{ fontWeight: 600 }}>
            {targetJob?.title ?? "공고 제목"}
          </p>
        </section>

        {/* 상태 영역 */}
        {loading && (
          <div className="flex items-center justify-center h-[120px] text-sm text-[#666]">
            불러오는 중...
          </div>
        )}
        {!loading && error && (
          <div className="px-[20px] py-[16px] text-[14px] text-red-600">
            {error}
          </div>
        )}

        {/* 지원자 목록 */}
        {!loading && !error && (
          <section>
            {applicants.length === 0 ? (
              <div className="flex items-center justify-center h-[160px] text-[14px]">
                지원자가 없습니다.
              </div>
            ) : (
              <ul>
                {applicants.map((applicant) => {
                  const parsed = parsedById[applicant.applicationId];
                  const displayMeta = parsed
                    ? `${parsed.gender ?? "-"}/${parsed.age ?? parsed.ageRaw ?? "-"}세/${parsed.location ?? "-"}`
                    : "";

                  const introOrDash = parsed?.introduction ?? "-";

                  return (
                    <li
                      key={applicant.applicationId}
                      onClick={() =>
                        navigate(
                          `/MyPage/ApplicantDetail?jobId=${jobId}&applicationId=${applicant.applicationId}`
                        )
                      }
                      className="flex h-[123px] items-center gap-[15px] px-[15px] py-[25px] border-b border-[#DEDEDE] cursor-pointer"
                    >
                      <img src={member} alt="지원자" />
                      <div className="flex flex-col gap-[5px] w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-[2px] min-w-[200px]">
                            <div className="flex items-center gap-[10px]">
                              <p className="text-[18px]" style={{ fontWeight: 800 }}>
                                {applicant.userName}
                              </p>
                              <p
                                className="text-[11px] text-[#555555D9]"
                                style={{ fontWeight: 400 }}
                              >
                                {applicant.phoneNumber}
                              </p>
                            </div>
                            {displayMeta && (
                              <p className="text-[12px] text-[#777]">{displayMeta}</p>
                            )}
                          </div>

                          {/* 합격/불합 토글 (현재는 로컬 반영만) */}
                          <div className="flex overflow-hidden rounded-md border border-[#729A73] shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setResultLocal(applicant.applicationId, "합격");
                              }}
                              className={`flex justify-center items-center w-[39px] h-[26px] text-[11px] ${
                                applicant.status === "합격"
                                  ? "bg-[#729A73] text-[#FFFFFF]"
                                  : "bg-[#FFFFFF] text-[#555555D9]"
                              }`}
                            >
                              합격
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setResultLocal(applicant.applicationId, "불합격");
                              }}
                              className={`flex justify-center items-center w-[39px] h-[26px] text-[11px] ${
                                applicant.status === "불합격"
                                  ? "bg-[#EE0606CC] text-[#FFFFFF]"
                                  : "bg-[#FFFFFF] text-[#555555D9]"
                              }`}
                            >
                              불합
                            </button>
                          </div>
                        </div>

                        {/* 간단 소개 프리뷰 */}
                        <p className="text-[13px] text-[#555555D9] break-all">
                          {introOrDash}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* 모집 완료 버튼 */}
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
