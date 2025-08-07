import axios from "axios";
import type { Job } from "../types/homepage";
import { axiosInstance } from "./axios";

// 일자리 목록 조회 (지역 기반)
export const getJobsByRegion = async (regions: string[]) => {
  const params = new URLSearchParams();
  regions.forEach((region) => {
    if (region) params.append("region", region);
  });

  const response = await axiosInstance.get(
    `/api/v1/jobsView?${params.toString()}`
  );
  return response.data.result;
};

// 일자리 목록 조회 (업무 유형 기반)
export const getJobsByType = async (jobCategories: string[]) => {
  const params = new URLSearchParams();
  jobCategories.forEach((category) => {
    if (category) params.append("job_category", category);
  });

  const response = await axiosInstance.get(
    `/api/v1/jobsView?${params.toString()}`
  );
  return response.data.result;
};

// 요일 기반 일자리 조회
export const getJobsByDay = async (days: string[]) => {
  const params = new URLSearchParams();
  days.forEach((day) => {
    if (day) params.append("work_days", day);
  });

  const response = await axiosInstance.get(
    `/api/v1/jobsView?${params.toString()}`
  );
  return response.data.result;
};

// 기본 전체 일자리 목록 조회
export const getJobsDefault = async (): Promise<Job[]> => {
  const response = await axios.get("https://umctomorrow.shop/api/v1/jobsView", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return response.data.result;
};
