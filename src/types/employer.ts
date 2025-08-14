export type MyPostStatus = "모집중" | "모집완료";

export interface MyPostItem {
  jobId: number;
  title: string;
  status: MyPostStatus;
  date: string;
  location: string;
  tags: string[];
}

export interface ApiEnvelope<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

export interface ApiEnvelopeNoResult {
  timestamp: string;
  code: string;
  message: string;
}