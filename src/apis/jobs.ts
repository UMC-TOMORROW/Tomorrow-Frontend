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

/* ───────── 공통 유틸/가드 ───────── */

export class AuthRequiredError extends Error {
  constructor(msg = "로그인이 필요합니다.") {
    super(msg);
    this.name = "AuthRequiredError";
  }
}

export const redirectToLogin = () => {
  const next = window.location.pathname + window.location.search;
  if (!window.location.pathname.startsWith("/auth")) {
    window.location.assign(`/auth?next=${encodeURIComponent(next)}`);
  }
};

export const isHtmlResponse = (data: any, headers?: any) => {
  const ct = String(headers?.["content-type"] || headers?.["Content-Type"] || "");
  return ct.includes("text/html") || (typeof data === "string" && /<html[\s>]/i.test(data));
};

export const ensureAuth = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/members/me", { withCredentials: true });
    if (isHtmlResponse(res.data, res.headers)) throw new AuthRequiredError();
  } catch (e: any) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    if (status === 401 || status === 403 || isHtmlResponse(data, e?.response?.headers)) {
      redirectToLogin();
      throw new AuthRequiredError();
    }
    throw e;
  }
};

const guardHtml = (res: any) => {
  if (isHtmlResponse(res?.data, res?.headers)) {
    const err: any = new AuthRequiredError();
    err.response = { status: 401, data: { message: "로그인이 필요합니다." } };
    throw err;
  }
};

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

/* ───────── 변환 유틸 ───────── */

// "HH:mm[:ss]" → "HH:mm"
const toHm = (t?: string) => {
  if (!t) return undefined;
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  const m = t.match(/^(\d{2}:\d{2})/);
  return m ? m[1] : t;
};

type EnvSnake =
  | "can_work_sitting"
  | "can_work_standing"
  | "can_carry_objects"
  | "can_move_actively"
  | "can_communicate";

const buildWorkDaysObj = (days: string[] = [], isDayNegotiable?: boolean) => {
  const d = new Set<string>(days.map((x) => x?.slice(0, 3).toLowerCase()));
  return {
    isDayNegotiable: !!isDayNegotiable,
    mon: d.has("mon"),
    tue: d.has("tue"),
    wed: d.has("wed"),
    thu: d.has("thu"),
    fri: d.has("fri"),
    sat: d.has("sat"),
    sun: d.has("sun"),
  };
};

const buildWorkEnvironmentObj = (snake: EnvSnake[] = []) => {
  const s = new Set<EnvSnake>(snake);
  return {
    canWorkSitting: s.has("can_work_sitting"),
    canWorkStanding: s.has("can_work_standing"),
    canCarryObjects: s.has("can_carry_objects"),
    canMoveActively: s.has("can_move_actively"),
    canCommunicate: s.has("can_communicate"),
  };
};

/**
 * 프론트 body(스네이크/카멜 혼재) → 서버가 기대하는 jobRequest(JSON)으로 변환
 * - lat/lng 없으면 임시 좌표 자동 세팅 (서울시청 근처)
 * - 시간 협의 가능일 때 workStart/workEnd는 필드 자체 생략
 */
function toJobRequest(b: any) {
  const workDaysArr: string[] = b.work_days ?? b.workDays ?? [];
  const workEnvSnake: EnvSnake[] = (b.work_environment ?? b.work_enviroment ?? []) as EnvSnake[];

  const fallbackLat = 37.5665;
  const fallbackLng = 126.978;

  const alwaysHiring = !!(b.always_hiring ?? b.alwaysHiring);
  const timeNegotiable = !!(b.is_time_negotiable ?? b.isTimeNegotiable ?? b.timeNegotiable);

  const start = timeNegotiable ? undefined : toHm(b.work_start ?? b.workStart);
  const end = timeNegotiable ? undefined : toHm(b.work_end ?? b.workEnd);

  const req: any = {
    title: b.title,

    workPeriod: b.work_period ?? b.workPeriod,
    isPeriodNegotiable: !!(b.is_period_negotiable ?? b.isPeriodNegotiable ?? b.periodNegotiable),

    isTimeNegotiable: timeNegotiable,
    paymentType: b.payment_type ?? b.paymentType,
    jobCategory: b.job_category ?? b.jobCategory,
    salary: Number(b.salary),
    isSalaryNegotiable: !!(b.is_salary_negotiable ?? b.isSalaryNegotiable ?? b.salaryNegotiable),

    jobDescription: b.job_description ?? b.jobDescription,
    companyName: b.company_name ?? b.companyName,
    isActive: !!(b.is_active ?? b.isActive ?? true),
    recruitmentLimit: b.recruitment_limit ?? b.recruitmentLimit,

    registrantType: b.recruitment_type ?? b.registrantType,

    location: (b.location ?? b.address ?? "서울특별시").trim(),
    latitude: b.latitude != null && b.latitude !== "" ? Number(b.latitude) : fallbackLat,
    longitude: b.longitude != null && b.longitude !== "" ? Number(b.longitude) : fallbackLng,

    alwaysHiring,
    ...(alwaysHiring ? {} : b.deadline ? { deadline: b.deadline } : {}),

    ...(b.job_image_url || b.jobImageUrl ? { jobImageUrl: b.job_image_url ?? b.jobImageUrl } : {}),
    ...(b.preferred_qualifications || b.preferredQualifications
      ? { preferredQualifications: b.preferred_qualifications ?? b.preferredQualifications }
      : {}),

    workDays: buildWorkDaysObj(workDaysArr, b.is_day_negotiable ?? b.isDayNegotiable ?? b.dayNegotiable),
    workEnvironment: buildWorkEnvironmentObj(workEnvSnake),
  };

  if (start) req.workStart = start;
  if (end) req.workEnd = end;

  // 디버그
  console.log("[jobsAPI] jobRequest to send (final):", req);
  return req;
}

