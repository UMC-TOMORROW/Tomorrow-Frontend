// 글 등록 시의 사업자 등록, 그냥 사업자 등록에 관한 api 헬퍼
import { axiosInstance } from "../apis/axios";

export async function registerJobWithSavedBusiness() {
  const res = await axiosInstance.post(
    "/api/v1/jobs/business-verifications/register",
    {},
    { withCredentials: true, headers: { Accept: "application/json" } }
  );

  const data = res?.data?.result ?? res?.data ?? {};
  return { step: data?.step };
}

export async function registerBusinessOnly(payload: {
  bizNumber: string;
  companyName: string;
  ownerName: string;
  openingDate: string;
}) {
  return axiosInstance.post("/api/v1/jobs/business-verifications/only", payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
}
