// 글 등록 시의 사업자 등록, 그냥 사업자 등록에 관한 api 헬퍼
import { axiosInstance } from "../apis/axios";

const getJobIdFromHeaders = (headers: any) => {
  const loc = headers?.location || headers?.Location;
  if (!loc) return null;
  const last = String(loc).split("/").filter(Boolean).pop();
  return last && /^\d+$/.test(last) ? Number(last) : last ?? null;
};

export async function registerJobWithSavedBusiness(): Promise<{ step?: string; jobId: number | string | null }> {
  const res = await axiosInstance.post(
    "/api/v1/jobs/business-verifications/register",
    {}, // ← 입력 안 받으므로 빈 바디
    { withCredentials: true, headers: { Accept: "application/json" } }
  );

  const body = res?.data?.result ?? res?.data ?? {};
  let jobId: any = body?.jobId ?? body?.id ?? null;
  if (!jobId) jobId = getJobIdFromHeaders(res?.headers);

  return { step: body?.step, jobId: jobId ?? null };
}
