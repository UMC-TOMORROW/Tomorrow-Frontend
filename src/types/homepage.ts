export interface Job {
  jobId: number;
  title: string;
  company_name: string;
  location: string;
  salary: number;
  review_count: number;
  job_image_url: string;
  payment_type: "DAILY" | "MONTHLY";
  isTimeNegotiable: boolean;
  isPeriodNegotiable: boolean;
  job_category: string[];
}

export interface GetJobsResponse {
  timestamp: string;
  code: string;
  message: string;
  result: Job[];
}
