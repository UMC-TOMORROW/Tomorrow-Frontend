export type PostPreferenceRequest = {
  preferences: string[];
};

export type PostPreferenceResponse = {
  timestamp: string;
  code: string;
  message: string;
  result: Record<string, unknown>;
};
