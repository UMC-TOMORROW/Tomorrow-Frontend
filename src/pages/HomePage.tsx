import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomepageTopBar from "../components/Homepage/HomepageTopBar";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";
import type { Job } from "../types/homepage";
import palette from "../styles/theme";
import SearchBar from "../components/search/SearchBar";
import JobCard from "../components/Homepage/JobCard";
import { getJobsDefault } from "../apis/HomePage";

const HomePage = () => {
  const navigate = useNavigate();
  const [jobList, setJobList] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobsDefault();
        setJobList(jobs);
      } catch (error) {
        console.error("기본 일자리 목록 조회 실패:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col font-[Pretendard] mx-auto max-w-[393px]">
      {/* 상단 고정 영역 */}
      <div className="flex-shrink-0 pt-[50px]">
        <Header title="내일" />

        <HomepageTopBar
          onRegionSelect={(jobs) => {
            console.log("🟩 Homepage에 전달된 jobs:", jobs); // api 전달 확인
            setJobList(jobs);
          }}
        />

        <div
          className="w-full h-[1px]"
          style={{ backgroundColor: palette.gray.default }}
        />
        <div className="h-[7px]" />

        {/* 검색바 */}
        <div
          onClick={() => navigate("/search")}
          className="flex justify-center py-4 cursor-pointer"
        >
          <SearchBar onSearch={() => {}} />
        </div>

        <div className="h-[7px]" />
        <div
          className="w-full h-[1px]"
          style={{ backgroundColor: palette.gray.default }}
        />

        <div className="bg-white">
          <div className="flex justify-between items-center h-[25px]">
            <span
              className="!ml-7 text-[12px]"
              style={{ color: palette.gray.default }}
            >
              {jobList.length}건
            </span>
          </div>
          <div
            className="w-full h-[1px]"
            style={{ backgroundColor: palette.gray.default }}
          />
        </div>
      </div>

      {/* 중앙 스크롤 영역 */}
      <div className="flex-1 overflow-y-scroll bg-white">
        {jobList.length > 0 ? (
          jobList.map((job, index) => (
            <JobCard
              key={job.jobId}
              company={job.company_name}
              title={job.title}
              tags={job.job_category}
              duration={job.isPeriodNegotiable ? "기간 협의" : "고정 기간"}
              review={job.review_count > 0 ? `${job.review_count}건` : ""}
              location={job.location}
              wage={`${job.salary.toLocaleString()}원`}
              isFirst={index === 0}
            />
          ))
        ) : (
          <p className="text-center mt-10 text-gray-500">일자리가 없습니다.</p>
        )}

        <div className="h-[63px]" />
      </div>

      {/* 하단 고정 바 */}
      <BottomNavbar />
    </div>
  );
};

export default HomePage;
