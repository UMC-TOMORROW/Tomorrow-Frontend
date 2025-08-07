import type { JobsView } from "../types/homepage";
import { axiosInstance } from "./axios";

// 지역 기반 일자리 조회
export const getJobsByRegion = async (
  regions: string[]
): Promise<JobsView[]> => {
  const params = new URLSearchParams();
  regions.forEach((region) => {
    if (region) params.append("region", region);
  });

  const response = await axiosInstance.get("/api/v1/jobsView", {
    params,
  });

  return response.data.result;
};

// 업무 유형 기반 일자리 조회
export const getJobsByType = async (
  jobCategories: string[]
): Promise<JobsView[]> => {
  const params = new URLSearchParams();
  jobCategories.forEach((category) => {
    if (category) params.append("job_category", category);
  });

  const response = await axiosInstance.get("/api/v1/jobsView", {
    params,
  });

  return response.data.result;
};

// 요일 기반 일자리 조회
export const getJobsByDay = async (days: string[]): Promise<JobsView[]> => {
  const params = new URLSearchParams();
  days.forEach((day) => {
    if (day) params.append("work_days", day);
  });

  const response = await axiosInstance.get("/api/v1/jobsView", {
    params,
  });

  return response.data.result;
};

// 시간 기반 일자리 조회
export const getJobsByTime = async (
  work_start: string,
  work_end: string
): Promise<JobsView[]> => {
  const params = { work_start, work_end };

  const response = await axiosInstance.get("/api/v1/jobsView", {
    params,
  });

  return response.data.result;
};

// 전체 일자리 목록 조회
export const getJobsDefault = async (): Promise<JobsView[]> => {
  const response = await axiosInstance.get("/api/v1/jobsView");
  return response.data.result;
};

// 일자리 키워드 검색
export const getJobsByKeyword = async (keyword: string) => {
  const response = await axiosInstance.post("/api/v1/jobs/search", {
    keyword: keyword,
  });

  console.log("🔥 getJobsByKeyword 응답:", response.data); // ✅ 이거도 찍어

  return response.data;
};
