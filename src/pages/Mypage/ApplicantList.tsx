import { SlArrowLeft } from "react-icons/sl";
import { useNavigate, useLocation } from "react-router-dom";
import member from "../../assets/member.png";
import { useEffect, useMemo, useState } from "react";
import { useApplicantStore } from "../../stores/useApplicantStore";
import { useJobStore } from "../../stores/useJobStore";
import { updateMyPostStatus, getApplicantResume } from "../../apis/employerMyPage";
import type { ParsedApplicantContent } from "../../types/applicant"; // parsedContent 타입

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

  // 각 지원자의 parsedContent(이름/성별/나이/지역/자기소개) 캐시
  const [parsedById, setParsedById] = useState<Record<number, ParsedApplicantContent>>({});
  // 이력서 제목이 com.umc...@hash처럼 오는 경우를 위한 표시용 제목 캐시
  const [titleById, setTitleById] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!jobId) return;
    fetchApplicants(jobId); // 전체 조회 (status 필터 필요하면 두 번째 파라미터에 "open"/"closed")
  }, [jobId, fetchApplicants]);

  // applicants가 로드되면 각 항목의 resume 상세를 추가로 가져와 parsedContent를 채움
  useEffect(() => {
    let cancelled = false;
    const loadParsed = async () => {
      if (!applicants.length) return;

      const tasks = applicants.map(async (a) => {
        try {
          const resume = await getApplicantResume(jobId, a.applicantId);
          return { id: a.applicantId, parsed: resume.parsedContent, rawTitle: a.resumeTitle };
        } catch {
          return { id: a.applicantId, parsed: undefined, rawTitle: a.resumeTitle };
        }
      });

      const results = await Promise.allSettled(tasks);
      if (cancelled) return;

      const nextParsed: Record<number, ParsedApplicantContent> = {};
      const nextTitle: Record<number, string> = {};

      results.forEach((r) => {
        if (r.status === "fulfilled") {
          const { id, parsed, rawTitle } = r.value;
          if (parsed) nextParsed[id] = parsed;

          // 제목 표시 최적화: 패키지@해시 형태면 "이력서"로 대체
          const badTitlePattern = /^[a-zA-Z0-9_.]+@[a-f0-9]+$/;
          nextTitle[id] =
            badTitlePattern.test(rawTitle ?? "") || (rawTitle ?? "").includes("com.umc.")
              ? "이력서"
              : rawTitle ?? "-";
        }
      });

      setParsedById((prev) => ({ ...prev, ...nextParsed }));
      setTitleById((prev) => ({ ...prev, ...nextTitle }));
    };

    loadParsed();
    return () => {
      cancelled = true;
    };
  }, [applicants, jobId]);

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

  // 표시용 헬퍼
  const formatAppliedAt = (iso: string) => new Date(iso).toLocaleString();

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
                  const parsed = parsedById[applicant.applicantId];
                  const displayMeta =
                    parsed
                      ? `${parsed.gender ?? "-"}/${
                          parsed.age ?? parsed.ageRaw ?? "-"
                        }세/${parsed.location ?? "-"}`
                      : "";
                  const displayResumeTitle =
                    titleById[applicant.applicantId] ?? applicant.resumeTitle;

                  return (
                    <li
                      key={applicant.applicantId}
                      onClick={() =>
                        navigate(
                          `/MyPage/ApplicantDetail?jobId=${jobId}&applicantId=${applicant.applicantId}`
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
                                {formatAppliedAt(applicant.applicationDate)}
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
                                setResultLocal(applicant.applicantId, "합격");
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
                                setResultLocal(applicant.applicantId, "불합격");
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

                        {/* 이력서 제목(보기 좋은 형태로) 또는 간단 소개 프리뷰 */}
                        <p className="text-[13px] text-[#555555D9] break-all">
                          {parsed?.introduction
                            ? parsed.introduction
                            : displayResumeTitle}
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
