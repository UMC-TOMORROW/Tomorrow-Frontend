import type { WorkedPeriod } from "./career";

export type SaveResumeResponse = {
  timestamp: string;
  code: string;
  message: string;
  result: number;
};

export type SaveResumeRequest = {
  introduction: string;
  careers: {
    company: string;
    description: string;
    workedYear: number;
    workedPeriod: WorkedPeriod;
  }[];
  certificates: {
    fileUrl: string;
    filename: string;
  }[];
};
