import { axiosInstance } from "../apis/axios";
import type {
  JobDraftPayload,
  CommonResponse,
  JobCreateResult,
  BusinessVerifyPayload,
  PersonalVerifyPayload,
  RegistrantType,
} from "../types/jobs";

export const pickResult = (res: any): JobCreateResult | null => {
  if (res?.data?.result) return res.data.result;
  if (res?.data?.data) return res.data.data;
  if (res?.data && typeof res.data === "object") return res.data;
  return null;
};

export const getJobIdFromLocation = (headers: any): number | string | null => {
  const loc = headers?.location || headers?.Location;
  if (!loc || typeof loc !== "string") return null;
  const last = loc.split("/").filter(Boolean).pop();
  if (!last) return null;
  return /^\d+$/.test(last) ? Number(last) : last;
};

// 로컬 스토리지에서 마지막 jobId를 가져오고, 없으면 0부터 시작
// 이후 jobId는 로컬에서 증가형으로 관리
export const getNextJobId = (): number => {
  const raw = localStorage.getItem("lastJobId");
  const base = Number.isFinite(Number(raw)) ? Number(raw) : 0;
  const next = base + 1;
  localStorage.setItem("lastJobId", String(next));
  return next;
};

const buildHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function createJobDraft(
  body: JobDraftPayload,
  opts?: { allowLocalFallback?: boolean }
): Promise<{
  raw: CommonResponse<JobCreateResult> | any;
  jobId: number | string;
  registrantType: RegistrantType | undefined;
  step: string | undefined;
}> {
  const res = await axiosInstance.post("/api/v1/jobs", body, {
    withCredentials: true,
    headers: buildHeaders(),
  });

  const parsed = pickResult(res) as JobCreateResult | null;
  const step = parsed?.step ?? res?.data?.result?.step;
  const registrantType = (parsed?.registrantType ?? res?.data?.result?.registrantType) as RegistrantType | undefined;

  // jobId: result → Location header
  let jobId: any = parsed?.jobId ?? res?.data?.result?.jobId ?? null;
  if (!jobId) jobId = getJobIdFromLocation(res?.headers);

  // 폴백 허용 시 프론트에서 증가형 생성
  if ((!jobId || (typeof jobId === "number" && !Number.isFinite(jobId))) && opts?.allowLocalFallback) {
    jobId = getNextJobId();
    console.warn("[jobsAPI] 서버에서 jobId 미반환 — 로컬 임시 jobId 사용:", jobId);
  }

  return { raw: res.data, jobId, registrantType, step };
}

/** 2) 사업자 인증(2차 저장) */
export async function verifyBusiness(payload: BusinessVerifyPayload) {
  return axiosInstance.post("/api/v1/jobs/business/verify", payload, {
    withCredentials: true,
    headers: buildHeaders(),
  });
}

/** 3) 개인 인증(2차 저장) */
export async function verifyPersonal(payload: PersonalVerifyPayload) {
  return axiosInstance.post("/api/v1/jobs/personal/verify", payload, {
    withCredentials: true,
    headers: buildHeaders(),
  });
}

export async function publishJob(jobId?: number | string) {
  if (jobId != null) {
    return axiosInstance.post(
      `/api/v1/jobs/${jobId}/publish`,
      {},
      {
        withCredentials: true,
        headers: buildHeaders(),
      }
    );
  }
  // 서버가 "현재 사용자 초안 게시" 엔드포인트를 제공하는 경우만 사용
  // return axiosInstance.post(`/api/v1/jobs/publish`, {}, { withCredentials: true, headers: buildHeaders() });
  throw new Error("publishJob: jobId가 필요합니다. (서버에서 jobId 없이 게시를 지원하지 않음)");
}
