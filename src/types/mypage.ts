export interface applyStatus {
  postTitle: string;
  company: string;
  date: string;
  status: string;
}

export type ApplicationFilter = "all" | "pass";

export interface ApiResponse<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}
