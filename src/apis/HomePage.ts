import type { JobsView } from "../types/homepage";
import { axiosInstance } from "./axios";

const asList = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.result)) return obj.result as T[];
    const r = obj.result as Record<string, unknown> | undefined;
    if (r && Array.isArray(r.content)) return r.content as T[];
  }
  return [];
};

// 지역 기반 일자리 조회
export const getJobsByRegion = async (
  regions: string[]
): Promise<JobsView[]> => {
  const params = new URLSearchParams();
  regions.forEach((region) => region && params.append("region", region));
  const res = await axiosInstance.get("/api/v1/jobsView", { params });
  return asList<JobsView>(res.data);
};

// 업무 유형 기반 일자리 조회
export const getJobsByType = async (
  jobCategories: string[]
): Promise<JobsView[]> => {
  const params = new URLSearchParams();
  jobCategories.forEach((c) => c && params.append("job_category", c));
  const res = await axiosInstance.get("/api/v1/jobsView", { params });
  return asList<JobsView>(res.data);
};

// 요일 기반 일자리 조회 (여러 개 허용)
export const getJobsByDay = async (days: string[]): Promise<JobsView[]> => {
  const params = new URLSearchParams();
  days.forEach((d) => d && params.append("work_days", d));
  const res = await axiosInstance.get("/api/v1/jobsView", { params });
  return asList<JobsView>(res.data);
};

// 시간 기반 일자리 조회
export const getJobsByTime = async (
  work_start?: string,
  work_end?: string
): Promise<JobsView[]> => {
  const params = new URLSearchParams();
  params.set("work_start", (work_start ?? "00:00").slice(0, 5));
  params.set("work_end", (work_end ?? "23:59").slice(0, 5));
  const res = await axiosInstance.get("/api/v1/jobsView", { params });
  return asList<JobsView>(res.data);
};

// 전체 일자리 목록 조회
export const getJobsDefault = async (): Promise<JobsView[]> => {
  const res = await axiosInstance.get("/api/v1/jobsView");
  return asList<JobsView>(res.data);
};

// 키워드 검색
export const getJobsByKeyword = async (
  keyword: string
): Promise<JobsView[]> => {
  const kw = (keyword ?? "").trim();
  if (!kw) return [];

  try {
    const r1 = await axiosInstance.post("/api/v1/jobs/search", { keyword: kw });
    return asList<JobsView>(r1.data);
  } catch {
    try {
      const r2 = await axiosInstance.post("/api/v1/jobs/search", {
        search: kw,
      });
      return asList<JobsView>(r2.data);
    } catch {
      const r3 = await axiosInstance.post("/api/v1/jobs/search", { q: kw });
      return asList<JobsView>(r3.data);
    }
  }
};
