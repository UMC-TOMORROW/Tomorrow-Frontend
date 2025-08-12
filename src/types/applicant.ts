export type ApplicantStatus = string;

export interface Applicant {
  applicantId: number;
  userName: string;
  applicationDate: string;
  status: ApplicantStatus;
  resumeTitle: string;
}

export interface ApiEnvelope<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}