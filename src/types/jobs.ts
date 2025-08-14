// src/types/jobs.ts
// 타입: 생성/인증 + 상세조회 (백엔드 스키마/요청 포맷 반영)

export type RegistrantType = "BUSINESS" | "PERSONAL";

export type PaymentType = "HOURLY" | "DAILY" | "MONTHLY" | "PER_TASK";

export type WorkPeriod = "SHORT_TERM" | "OVER_ONE_MONTH" | "OVER_THREE_MONTH" | "OVER_SIX_MONTH" | "OVER_ONE_YEAR";

export type JobCategory =
  | "SERVING"
  | "KITCHEN_HELP"
  | "CAFE_BAKERY"
  | "TUTORING"
  | "ERRAND"
  | "PROMOTION"
  | "ELDER_CARE"
  | "SENIOR_CARE"
  | "CHILD_CARE"
  | "BEAUTY"
  | "OFFICE_ASSIST"
  | "ETC";

export type WorkEnvironmentSnake =
  | "can_work_sitting"
  | "can_work_standing"
  | "can_carry_objects"
  | "can_move_actively"
  | "can_communicate";

// 응답에서 사용할 환경 객체 형태
export interface WorkEnvironmentObj {
  canWorkSitting: boolean;
  canWorkStanding: boolean;
  canCarryObjects: boolean;
  canMoveActively: boolean;
  canCommunicate: boolean;
}

// 요일 코드
export type WeekdayCode = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

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

/** 생성(초안) 요청 바디 – 프론트에서 서버로 보낼 원본(스네이크+카멜 혼재 허용) */
export interface JobDraftPayload {
  // 기본
  title: string;
  jobDescription?: string; // (과거 호환)
  job_description?: string;

  // 등록 주체 / 카테고리 / 급여
  recruitment_type: RegistrantType; // "PERSONAL" | "BUSINESS"
  job_category: JobCategory;
  payment_type: PaymentType;
  salary: number;

  // 기간/요일/시간
  work_period: WorkPeriod;
  is_period_negotiable?: boolean;

  work_days?: WeekdayCode[];
  is_day_negotiable?: boolean;

  work_start?: string; // "HH:mm"
  work_end?: string; // "HH:mm"
  is_time_negotiable?: boolean;

  // 마감/상시
  always_hiring?: boolean;
  deadline?: string; // ISO

  // 회사/활성/좌표
  company_name?: string;
  is_active?: boolean;
  latitude?: number;
  longitude?: number;

  // 환경/이미지/기타
  work_environment?: WorkEnvironmentSnake[];
  job_image_url?: string;
  recruitment_limit?: number;
  preferred_qualifications?: string;

  // (카멜 호환 키들)
  isSalaryNegotiable?: boolean;
  isTimeNegotiable?: boolean;
  isPeriodNegotiable?: boolean;
}

/** 생성 응답 result */
export interface JobCreateResult {
  jobId?: number | string | null;
  registrantType?: RegistrantType;
  step?: string; // "job_form_saved" 등
}

/** 사업자 인증 요청 바디 (두 포맷 모두 허용) */
export interface BusinessVerifyPayload {
  // 최신 스웨거 포맷
  bizNumber?: string;
  companyName?: string;
  ownerName?: string;
  openingDate?: string; // YYYY-MM-DD

  // 과거 포맷 호환
  reg_no?: string;
  corp_name?: string;
  owner_name?: string;
  open_date?: string; // YYYY-MM-DD
}

/** 개인 인증 */
export interface PersonalVerifyPayload {
  job_id?: number | string;
  name: string;
  district: string;
  phone: string;
  request?: string;
}

/** 상세 조회 응답 본문 */
export interface JobDetailApi {
  jobId?: number | string;

  title: string;
  jobDescription?: string;

  workPeriod?: WorkPeriod;
  isPeriodNegotiable?: boolean;

  workStart?: string; // "HH:mm:ss" 또는 "HH:mm"
  workEnd?: string; // "HH:mm:ss" 또는 "HH:mm"
  isTimeNegotiable?: boolean;

  paymentType?: PaymentType;
  jobCategory?: JobCategory | string; // 백엔드 값 확정 전 string 허용
  salary?: number;
  isSalaryNegotiable?: boolean;

  jobImageUrl?: string | null;

  companyName?: string;
  isActive?: boolean;
  recruitmentLimit?: number;

  deadline?: string; // ISO
  preferredQualifications?: string;

  location?: string; // 선택
  address?: string; // 선택

  latitude?: number;
  longitude?: number;

  alwaysHiring?: boolean;

  workDays?: WorkDaysMap;
  workEnvironment?: WorkEnvironmentObj;

  reviewCount?: number;
  registrantType?: RegistrantType;
}
