import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { ApplicationFilter, applyStatus } from "../../types/mypage";
import { getApplications } from "../../apis/mypage";
import { SlArrowLeft } from "react-icons/sl";
import defaultLogo from "../../assets/logo/logo.png";

type UIJob = {
  postId?: number;
  date: string;
  company: string;
  title: string;
  image: string;
  envText: string;
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

  // 백엔드 키 → 한국어 라벨
  const environmentMap: Record<string, string> = {
    canCommunicate: "사람 응대 중심",
    canMoveActively: "신체 활동 중심",
    canWorkSitting: "앉아서 근무 중심",
    canWorkStanding: "서서 근무 중심",
    canCarryObjects: "가벼운 물건 운반",
    canLiftLightObjects: "가벼운 물건 운반",
    canLiftHeavyObjects: "무거운 물건 운반",
  };

  const isTrueLike = (v: unknown) =>
    v === true || v === 1 || v === "1" || v === "true" || v === "Y";

  const toEnvText = (envObj?: Record<string, unknown>): string => {
    if (!envObj || typeof envObj !== "object") return "";
    return Object.entries(envObj)
      .filter(([, v]) => isTrueLike(v))
      .map(([k]) => environmentMap[k] ?? "")
      .filter(Boolean)
      .join(", ");
  };

  const mapToUIJob = useCallback((it: applyStatus): UIJob => {
    return {
      postId: it.jobId,
      date: formatDateDot(it.date),
      company: it.company,
      title: it.postTitle,
      image: (it.jobImageUrl ?? "").trim(),
      envText: toEnvText(it.jobWorkEnvironment),
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

  const goDetail = (id?: number) => {
    if (!id) {
      alert("공고 ID가 없습니다.");
      return;
    }
    navigate(`/jobs/${id}`);
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
            <div key={job.postId ?? index}>
              <li>
                <div className="px-[15px] h-[18px] w-full bg-white"></div>
                <div
                  className="flex items-center justify-between h-[104px] px-[20px] cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => goDetail(job.postId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goDetail(job.postId);
                    }
                  }}
                >
                  <div className="w-[250px]">
                    <p className="flex items-end text-[14px]">{job.date}</p>
                    <p className="text-[14px]">{job.company}</p>
                    <p className="text-[16px]" style={{ fontWeight: 800 }}>
                      {job.title}
                    </p>
                    <p className="text-[14px]" style={{ color: "#729A73" }}>
                      {job.envText || ""}
                    </p>
                  </div>

                  <div className="flex-shrink-0 self-center w-[79px] h-[79px] flex items-center justify-center">
                    <img
                      src={job.image || defaultLogo}
                      alt={job.title}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== defaultLogo) {
                          img.src = defaultLogo;
                        }
                      }}
                      className="w-[82px] h-[82px] object-contain"
                    />
                  </div>
                </div>
              </li>

              {activeTab === "합격" ? (
                <div>
                  <button
                    className="w-full px-[15px] mt-[7px]"
                    onClick={() => goWriteReview(job)}
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
