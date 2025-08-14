import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";
import type { JobsView } from "../types/homepage";
import palette from "../styles/theme";
import SearchBar from "../components/search/SearchBar";
import JobCard from "../components/Homepage/JobCard";
import HomepageTopBar from "../components/Homepage/HomepageTopBar";
import { getJobsByDay, getJobsDefault } from "../apis/HomePage";

type JobLike = JobsView & {
  jobCategory?: string;
  workStart?: string;
  workEnd?: string;
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobList, setJobList] = useState<JobsView[]>(
    Array.isArray(location.state?.jobList) ? location.state.jobList : []
  );

  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<{
    start?: string;
    end?: string;
  }>({});

  useEffect(() => {
    const toMin = (t?: string) => {
      if (!t) return undefined;
      const [hh, mm] = t.split(":");
      return Number(hh) * 60 + Number(mm);
    };

    const applyAllFilters = async (baseJobs: JobsView[]) => {
      let jobs = [...baseJobs];

      // 1) 요일 필터
      if (selectedDays.length > 0) {
        const byDay = await getJobsByDay(selectedDays);
        const validIds = new Set(byDay.map((j: { jobId: number }) => j.jobId));
        jobs = jobs.filter((j: JobLike) => validIds.has(j.jobId));
      }

      // 2) 지역 필터
      if (selectedRegion.length > 0) {
        jobs = jobs.filter((j: JobLike) =>
          selectedRegion.every((kw) => (j.location ?? "").includes(kw))
        );
      }

      // 3) 유형 필터
      if (selectedType.length > 0) {
        jobs = jobs.filter((j: JobLike) => {
          type CatShape = {
            job_category?: string | string[];
            jobCategory?: string | string[];
          };
          const s = (j as CatShape).job_category ?? (j as CatShape).jobCategory;
          const cat: string = Array.isArray(s) ? s[0] ?? "" : s ?? "";
          return selectedType.includes(cat);
        });
      }

      // 4) 시간 필터
      if (selectedTime.start || selectedTime.end) {
        const startMin = toMin(selectedTime.start || "00:00")!;
        const endMin = toMin(selectedTime.end || "23:59")!;
        jobs = jobs.filter((j: JobLike) => {
          const sStr = (j.work_start ?? j.workStart ?? "").slice(0, 5);
          const eStr = (j.work_end ?? j.workEnd ?? "").slice(0, 5);
          const s = toMin(sStr);
          const e = toMin(eStr);
          if (s == null || e == null) return false;
          return !(e < startMin || s > endMin);
        });
      }

      return jobs;
    };

    const fetchJobs = async () => {
      try {
        const base: JobsView[] = Array.isArray(location.state?.jobList)
          ? location.state.jobList
          : await getJobsDefault();

        const filtered = await applyAllFilters(base);
        setJobList(filtered);
      } catch (error) {
        console.error("일자리 조회 실패:", error);
        setJobList([]);
      }
    };

    fetchJobs();
  }, [
    location.state,
    selectedRegion,
    selectedType,
    selectedDays,
    selectedTime,
  ]);

  return (
    <div className="flex flex-col font-[Pretendard] mx-auto max-w-[393px]">
      {/* 헤더 */}
      <div className="flex-shrink-0 pt-[50px]">
        <Header title="내일" />

        {/* 검색바 */}
        <div className="relative bg-white">
          <div className="absolute left-0 right-0 -top-px h-[1px] bg-white z-[100] pointer-events-none" />

          <div
            onClick={() => navigate("/search")}
            className="flex justify-center py-4 cursor-pointer"
          >
            <SearchBar onSearch={() => {}} />
          </div>
        </div>

        <div className="h-2 bg-white" />

        {/* 모달 */}
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
              {Array.isArray(jobList) ? jobList.length : 0}건
            </span>
          </div>
          <div
            className="w-full h-[1px]"
            style={{ backgroundColor: palette.gray.default }}
          />
        </div>
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-scroll bg-white">
        {Array.isArray(jobList) && jobList.length > 0 ? (
          jobList.map((jobCard) => (
            <JobCard
              key={jobCard.jobId}
              title={jobCard.title}
              company={jobCard.companyName}
              location={jobCard.location}
              wage={`${jobCard.salary?.toLocaleString() || "0"}원`}
              review={
                typeof jobCard.review_count === "number" &&
                jobCard.review_count > 0
                  ? `${jobCard.review_count}건`
                  : ""
              }
              image={jobCard.job_image_url ?? ""}
              isTime={Boolean(jobCard.isTimeNegotiable)}
              isPeriod={Boolean(jobCard.isPeriodNegotiable)}
              environment={
                Array.isArray(jobCard.work_environment)
                  ? jobCard.work_environment
                  : []
              }
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
