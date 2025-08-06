import type { PostCertificateResponse } from "../types/license";
import { axiosInstance } from "./axios";

// 이력서 자격증 업로드
export const uploadCertificate = async (
  resumeId: number,
  file: File
): Promise<PostCertificateResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      `/api/v1/resumes/${resumeId}/certificates`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("업로드 에러:", error);
    throw error;
  }
};

export const deleteCertificate = async (
  resumeId: number,
  certificateId: number
): Promise<void> => {
  try {
    await axiosInstance.delete(
      `/api/v1/resumes/${resumeId}/certificates/${certificateId}`,
      {
        withCredentials: true,
      }
    );
    console.log("삭제 성공");
  } catch (error) {
    console.error("삭제 실패:", error);
    throw error;
  }
};
