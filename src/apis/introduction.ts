import { axiosInstance } from "./axios";
import { isAxiosError } from "axios";
import type {
  GetIntroductionResponse,
  PostIntroductionRequest,
  PostIntroductionResponse,
  PutIntroductionRequest,
  PutIntroductionResponse,
} from "../types/introduction";

// 자기소개 조회
export const getIntroduction = async (
  resumeId: number
): Promise<GetIntroductionResponse | null> => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/resumes/${resumeId}/introductions`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: unknown) {
    if (isAxiosError(err) && err?.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

// 자기소개 추가
export const postIntroduction = async (
  resumeId: number,
  body: PostIntroductionRequest
): Promise<PostIntroductionResponse> => {
  const { data } = await axiosInstance.post(
    `/api/v1/resumes/${resumeId}/introductions`,
    body,
    { withCredentials: true }
  );
  return data;
};

// 자기소개 수정
export const putIntroduction = async (
  resumeId: number,
  body: PutIntroductionRequest
): Promise<PutIntroductionResponse> => {
  const { data } = await axiosInstance.put(
    `/api/v1/resumes/${resumeId}/introductions`,
    body,
    { withCredentials: true }
  );
  return data;
};
