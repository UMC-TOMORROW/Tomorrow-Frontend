import { axiosInstance } from "./axios";
import type { MyInfo } from "../types/member";
import type { ApiEnvelope, ApiEnvelopeNoResult, MyPostItem, MyPostStatus } from "../types/employer";
import type { Applicant } from "../types/applicant";

export const getMyInfo = async (): Promise<MyInfo> => {
  const response = await axiosInstance.get<MyInfo>("/api/v1/members/me");
  return response.data;
};

// 내 '모집중' 공고 조회
export const getMyOpenPosts = async (): Promise<MyPostItem[]> => {
  const res = await axiosInstance.get<ApiEnvelope<MyPostItem[]>>(
    "/api/v1/my-posts/open"
  );
  return res.data.result;
};

// 내 '모집완료' 공고 조회
export const getMyClosedPosts = async (): Promise<MyPostItem[]> => {
  const res = await axiosInstance.get<ApiEnvelope<MyPostItem[]>>(
    "/api/v1/my-posts/closed"
  );
  return res.data.result;
};

// 모집글 상태 변경 (모집중/모집완료)
export const updateMyPostStatus = async (
  postId: number,
  status: MyPostStatus
): Promise<void> => {
  await axiosInstance.patch<ApiEnvelopeNoResult>(
    `/api/v1/jobs/${postId}/status`,
    { status }
  );
};

// 지원자 목록 조회
export const getApplicantsByPostId = async (
  postId: number,
  status?: "open" | "closed" | string
): Promise<Applicant[]> => {
  const res = await axiosInstance.get<ApiEnvelope<Applicant[]>>(
    `/api/v1/posts/${postId}/applicants`,
    { params: status ? { status } : {} }
  );
  return res.data.result;
};