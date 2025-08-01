export interface PostPreferenceRequest {
  preferences: string[];
}

export interface PostPreferenceResponse {
  timestamp: string;
  code: string;
  message: string;
  result: Record<string, never>;
}
