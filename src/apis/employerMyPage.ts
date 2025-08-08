import { axiosInstance } from "./axios";
import type { MyInfo } from "../types/member";
import type { ApiEnvelope, MyPostItem } from "../types/employer";

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