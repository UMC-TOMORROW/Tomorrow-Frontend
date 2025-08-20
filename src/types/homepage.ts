export type PaymentType = "HOURLY" | "DAILY" | "MONTHLY" | "PER_TASK";

export interface JobsView {
  jobId: number;
  title: string;
  companyName: string;
  location: string;
  salary: number;

  review_count?: number;

  jobImageUrl: string | null;
  paymentType: PaymentType;

  isTimeNegotiable?: boolean;
  isPeriodNegotiable?: boolean;

  workDays?:
    | string
    | string[]
    | {
        mon?: boolean;
        tue?: boolean;
        wed?: boolean;
        thu?: boolean;
        fri?: boolean;
        sat?: boolean;
        sun?: boolean;
        isDayNegotiable?: boolean;
      };

  workEnvironment?: string | string[];

  workPeriod: string;
  workStart?: string | null;
  workEnd?: string | null;
  job_category?: string[];
}
