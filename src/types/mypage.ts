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

export interface savedJobs {
  postId: number;
  title: string;
  company: string;
  location: string;
  wage: string;
  tags: string[];
  rating: number;
  isWished: boolean;
}

export interface deleteMember {
  status: string;
  deletedAt: string;
  recoverableUntil: string;
}

export interface reviews {
  postId: number;
  stars: number;
  review: string;
}
