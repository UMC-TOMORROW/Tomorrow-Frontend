export interface JobsView {
  jobId: number;
  title: string;
  company_name: string;
  location: string;
  salary: number;
  review_count: number;
  job_image_url: string;
  payment_type: string;
  isTimeNegotiable: boolean;
  isPeriodNegotiable: boolean;
  work_environment: string[];

  work_start?: string;
  work_end?: string;
  work_days?: string[];
  job_category?: string[];
}
