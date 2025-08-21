export interface applyStatus {
  postTitle: string;
  jobId: number;
  company: string;
  date: string;
  jobImageUrl: string | null;
  jobWorkEnvironment: Record<string, boolean>;
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
  jobId: number;
  title: string;
  company: string;
  location: string;
  wage: string;
  tags: string[];
  rating: number;
  isWished: boolean;
}

export type BookmarkItem = {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  bookmarkedAt: string;
};

export type BookmarksPayload = {
  bookmarks: BookmarkItem[];
  hasNext: boolean;
  lastCursor: number | null;
};

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

export type Gender = "MALE" | "FEMALE" | null;

export interface Member {
  id: number;
  role: string | null;
  username: string | null;
  email: string | null;
  name: string | null;
  gender: Gender;
  phoneNumber: string | null;
  address: string | null;
  status: string | null;
  inactiveAt: string | null;
  isOnboarded: boolean | null;
  provider: string | null;
  providerUserId: string | null;
  createdAt: string;
  updatedAt: string;
  resumeId: number | null;
}

export type MemberUpdate = Partial<
  Pick<Member, "email" | "name" | "gender" | "phoneNumber" | "address">
>;
