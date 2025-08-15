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

export type BookmarksPayload = {
  bookmarks: savedJobs[];
  hasNext: boolean;
  lastCursor: string | null;
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
