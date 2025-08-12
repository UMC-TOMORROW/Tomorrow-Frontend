import { axiosInstance } from "../apis/axios";
import type {
  JobDraftPayload,
  CommonResponse,
  JobCreateResult,
  BusinessVerifyPayload,
  PersonalVerifyPayload,
  RegistrantType,
  JobDetailApi,
} from "../types/jobs";

// 공통: result/data 래핑 해제 (제네릭)
export function pickResult<T = any>(res: any): T {
  if (res?.data?.result !== undefined) return res.data.result as T;
  if (res?.data?.data !== undefined) return res.data.data as T;
  return res?.data as T;
}

export const getJobIdFromLocation = (headers: any): number | string | null => {
  const loc = headers?.location || headers?.Location;
  if (!loc || typeof loc !== "string") return null;
  const last = loc.split("/").filter(Boolean).pop();
  if (!last) return null;
  return /^\d+$/.test(last) ? Number(last) : last;
};

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

// 1) 초안 생성
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

  const parsed = pickResult<JobCreateResult>(res);
  const step = parsed?.step ?? (res?.data?.result as any)?.step;
  const registrantType = (parsed?.registrantType ?? (res?.data?.result as any)?.registrantType) as
    | RegistrantType
    | undefined;

  let jobId: any = parsed?.jobId ?? (res?.data?.result as any)?.jobId ?? null;
  if (!jobId) jobId = getJobIdFromLocation(res?.headers);

  if ((!jobId || (typeof jobId === "number" && !Number.isFinite(jobId))) && opts?.allowLocalFallback) {
    jobId = getNextJobId();
    console.warn("[jobsAPI] 서버에서 jobId 미반환 — 로컬 임시 jobId 사용:", jobId);
  }

  return { raw: res.data, jobId, registrantType, step };
}

// 2) 상세 조회 (쿠키 인증 사용)
export async function getJobDetail(jobId: string | number): Promise<JobDetailApi> {
  const res = await axiosInstance.get(`/api/v1/jobs/${jobId}`, {
    withCredentials: true,
  });
  return pickResult<JobDetailApi>(res);
}

// 3) 2차 저장
export async function verifyBusiness(payload: BusinessVerifyPayload) {
  return axiosInstance.post("/api/v1/jobs/business/verify", payload, {
    withCredentials: true,
    headers: buildHeaders(),
  });
}

export async function verifyPersonal(payload: PersonalVerifyPayload) {
  return axiosInstance.post("/api/v1/jobs/personal/verify", payload, {
    withCredentials: true,
    headers: buildHeaders(),
  });
}

// 4) 게시
export async function publishJob(jobId?: number | string) {
  if (jobId != null) {
    return axiosInstance.post(`/api/v1/jobs/${jobId}/publish`, {}, { withCredentials: true, headers: buildHeaders() });
  }
  throw new Error("publishJob: jobId가 필요합니다.");
}
