export type PaymentType = "DAILY" | "HOURLY" | "MONTHLY" | "PER_TASK";

export type WorkPeriod =
  | "SHORT_TERM"
  | "OVER_ONE_MONTH"
  | "OVER_THREE_MONTH"
  | "OVER_ONE_YEAR";

export interface Recommendation {
  id: number;
  companyName: string;
  title: string;
  location: string;
  workPeriod: WorkPeriod;
  isPeriodNegotiable: boolean;
  workStart?: string | null; 
  workEnd?: string | null;  
  isTimeNegotiable: boolean;
  salary: number;
  paymentType: PaymentType;
  reviewCount: number;
}

export interface GetRecommendationListResponse {
  recommendationList: Recommendation[];
  hasNext: boolean;
}
