// 공통 응답 포맷
export type ApiResponse<T> = {
  timestamp: string;
  code: string;
  message: string;
  result: T;
};

// 온보딩 선호 저장 - 요청/응답
export type PostPreferenceRequest = {
  preferences: string[];
};

export type PostPreferenceResult = {
  userId: number;
};

export type PostPreferenceResponse = ApiResponse<PostPreferenceResult>;

// (선택) 회원 유형
export interface MemberType {
  memberType: string;
}
