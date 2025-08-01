import { axiosInstance } from "./axios";
export const authApi = {
  async refresh(): Promise<boolean> {
    try {
      const { data } = await axiosInstance.post<{ accessToken: string }>("/api/v1/auth/refresh", {});
      // accessToken을 메모리에 보관해서 쓰려면 setAccessToken(...);
      return !!data?.accessToken; // 서버 스키마에 맞게 조정
    } catch {
      return false;
    }
  },
};
