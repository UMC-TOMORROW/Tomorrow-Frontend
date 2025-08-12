export type RegistrantType = "BUSINESS" | "PERSONAL";

export interface JobDraftPayload {
  title: string;
  jobDescription?: string;
  job_description?: string;
  recruitment_type: RegistrantType; // "PERSONAL" | "BUSINESS"
  work_period: "SHORT_TERM" | "OVER_ONE_MONTH" | "OVER_THREE_MONTH" | "OVER_ONE_YEAR";
  work_days?: string[]; // ["월","수"...] 협의면 빈 배열도 허용
  work_start?: string; // "HH:mm" or ""
  work_end?: string; // "HH:mm" or ""
  salary: number;
  work_enviroment?: string[]; // ["can_work_standing", ...]
  payment_type: string; // "시급"/"일급"/"월급"/"건별"
  deadline?: string; // "YYYY-MM-DDTHH:mm:ss" or "" (없으면 빈 문자열)
  job_image_url?: string; // 파일 업로드 후 URL 사용

  isTimeNegotiable?: boolean;
  isPeriodNegotiable?: boolean;
}

/** 공통 래핑 응답 형태 */
export interface CommonResponse<T = any> {
  timestamp?: string;
  code?: string; // "COMMON200" 등
  message?: string;
  result?: T;
  data?: T;
}

/** 1차 저장 응답 result */
export interface JobCreateResult {
  jobId?: number | string | null;
  registrantType?: RegistrantType;
  step?: string; // "job_form_saved" 등
}

/** 사업자 인증 */
export interface BusinessVerifyPayload {
  job_id?: number | string; // 서버가 필요 시 사용
  reg_no: string; // 사업자등록번호
  corp_name: string; // 상호
  owner_name: string; // 대표자
  open_date: string; // YYYY-MM-DD
}

/** 개인 인증 */
export interface PersonalVerifyPayload {
  job_id?: number | string; // 서버가 필요 시 사용
  name: string;
  district: string;
  phone: string;
  request?: string;
}
