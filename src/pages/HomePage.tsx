import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";
import type { JobsView } from "../types/homepage";
import palette from "../styles/theme";
import SearchBar from "../components/search/SearchBar";
import JobCard from "../components/Homepage/JobCard";
import HomepageTopBar from "../components/Homepage/HomepageTopBar";
import { dummyJobs } from "../data/HomePage";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobList, setJobList] = useState<JobsView[]>(
    location.state?.jobList || []
  );

  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<{
    start?: string;
    end?: string;
  }>({});

  useEffect(() => {
    if (location.state?.jobList) return;

    const fetchJobs = async () => {
      try {
        const allJobs: JobsView[] = dummyJobs;

        const filtered = allJobs.filter((job) => {
          const regionQuery = selectedRegion.join(" ");
          const matchRegion =
            selectedRegion.length === 0 || job.location?.includes(regionQuery);

          const matchType =
            selectedType.length === 0 ||
            (job.job_category &&
              selectedType.some((type) => job.job_category?.includes(type)));

          const matchDay =
            selectedDays.length === 0 ||
            (job.work_days &&
              job.work_days.some((day) => selectedDays.includes(day)));

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
  }, [
    selectedRegion,
    selectedType,
    selectedDays,
    selectedTime,
    location.state,
  ]);

  return (
    <div className="flex flex-col font-[Pretendard] mx-auto max-w-[393px]">
      <div className="flex-shrink-0 pt-[50px]">
        <Header title="내일" />

        <div className="absolute left-1/2 -translate-x-1/2 top-11 w-[393px] h-[10px] bg-white !z-50" />

        <div
          onClick={() => navigate("/search")}
          className="flex justify-center !py-2 !mt-[-4px] cursor-pointer bg-white"
        >
          <SearchBar onSearch={() => {}} />
        </div>

        <div
          className="w-full h-[1px]"
          style={{ backgroundColor: palette.gray.default }}
        />

        <HomepageTopBar
          onRegionSelect={setSelectedRegion}
          onTypeSelect={setSelectedType}
          onDaySelect={setSelectedDays}
          onTimeSelect={setSelectedTime}
        />

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

      <div className="flex-1 overflow-y-scroll bg-white min-h-[calc(100vh-100px)]">
        {jobList.length > 0 ? (
          jobList.map((jobCard) => (
            <JobCard
              key={jobCard.jobId}
              title={jobCard.title}
              company={jobCard.companyName}
              location={jobCard.location}
              wage={`${jobCard.salary.toLocaleString()}원`}
              review={
                jobCard.review_count > 0 ? `${jobCard.review_count}건` : ""
              }
              image={jobCard.job_image_url}
              isTime={jobCard.isTimeNegotiable}
              isPeriod={jobCard.isPeriodNegotiable}
              environment={jobCard.work_environment}
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
