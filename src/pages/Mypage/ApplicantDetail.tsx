import { useEffect, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import member from "../../assets/member.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useApplicantStore } from "../../stores/useApplicantStore";
import type { ApplicantResume } from "../../types/applicant";
import { getApplicantResume } from "../../apis/employerMyPage";


const ApplicantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const qs = new URLSearchParams(location.search);
  const postId = Number(qs.get("jobId"));
  const applicantId = Number(qs.get("applicantId"));

  const { setResultLocal } = useApplicantStore();

  const [data, setData] = useState<ApplicantResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const invalid = !postId || !applicantId;

  useEffect(() => {
    if (invalid) {
      setLoading(false);
      setErr("잘못된 접근입니다. 공고 ID 또는 지원자 ID가 없습니다.");
      return;
    }
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getApplicantResume(postId, applicantId);
        if (!cancel) setData(res);
      } catch (e) {
        console.error("이력서 조회 실패:", e);
        if (!cancel) setErr("이력서를 불러오지 못했습니다.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [postId, applicantId, invalid]);

  const profile = data?.userProfile;
  const resume = data?.resumeInfo;

  const handlePass = () => {
    setResultLocal(applicantId, "합격");
    navigate(`/MyPage/ApplicantList?jobId=${postId}`);
  };

  const handleFail = () => {
    setResultLocal(applicantId, "불합격");
    navigate(`/MyPage/ApplicantList?jobId=${postId}`);
  };

  if (invalid) {
    return (
      <div className="p-4">
        잘못된 접근입니다. 공고 ID 또는 지원자 ID가 없습니다.
        <button className="underline ml-2" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    );
  }

  if (loading) return <div className="p-4">불러오는 중...</div>;
  if (err) {
    return (
      <div className="p-4">
        {err}
        <button className="underline ml-2" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        {/* 상단 닫기 */}
        <div className="relative items-center flex h-[40px]">
          <TfiClose
            className="ml-[25px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
        </div>

        {/* 상단 프로필 블록 */}
        <section>
          <div>
            <div className="flex h-[123px] items-center gap-[15px] px-[15px] py-[25px] border-b border-[#DEDEDE]">
              <img src={member} alt="지원자" />
              <div className="flex flex-col gap-[3px]">
                <div className="flex items-center gap-[10px]">
                  <p className="text-[18px]" style={{ fontWeight: 800 }}>
                    {profile?.userName ?? "-"}
                  </p>
                  <p
                    className="text-[12px] text-[#555555D9]"
                    style={{ fontWeight: 400 }}
                  >
                    {profile?.phoneNumber ?? "-"}
                  </p>
                </div>
                <p
                  className="text-[14px] text-[#555555D9]"
                  style={{ fontWeight: 400 }}
                >
                  {data?.status ?? "-"} 
                </p>
                <p
                  className="text-[14px] text-[#555555D9]"
                  style={{ fontWeight: 400 }}
                >
                  {resume?.resumeContent ?? "-"}
                </p>
              </div>
            </div>

            {/* 자기소개/이력서 내용 */}
            <div className="flex flex-col justify-center gap-[15px] p-[15px]">
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                자기소개
              </p>
              <div
                className="flex items-center min-h-[58px] border border-[#729A73] text-[#333333] text-[14px] p-[15px] whitespace-pre-wrap break-words"
                style={{ borderRadius: "12px" }}
              >
                {resume?.resumeContent ?? "-"}
              </div>
            </div>

            {/* 경력 */}
            <div className="flex flex-col justify-center gap-[15px] p-[15px]">
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                경력
              </p>
              <div
                className="min-h-[81px] border border-[#729A73] text-[#333333] text-[14px] p-[15px] space-y-2"
                style={{ borderRadius: "12px" }}
              >
                {resume?.careers?.length ? (
                  resume.careers.map((c) => (
                    <div key={c.id}>
                      <div>
                        <b>{c.company}</b>
                        <p>{c.duration} / {c.position}</p>
                      </div>
                      <div>
                        <b>{c.description}</b>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </div>
            </div>

            {/* 자격/증빙 */}
            <div className="flex flex-col justify-center gap-[15px] p-[15px]">
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                자격/증빙
              </p>
              <div
                className="min-h-[58px] border border-[#729A73] text-[#333333] text-[14px] p-[15px] space-y-2"
                style={{ borderRadius: "12px" }}
              >
                {resume?.certifications?.length ? (
                  resume.certifications.map((cert, idx) => (
                    <div key={idx}>
                      {cert.fileUrl ? (
                        <a
                          className="text-blue-600 underline"
                          href={cert.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {cert.certificationName ?? ""}
                        </a>
                      ) : (
                        <div>파일 없음</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 하단 합/불 버튼 */}
        <section className="fixed bottom-0 left-0 w-full px-[30px] py-[30px] z-10 flex justify-center items-center gap-[25px] bg-white">
          <button
            onClick={handlePass}
            className="w-[160px] h-[48px] bg-[#729A73] text-[#FFFFFF] text-[18px]"
            style={{ borderRadius: "12px", fontWeight: 600 }}
          >
            합격
          </button>
          <button
            onClick={handleFail}
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
