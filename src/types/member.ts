export type SocialProvider = "NAVER" | "GOOGLE" | "KAKAO";

export interface MemberMe {
  id: number;
  role: string;
  username: string;
  email: string;
  name: string;
  gender: "MALE" | "FEMALE";
  phoneNumber: string;
  address: string;
  status: string;
  inactiveAt: string;
  inOnboarded: boolean;
  provider?: SocialProvider | string;
  providerUserId: string;
  createdAt: string;
  updatedAt: string;
  resumeId: number;
}
export type MemberType = "EMPLOYER" | "JOB_SEEKER";

export interface GetUserTypeResponse {
  memberType: MemberType;
}

export interface MyInfo {
  id: number;
  role: string | null;
  username: string | null;
  email: string | null;
  name: string | null;
  gender: string | null;
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
