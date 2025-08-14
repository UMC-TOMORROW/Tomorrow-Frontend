export type WorkPreferenceType =
  | "SIT" // 앉아서 근무 중심
  | "STAND" // 서서 근무 중심
  | "LIGHT_DELIVERY" // 가벼운 물건 운반
  | "HEAVY_DELIVERY" // 무거운 물건 운반
  | "PHYSICAL" // 신체 활동 중심
  | "HUMAN"; // 사람 응대 중심

export interface UpdatePreferencesRequest {
  preferences: WorkPreferenceType[];
}

export interface UpdatePreferencesResponse {
  timestamp: string;
  code: string;
  message: string;
  result: {
    saved: boolean;
  };
}
