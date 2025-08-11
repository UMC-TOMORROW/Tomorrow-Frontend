import { axiosInstance } from "./axios";
import type { JobRequest } from "../types/jobs";

export const createJobForm = async (payload: JobRequest, imageFile?: File) => {
  const formData = new FormData();
  formData.append("jobRequest", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await axiosInstance.post<{
    code: string;
    message: string;
    result: { registrantType: string; step: string; jobId: number };
  }>("/api/v1/jobs", formData);

  return res.data.result;
};
