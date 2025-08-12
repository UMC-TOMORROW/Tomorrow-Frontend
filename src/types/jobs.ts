// 타입: 생성/인증 + 상세조회 (스웨거 예시 기반)

export type RegistrantType = "BUSINESS" | "PERSONAL";

export type PaymentType = "HOURLY" | "DAILY" | "MONTHLY" | "PER_TASK";
export type WorkPeriod = "SHORT_TERM" | "OVER_ONE_MONTH" | "OVER_THREE_MONTH" | "OVER_ONE_YEAR";
export type JobCategory =
  | "SERVING"
  | "KITCHEN_ASSIST"
  | "CAFE_BAKERY"
  | "TUTORING"
  | "ERRAND"
  | "PROMOTION"
  | "ELDER_CARE"
  | "CHILD_CARE"
  | "BEAUTY"
  | "OFFICE_ASSIST"
  | "ETC";
export type WorkEnvKey =
  | "canWorkSitting"
  | "canWorkStanding"
  | "canMoveActively"
  | "canCarryObjects"
  | "canCommunicate";

export interface WorkDaysMap {
  isDayNegotiable: boolean;
  mon?: boolean;
  tue?: boolean;
  wed?: boolean;
  thu?: boolean;
  fri?: boolean;
  sat?: boolean;
  sun?: boolean;
}

/** 공통 래핑 응답 형태 */
export interface CommonResponse<T = any> {
  timestamp?: string;
  code?: string; // "COMMON200" 등
  message?: string;
  result?: T;
  data?: T;
}

/** 생성(초안) 요청 바디 */
export interface JobDraftPayload {
  title: string;
  jobDescription?: string;
  job_description?: string;
  recruitment_type: RegistrantType;
  work_period: WorkPeriod;
  work_days?: string[];
  work_start?: string;
  work_end?: string;
  salary: number;
  work_enviroment?: string[];
  payment_type: string;
  deadline?: string;
  job_image_url?: string;

  isTimeNegotiable?: boolean;
  isPeriodNegotiable?: boolean;
}

/** 생성 응답 result */
export interface JobCreateResult {
  jobId?: number | string | null;
  registrantType?: RegistrantType;
  step?: string; // "job_form_saved" 등
}

/** 사업자 인증 */
export interface BusinessVerifyPayload {
  job_id?: number | string;
  reg_no: string;
  corp_name: string;
  owner_name: string;
  open_date: string; // YYYY-MM-DD
}

/** 개인 인증 */
export interface PersonalVerifyPayload {
  job_id?: number | string;
  name: string;
  district: string;
  phone: string;
  request?: string;
}

/** 상세 조회 응답 본문(스웨거 예시 기반) */
export interface JobDetailApi {
  jobId?: number | string;
  title: string;
  jobDescription?: string;
  workPeriod?: WorkPeriod;
  isPeriodNegotiable?: boolean;
  workStart?: string; // "17:00:00"
  workEnd?: string; // "22:00:00"
  isTimeNegotiable?: boolean;
  paymentType?: PaymentType;
  jobCategory?: JobCategory | string;
  salary?: number;
  jobImageUrl?: string | null;
  companyName?: string;
  isActive?: boolean;
  recruitmentLimit?: number;
  deadline?: string; // ISO
  preferredQualifications?: string;
  location?: string;
  address?: string;
  alwaysHiring?: boolean;
  workDays?: WorkDaysMap;
  workEnvironment?: WorkEnvKey[];
  reviewCount?: number;
  registrantType?: RegistrantType;
}