/* ───────── API ───────── */

/**
 * 초안 생성
 * - multipart/form-data
 * - part "jobRequest": 문자열(JSON)  ← Blob(application/json) 말고 문자열로!
 * - part "image": 파일(선택)
 * - 헤더에 "Content-Type: multipart/form-data" 명시(팀 요구)
 */
export async function createJobDraft(
  body: JobDraftPayload,
  file?: File
): Promise<{
  raw: CommonResponse<JobCreateResult> | any;
  jobId: number | string | null;
  registrantType: RegistrantType | undefined;
  step: string | undefined;
}> {
  await ensureAuth();

  const jobRequest = toJobRequest(body);

  // 조건부 필수 가드
  if (!jobRequest.alwaysHiring && !jobRequest.deadline) {
    throw new Error("마감일(deadline)이 필요합니다.");
  }

  const fd = new FormData();
  // ✅ 문자열로 추가 (Swagger와 동일한 형태)
  fd.append("jobRequest", JSON.stringify(jobRequest));
  if (file) fd.append("image", file);

  const res = await axiosInstance.post("/api/v1/jobs", fd, {
    withCredentials: true,
    headers: {
      // "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  guardHtml(res);

  const parsed = pickResult<JobCreateResult>(res);
  const step = parsed?.step ?? (res?.data?.result as any)?.step;
  const registrantType = (parsed?.registrantType ?? (res?.data?.result as any)?.registrantType) as
    | RegistrantType
    | undefined;

  let jobId: any = parsed?.jobId ?? (res?.data?.result as any)?.jobId ?? null;
  if (!jobId) jobId = getJobIdFromLocation(res?.headers) ?? null;
  console.log("[jobsAPI] jobRequest string:", JSON.stringify(jobRequest));

  return { raw: res.data, jobId, registrantType, step };
}

/** 상세 조회 */
export async function getJobDetail(jobId: string | number): Promise<JobDetailApi> {
  const res = await axiosInstance.get(`/api/v1/jobs/${jobId}`, {
    withCredentials: true,
  });
  return pickResult<JobDetailApi>(res);
}

/** 사업자 2차 저장 */
export async function verifyBusiness(payload: BusinessVerifyPayload): Promise<{
  raw: any;
  jobId: number | string;
  step?: string;
}> {
  await ensureAuth();
  const res = await axiosInstance.post("/api/v1/jobs/business-verifications/register", payload, {
    withCredentials: true,
    headers: { Accept: "application/json" },
  });
  guardHtml(res);

  const parsed = pickResult<any>(res);
  let jobId: any = parsed?.jobId ?? (res?.data?.result as any)?.jobId ?? null;
  if (!jobId) jobId = getJobIdFromLocation(res?.headers);
  if (!jobId) throw new Error("verifyBusiness: 서버가 jobId를 반환하지 않았습니다.");
  return { raw: res.data, jobId, step: parsed?.step };
}

/** 개인 2차 저장 */
export async function verifyPersonal(payload: PersonalVerifyPayload): Promise<{
  raw: any;
  jobId: number | string;
  step?: string;
}> {
  await ensureAuth();
  const res = await axiosInstance.post("/api/v1/jobs/personal_registrations", payload, {
    withCredentials: true,
    headers: { Accept: "application/json" },
  });
  guardHtml(res);

  const parsed = pickResult<any>(res);
  let jobId: any = parsed?.jobId ?? (res?.data?.result as any)?.jobId ?? null;
  if (!jobId) jobId = getJobIdFromLocation(res?.headers);
  if (!jobId) throw new Error("verifyPersonal: 서버가 jobId를 반환하지 않았습니다.");
  return { raw: res.data, jobId, step: parsed?.step };
}

/** 게시 */
export async function publishJob(jobId?: number | string) {
  if (jobId == null) throw new Error("publishJob: jobId가 필요합니다.");

  await ensureAuth();
  const res = await axiosInstance.post(
    `/api/v1/jobs/${jobId}/publish`,
    {},
    { withCredentials: true, headers: { Accept: "application/json" } }
  );
  guardHtml(res);
  return res;
}
