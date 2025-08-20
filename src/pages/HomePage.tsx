import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNavbar from "../components/BottomNavbar";
import type { JobsView, PaymentType } from "../types/homepage";
import palette from "../styles/theme";
import SearchBar from "../components/search/SearchBar";
import JobCard from "../components/Homepage/JobCard";
import HomepageTopBar from "../components/Homepage/HomepageTopBar";
import { getJobsDefault } from "../apis/HomePage";

type JobLike = JobsView & {
  jobCategory?: string;
  workStart?: string | null;
  workEnd?: string | null;
};

const dayKey: Record<
  string,
  "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
> = {
  MON: "mon",
  TUE: "tue",
  WED: "wed",
  THU: "thu",
  FRI: "fri",
  SAT: "sat",
  SUN: "sun",
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobList, setJobList] = useState<JobsView[]>(
    Array.isArray((location.state as any)?.jobList)
      ? (location.state as any).jobList
      : []
  );

  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<{
    start?: string;
    end?: string;
  }>({});

  useEffect(() => {
    const toMin = (t?: string | null) => {
      if (!t) return undefined;
      const [hh, mm] = String(t).split(":");
      const h = Number(hh),
        m = Number(mm);
      if (Number.isNaN(h) || Number.isNaN(m)) return undefined;
      return h * 60 + m;
    };

    const hasAllWantedDays = (wd: JobsView["workDays"], wantKeys: string[]) => {
      if (!wd) return false;

      if (typeof wd === "string") return wantKeys.includes(wd.toLowerCase());

      if (Array.isArray(wd)) {
        const lower = wd.map((s) => String(s).toLowerCase());
        return wantKeys.every((k) => lower.includes(k));
      }

      if (typeof wd === "object") {
        if ((wd as any).isDayNegotiable === true) return true;
        return wantKeys.every((k) => (wd as any)[k] === true);
      }

      return false;
    };

    const applyAllFilters = async (baseJobs: JobsView[]) => {
      let jobs = [...baseJobs];

      // 1) 요일 필터
      if (selectedDays.length > 0) {
        const want = selectedDays.map((d) => dayKey[d]).filter(Boolean);
        jobs = jobs.filter((j) => hasAllWantedDays(j.workDays, want));
      }

      // 2) 지역 필터
      if (selectedRegion.length > 0) {
        jobs = jobs.filter((j) =>
          selectedRegion.every((kw) => (j.location ?? "").includes(kw))
        );
      }

      // 3) 유형 필터
      if (selectedType.length > 0) {
        jobs = jobs.filter((j: JobLike) => {
          const raw = (j as any).job_category ?? j.jobCategory;
          const cat: string = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
          return selectedType.includes(cat);
        });
      }

      // 4) 시간 필터
      if (selectedTime.start || selectedTime.end) {
        const startMin = toMin(selectedTime.start ?? "00:00")!;
        const endMin = toMin(selectedTime.end ?? "23:59")!;
        jobs = jobs.filter((j: JobLike) => {
          const sStr = (j.workStart ?? "").slice(0, 5);
          const eStr = (j.workEnd ?? "").slice(0, 5);
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
        const base: JobsView[] = Array.isArray((location.state as any)?.jobList)
          ? (location.state as any).jobList
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

  const asPaymentType = (v: string): PaymentType => {
    if (v === "HOURLY" || v === "DAILY" || v === "MONTHLY" || v === "PER_TASK")
      return v;
    console.warn("[payment_type] unexpected:", v);
    return "HOURLY";
  };

  const handleHeaderClick = () => {
    setSelectedRegion([]);
    setSelectedType([]);
    setSelectedDays([]);
    setSelectedTime({});
    navigate("/", { replace: true, state: undefined });
  };

  return (
    <div className="flex flex-col font-[Pretendard] mx-auto max-w-[393px] bg-white min-h-screen">
      {/* 헤더 */}
      <div className="flex-shrink-0 pt-[30px] bg-white">
        <button
          type="button"
          onClick={handleHeaderClick}
          className="w-full text-left relative"
        >
          <Header title="내일" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />
        </button>
        <div className="fixed left-0 right-0 mx-auto max-w-[393px] top-[49px] h-[2px] bg-white z-[60] pointer-events-none" />

        {/* 검색바 */}
        <div className="relative bg-white">
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
          selectedRegion={selectedRegion}
          selectedType={selectedType}
          selectedDays={selectedDays}
          selectedTime={selectedTime}
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
              jobId={jobCard.jobId}
              title={jobCard.title}
              company={jobCard.companyName}
              location={jobCard.location}
              wage={`${(jobCard.salary ?? 0).toLocaleString()}원`}
              review={
                typeof jobCard.review_count === "number" &&
                jobCard.review_count > 0
                  ? `${jobCard.review_count}건`
                  : ""
              }
              image={
                (jobCard as any).job_image_url ?? jobCard.jobImageUrl ?? ""
              }
              isTime={Boolean(jobCard.isTimeNegotiable)}
              isPeriod={Boolean(jobCard.isPeriodNegotiable)}
              environment={
                Array.isArray(jobCard.workEnvironment)
                  ? jobCard.workEnvironment
                  : jobCard.workEnvironment
                  ? [String(jobCard.workEnvironment)]
                  : []
              }
              paymentType={asPaymentType(
                (jobCard as any).payment_type ??
                  (jobCard as any).paymentType ??
                  ""
              )}
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
