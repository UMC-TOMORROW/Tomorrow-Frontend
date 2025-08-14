import { axiosInstance } from "./axios";
import type { CareerPayload, CareerDetail } from "../types/career";

// 경력 추가
export async function createCareer(resumeId: number, payload: CareerPayload) {
  const { data } = await axiosInstance.post(
    `/api/v1/resumes/${resumeId}/experiences`,
    payload,
    { withCredentials: true }
  );
  return data as { result: { careerId: number } };
}

// 경력 조회
export async function getCareers(resumeId: number) {
  const { data } = await axiosInstance.get(
    `/api/v1/resumes/${resumeId}/experiences`,
    { withCredentials: true }
  );
  return data as { result: CareerDetail[] };
}

// 경력 삭제
export async function deleteCareer(resumeId: number, careerId: number) {
  const { data } = await axiosInstance.delete(
    `/api/v1/resumes/${resumeId}/experiences/${careerId}`,
    { withCredentials: true }
  );
  return data as { result: string };
}
