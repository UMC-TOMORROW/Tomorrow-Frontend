import { axiosInstance } from "./axios";
import type { MyInfo } from "../types/member";

export const getMyInfo = async (): Promise<MyInfo> => {
  const response = await axiosInstance.get<MyInfo>("/api/v1/members/me");
  return response.data;
};