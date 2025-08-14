export type WorkedPeriod =
  | "SHORT_TERM"
  | "LESS_THAN_3_MONTHS"
  | "LESS_THAN_6_MONTHS"
  | "SIX_TO_TWELVE_MONTHS"
  | "ONE_TO_TWO_YEARS"
  | "TWO_TO_THREE_YEARS"
  | "MORE_THAN_THREE_YEARS";

export type CareerPayload = {
  company: string;
  description: string;
  workedYear: number;
  workedPeriod: WorkedPeriod;
};

export type CareerDetail = {
  careerId: number;
  company: string;
  description: string;
  workedYear: number;
  workedPeriod: WorkedPeriod;
};
