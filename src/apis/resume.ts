import { axiosInstance } from "./axios";
import type { SaveResumeResponse, SaveResumeRequest } from "../types/resume";

export async function saveResume(body: SaveResumeRequest) {
  const { data } = await axiosInstance.post<SaveResumeResponse>(
    "/api/v1/resumes",
    body,
    { withCredentials: true }
  );
  return data;
}
