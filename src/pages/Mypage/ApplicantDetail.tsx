import { useEffect, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import member from "../../assets/member.png";
import { useLocation, useNavigate } from "react-router-dom";
import type { ApplicantResume } from "../../types/applicant";
import { getApplicantResume } from "../../apis/employerMyPage";
import { useApplicantStore } from "../../stores/useApplicantStore";

// 안전한 숫자 파라미터 파서 (jobId, applicationId용)
const readNumberParam = (search: string, ...keys: string[]): number | null => {
  const qs = new URLSearchParams(search);
  for (const k of keys) {
    const raw = qs.get(k);
    if (raw == null) continue;
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return null;
};

const ApplicantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 쿼리 파라미터 읽기 (postId 호환 유지, 상세는 applicationId 필수)
  const jobId = readNumberParam(location.search, "jobId", "postId");
  const applicationId = readNumberParam(location.search, "applicationId");

  const [data, setData] = useState<ApplicantResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState<"ACCEPTED" | "REJECTED" | null>(null);

  const invalid = jobId == null || applicationId == null;

  const { updateApplicationStatus } = useApplicantStore();

  useEffect(() => {
    if (invalid) {
      setLoading(false);
      setErr("잘못된 접근입니다. 공고 ID 또는 지원서 ID가 없습니다.");
      return;
    }
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getApplicantResume(jobId!, applicationId!);
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
  }, [jobId, applicationId, invalid]);

  // 표시용 안전 처리
  const gender = data?.parsedContent?.gender ?? "-";
  const ageDisplay =
    (data?.parsedContent?.age ?? null) !== null
      ? String(data?.parsedContent?.age)
      : data?.parsedContent?.ageRaw ?? "-";
  const locationText = data?.parsedContent?.location ?? "-";
  const introduction =
    data?.parsedContent?.introduction ?? data?.resumeInfo?.resumeContent ?? "-";
  const resume = data?.resumeInfo;

  const handlePass = async () => {
    if (invalid || saving) return;
    try {
      setSaving("ACCEPTED");
      await updateApplicationStatus(jobId!, applicationId!, "ACCEPTED");
      navigate(`/MyPage/ApplicantList?jobId=${jobId}`);
    } catch {
      alert("상태 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSaving(null);
    }
  };

  const handleFail = async () => {
    if (invalid || saving) return;
    try {
      setSaving("REJECTED");
      await updateApplicationStatus(jobId!, applicationId!, "REJECTED");
      navigate(`/MyPage/ApplicantList?jobId=${jobId}`);
    } catch {
      alert("상태 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSaving(null);
    }
  };

  if (invalid) {
    return (
      <div className="p-4">
        잘못된 접근입니다. 공고 ID 또는 지원서 ID가 없습니다.
        <div className="text-xs text-gray-500 mt-1">받은 쿼리: {location.search}</div>
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
                    {data?.userProfile?.userName}
                  </p>
                  <p
                    className="text-[12px] text-[#555555D9]"
                    style={{ fontWeight: 400 }}
                  >
                    {data?.userProfile?.phoneNumber ?? "휴대폰 번호 없음"}
                  </p>
                </div>

                <p className="text-[14px]" style={{ fontWeight: 400 }}>
                  {gender}/{ageDisplay}세/{locationText}
                </p>

                {/* content에서 추출한 기본 인적사항 */}
                <p className="text-[14px] text-[#555555D9]" style={{ fontWeight: 400 }}>
                  {introduction}
                </p>
              </div>
            </div>

            {/* 자기소개 / 이력서 내용 */}
            <div className="flex flex-col justify-center gap-[15px] p-[15px]">
              <p className="text-[18px]" style={{ fontWeight: 700 }}>
                자기소개
              </p>
              <div
                className="flex items-center min-h-[58px] border border-[#729A73] text-[#333333] text-[14px] p-[15px] whitespace-pre-wrap break-words"
                style={{ borderRadius: "12px" }}
              >
                {data?.resumeInfo?.resumeContent ?? "-"}
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
                        <p>
                          {c.duration} / {c.position}
                        </p>
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

        <section className="fixed bottom-0 left-0 w-full px-[30px] py-[30px] z-10 flex justify-center items-center gap-[25px] bg-white">
          <button
            onClick={handlePass}
            disabled={!!saving}
            className="w-[160px] h-[48px] bg-[#729A73] text-[#FFFFFF] text-[18px] disabled:opacity-60"
            style={{ borderRadius: "12px", fontWeight: 600 }}
          >
            {saving === "ACCEPTED" ? "처리 중..." : "합격"}
          </button>
          <button
            onClick={handleFail}
            disabled={!!saving}
            className="w-[160px] h-[48px] border border-[#EE0606] text-[#EE0606] text-[18px] disabled:opacity-60"
            style={{ borderRadius: "12px", fontWeight: 600 }}
          >
            {saving === "REJECTED" ? "처리 중..." : "불합격"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default ApplicantDetail;
