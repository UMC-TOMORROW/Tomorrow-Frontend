import { axiosInstance } from "./axios";
import type { MemberMe, MyInfo } from "../types/member";

export const getMe1 = async (): Promise<MemberMe> => {
  const { data } = await axiosInstance.get<MemberMe>("/api/v1/members/me", {
    withCredentials: true,
  });
  return data;
};

export async function getMyInfo1(): Promise<MyInfo> {
  const { data } = await axiosInstance.get<MyInfo>("/api/v1/members/me", {
    withCredentials: true,
  });
  return data;
}

export async function putMyProfileImage(file: File): Promise<void> {
  const form = new FormData();
  form.append("imageFile", file);

  await axiosInstance.put("/api/v1/members/me/profile-image", form, {
    withCredentials: true,
  });
}
