export interface Job {
  jobId: number;
  company_name: string;
  title: string;
  job_category: string[];
  isPeriodNegotiable: boolean;
  review_count: number;
  location: string;
  salary: number;
  work_days?: string[];
  work_start?: string;
  work_end?: string;
}

export interface GetJobsResponse {
  timestamp: string;
  code: string;
  message: string;
  result: Job[];
}
