// src/types/jobs.ts
export interface JobRequest {
  title: string;
  jobDescription: string;
  workPeriod:
    | "LESS_THAN_ONE_MONTH"
    | "ONE_TO_THREE_MONTHS"
    | "THREE_TO_SIX_MONTHS"
    | "SIX_TO_TWELVE_MONTHS"
    | "OVER_ONE_YEAR";
  isPeriodNegotiable: boolean;
  workStart: string; // "HH:mm"
  workEnd: string; // "HH:mm"
  isTimeNegotiable: boolean;
  paymentType: "HOURLY" | "DAILY" | "MONTHLY" | "CONTRACT";
  jobCategory: string;
  salary: number;
  companyName: string;
  isActive: boolean;
  recruitmentLimit?: number;
  deadline?: string; // ISO 8601
  preferredQualifications?: string;
  location: string;
  alwaysHiring: boolean;
  workDays: string[]; // ["mon", "tue" ...]
  workEnvironment?: string[]; // ["TUTORING", ...]
}
