import { axiosInstance } from "./axios";
import { isAxiosError } from "axios";

export type CertificateDTO = {
  id: number;
  fileUrl: string;
  filename: string;
};

export type DeleteCertificateResponse = {
  timestamp: string;
  code: string;
  message: string;
  result: CertificateDTO;
};

type ListCertificateResponse = { result: CertificateDTO[] };
type UploadCertificateResponse = { result: CertificateDTO };

// 조회
export async function listCertificate(
  resumeId: number
): Promise<ListCertificateResponse> {
  try {
    const { data } = await axiosInstance.get<ListCertificateResponse>(
      `/api/v1/resumes/${resumeId}/certificates`,
      { withCredentials: true }
    );
    return data;
  } catch (e: unknown) {
    if (isAxiosError(e) && e.response?.status === 404) return { result: [] };
    throw e;
  }
}

// 업로드
export async function uploadCertificate(
  resumeId: number,
  file: File
): Promise<UploadCertificateResponse> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await axiosInstance.post<UploadCertificateResponse>(
    `/api/v1/resumes/${resumeId}/certificates`,
    form,
    {
      withCredentials: true,
    }
  );
  return data;
}

// 삭제
export async function deleteCertificate(
  resumeId: number,
  certificateId: number
): Promise<DeleteCertificateResponse> {
  const { data } = await axiosInstance.delete<DeleteCertificateResponse>(
    `/api/v1/resumes/${resumeId}/certificates/${certificateId}`,
    { withCredentials: true }
  );
  return data;
}
