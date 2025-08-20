import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobStore } from "../../stores/useJobStore";
import type { MyPostItem } from "../../types/employer";
import { getMyClosedPosts, getMyOpenPosts } from "../../apis/employerMyPage";
import { SlArrowLeft } from "react-icons/sl";
import defaultLogo from "../../assets/logo/logo.png";

const formatDotDate = (iso: string) => (iso ? iso.replaceAll("-", ".") : "");

const mapToJob = (p: MyPostItem) => ({
  id: p.jobId,
  date: formatDotDate(p.date),
  company: p.location,
  title: p.title,
  status: p.status as "모집중" | "모집완료",
  tags: p.tags ?? [],
  imageUrl: (p as any).imageUrl ?? "",
});

const getJobImage = (j: unknown) => {
  const u = (j as any)?.imageUrl;
  return typeof u === "string" ? u : "";
};

const ManageMyJobs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"모집중" | "모집완료">("모집중");
  const { jobs, setJobs } = useJobStore();

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [open, closed] = await Promise.all([
          getMyOpenPosts(),
          getMyClosedPosts(),
        ]);

        if (cancelled) return;

        const openJobs = (open ?? []).map(mapToJob);
        const closedJobs = (closed ?? []).map(mapToJob);

        setJobs([...openJobs, ...closedJobs]);
      } catch (e) {
        console.error("내 공고 불러오기 실패:", e);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [setJobs]);

  const filteredJobs = useMemo(
    () => jobs.filter((job: any) => job.status === activeTab),
    [jobs, activeTab]
  );

  return (
    <div style={{ fontFamily: "Pretendard" }}>
      <div className="bg-white min-h-screen">
        <section className="relative flex justify-center items-center text-[20px] h-[52px] border-b border-[#DEDEDE]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-[15px]"
          >
            <SlArrowLeft />
          </button>
          <div
            className="flex justify-center items-center text-[20px] h-[52px] border-b border-[#DEDEDE]"
            style={{ fontWeight: 600 }}
          >
            내 공고 관리
          </div>
        </section>

        <section className="flex justify-around items-center h-[45px]">
          <button
            onClick={() => setActiveTab("모집중")}
            className={`w-full text-[16px] ${
              activeTab === "모집중" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            모집중
          </button>
          <button
            onClick={() => setActiveTab("모집완료")}
            className={`w-full text-[16px] ${
              activeTab === "모집완료" ? "border-b-3 border-[#729A73]" : ""
            }`}
          >
            모집 완료
          </button>
        </section>

        <div className="flex text-[12px] items-center pl-[20px] h-[36px] border-b border-[#DEDEDE]">
          {filteredJobs.length}건
        </div>

        <ul>
          {filteredJobs.map((job: any) => (
            <div
              key={job.id}
              onClick={() => navigate(`/MyPage/ApplicantList?jobId=${job.id}`)}
            >
              <li>
                <div className="px-[15px] h-[18px] w-full bg-white "></div>
                <div className="flex items-center justify-between h-[104px] px-[20px]">
                  <div>
                    <p className="flex items-end text-[14px]">{job.date}</p>
                    <p className="text-[14px]">{job.company}</p>
                    <div className="flex gap-[10px]">
                      <p
                        className="text-[16px] !w-[200px]"
                        style={{ fontWeight: 800 }}
                      >
                        {job.title}
                      </p>
                      <div
                        className={`flex items-center justify-center h-[19px] text-[11px] bg-[#D9D9D9] ${
                          job.status === "모집중"
                            ? "w-[36px] text-[#729A73]"
                            : "w-[45px] text-[#EE0606CC]"
                        }`}
                        style={{ fontWeight: 600, borderRadius: "5px" }}
                      >
                        {job.status}
                      </div>
                    </div>
                    <p className="text-[14px] text-[#729A73]">
                      {(job.tags ?? []).join(", ")}
                    </p>
                  </div>

                  <div className="flex-shrink-0 self-center w-[79px] h-[79px] flex items-center justify-center">
                    <img
                      src={getJobImage(job) || defaultLogo}
                      alt={job.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = defaultLogo;
                      }}
                      className="w-[79px] h-[79px] object-contain"
                    />
                  </div>
                </div>
                <div className="px-[15px]">
                  <div className="h-[20px] w-full bg-white border-b border-[#DEDEDE]"></div>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageMyJobs;
