import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ApplicationFilter, applyStatus } from "../../types/mypage";
import { getApplications } from "../../apis/mypage";
import { SlArrowLeft } from "react-icons/sl";

type UIJob = {
  postId?: number;
  date: string;
  company: string;
  title: string;
  tags: string[];
  status: "" | "합격";
};

const ApplyStatus = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"" | "합격">("");
  const [jobs, setJobs] = useState<UIJob[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDateDot = (d: string) => {
    if (!d) return d;
    const onlyNum = d.replace(/[^\d]/g, "");
    if (onlyNum.length === 8) {
      return `${onlyNum.slice(0, 4)}.${onlyNum.slice(4, 6)}.${onlyNum.slice(
        6,
        8
      )}`;
    }
    return d;
  };

  const mapToUIJob = useCallback((it: applyStatus): UIJob => {
    const anyIt = it as unknown as Record<string, unknown>;
    const rawId =
      (anyIt.postId as number | undefined) ??
      (anyIt.jobId as number | undefined) ??
      (anyIt.id as number | undefined);

    return {
      postId: rawId,
      date: formatDateDot(it.date),
      company: it.company,
      title: it.postTitle,
      tags: [],
      status: it.status === "ACCEPTED" ? "합격" : "",
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const type: ApplicationFilter = activeTab === "합격" ? "pass" : "all";
        const list = await getApplications(type);
        setJobs(list.map(mapToUIJob));
      } catch (e) {
        console.error("지원 현황 조회 실패:", e);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, mapToUIJob]);

  const filteredJobs = useMemo(() => jobs, [jobs]);

  const goWriteReview = (job: UIJob) => {
    if (!job.postId) {
      alert(
        "후기 작성에 필요한 공고 ID가 없습니다. 백엔드 응답에 postId 포함이 필요해요."
      );
      return;
    }
    navigate(`/MyPage/ReviewWritting/${job.postId}`, {
      state: { title: job.title },
    });
  };

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center h-[52px] border-b border-[#DEDEDE]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-[15px]"
          >
            <SlArrowLeft />
          </button>
          <div
            className="flex justify-center items-center text-[20px] h-[52px] border-b border-[#DEDEDE]"
            style={{ fontWeight: 700 }}
          >
            지원현황
          </div>
        </section>

        <section className="flex justify-around items-center h-[45px]">
          <button
            style={{ fontWeight: 500 }}
            onClick={() => setActiveTab("")}
            className={`w-full text-[16px] ${
              activeTab === "" ? "border-b-4 border-[#729A73]" : ""
            }`}
          >
            전체
          </button>
          <button
            style={{ fontWeight: 500 }}
            onClick={() => setActiveTab("합격")}
            className={`w-full text-[16px] ${
              activeTab === "합격" ? "border-b-4 border-[#729A73]" : ""
            }`}
          >
            합격
          </button>
        </section>

        <div className="flex text-[12px] items-center pl-[20px] h-[34px] border-b border-[#DEDEDE]">
          {loading ? "로딩 중..." : `${filteredJobs.length}건`}
        </div>

        <ul>
          {filteredJobs.map((job, index) => (
            <div key={index}>
              <li>
                <div className="px-[15px] h-[18px] w-full bg-white"></div>
                <div className="flex items-center justify-between h-[104px] px-[20px]">
                  <div>
                    <p className="flex items-end text-[14px]">{job.date}</p>
                    <p className="text-[14px]">{job.company}</p>
                    <p className="text-[16px]" style={{ fontWeight: 800 }}>
                      {job.title}
                    </p>
                    <p className="text-[14px] text-[#729A73]">
                      {job.tags.join(", ")}
                    </p>
                  </div>
                  <div className="w-[79px] h-[79px] bg-gray-300"></div>
                </div>
              </li>

              {activeTab === "합격" ? (
                <div>
                  <button
                    className="w-full px-[15px]"
                    onClick={() => goWriteReview(job)} // ✅ 여기서 postId 포함 이동
                  >
                    <div className="h-[13px] w-full bg-white border-t border-[#729A73]"></div>
                    <div
                      className="text-[15px] text-[#333333]"
                      style={{ fontWeight: 700 }}
                    >
                      후기 작성하기
                    </div>
                    <div className="h-[13px] w-full bg-white border-b border-[#729A73]"></div>
                  </button>
                </div>
              ) : (
                <div className="px-[15px]">
                  <div className="h-[20px] w-full bg-white border-b border-[#DEDEDE]"></div>
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApplyStatus;
