import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";
import type { Job } from "../types/homepage";
import palette from "../styles/theme";
import SearchBar from "../components/search/SearchBar";
import JobCard from "../components/Homepage/JobCard";
import { getJobsDefault } from "../apis/HomePage";
import HomepageTopBar from "../components/Homepage/HomepageTopBar";

const HomePage = () => {
  const navigate = useNavigate();
  const [jobList, setJobList] = useState<Job[]>([]);

  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<{
    start?: string;
    end?: string;
  }>({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const allJobs = await getJobsDefault();

        if (!Array.isArray(allJobs)) {
          console.error("allJobs가 배열이 아님:", allJobs);
          setJobList([]);
          return;
        }

        const filtered = allJobs.filter((job: Job) => {
          const matchRegion =
            selectedRegion.length === 0 ||
            selectedRegion.some((region: string) =>
              job.location.includes(region)
            );

          const matchType =
            selectedType.length === 0 ||
            selectedType.some((type: string) =>
              job.job_category.includes(type)
            );

          const matchDay =
            selectedDays.length === 0 ||
            job.work_days?.some((day: string) => selectedDays.includes(day));

          const matchTime =
            (!selectedTime.start && !selectedTime.end) ||
            (job.work_start &&
              job.work_end &&
              (!selectedTime.start || job.work_start >= selectedTime.start) &&
              (!selectedTime.end || job.work_end <= selectedTime.end));

          return matchRegion && matchType && matchDay && matchTime;
        });

        setJobList(filtered);
      } catch (error) {
        console.error("기본 일자리 목록 조회 실패:", error);
        setJobList([]);
      }
    };

    fetchJobs();
  }, [selectedRegion, selectedType, selectedDays, selectedTime]);

  return (
    <div className="flex flex-col font-[Pretendard] mx-auto max-w-[393px]">
      <div className="flex-shrink-0 pt-[50px]">
        <Header title="내일" />
        <HomepageTopBar
          setJobList={setJobList}
          onRegionSelect={setSelectedRegion}
          onTypeSelect={setSelectedType}
          onDaySelect={setSelectedDays}
          onTimeSelect={setSelectedTime}
        />

        <div
          className="w-full h-[1px]"
          style={{ backgroundColor: palette.gray.default }}
        />
        <div className="h-[7px]" />

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
              {Array.isArray(jobList) ? jobList.length : 0}건
            </span>
          </div>
          <div
            className="w-full h-[1px]"
            style={{ backgroundColor: palette.gray.default }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll bg-white">
        {Array.isArray(jobList) && jobList.length > 0 ? (
          jobList.map((job: Job, index: number) => (
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

      <BottomNavbar />
    </div>
  );
};

export default HomePage;
