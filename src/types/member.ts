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
  provider: string;
  providerUseId: string;
  createdAt: string;
  updatedAt: string;
  resumeId: number;
}
