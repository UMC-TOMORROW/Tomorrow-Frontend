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
    const fetchJobs = async () => {
      try {
        // 검색 페이지에서 넘어온 목록이 있으면 그걸 우선 사용
        if (location.state?.jobList && Array.isArray(location.state.jobList)) {
          setJobList(location.state.jobList);
          return;
        }

        // 1) 기본 조회
        let jobs = await getJobsDefault();

        // 2) 지역 필터 (서버)
        if (selectedRegion.length > 0) {
          jobs = jobs.filter((j: JobsView) =>
            selectedRegion.every((kw) => j.location?.includes(kw))
          );
        }

        // 3) 업무 유형 필터 (서버)
        if (selectedType.length > 0) {
          jobs = jobs.filter((j: JobsView) =>
            selectedType.includes(
              Array.isArray(j.job_category)
                ? j.job_category[0] ?? ""
                : j.job_category ?? ""
            )
          );
        }

        // 4) 요일 필터 (서버)
        if (selectedDays.length > 0) {
          const byDay = await getJobsByDay(selectedDays);
          const validIds = new Set(byDay.map((j) => j.jobId));
          jobs = jobs.filter((j) => validIds.has(j.jobId));
        }

        // 5) 시간 필터 (서버)
        const toMin = (t?: string) => {
          if (!t) return undefined;
          const [hh, mm] = t.split(":");
          return Number(hh) * 60 + Number(mm);
        };
        if (selectedTime.start || selectedTime.end) {
          const startMin = toMin(selectedTime.start || "00:00");
          const endMin = toMin(selectedTime.end || "23:59");
          jobs = jobs.filter((j: JobsView) => {
            const s = toMin(j.work_start);
            const e = toMin(j.work_end);
            if (s == null || e == null) return false;
            return !(e < startMin! || s > endMin!);
          });
        }

        setJobList(jobs);
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
      <div className="flex-shrink-0 pt-[50px]">
        <Header title="내일" />
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
              image={jobCard.job_image_url ?? ""} // string 보장
              isTime={Boolean(jobCard.isTimeNegotiable)} // boolean 보장
              isPeriod={Boolean(jobCard.isPeriodNegotiable)} // boolean 보장
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
