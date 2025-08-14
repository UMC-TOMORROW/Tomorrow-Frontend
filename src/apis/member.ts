import { axiosInstance } from "./axios";
import type { MemberMe } from "../types/member";

export const getMe = async (): Promise<MemberMe> => {
  const { data } = await axiosInstance.get<MemberMe>("/api/v1/members/me", {
    withCredentials: true,
  });
  return data;
};
