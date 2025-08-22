import { axiosInstance } from "./axios";
import type { GetRecommendationListResponse } from "../types/recommendation";
import type { GetPreferencesResponse, UpdatePreferencesRequest, UpdatePreferencesResponse, WorkPreferenceType } from "../types/workPreference";

export const getRecommendations = async (
  size = 8,
  cursor?: number
): Promise<GetRecommendationListResponse> => {
  const params = {
    size,
    ...(cursor !== undefined && { cursor }),
  };

  const response = await axiosInstance.get<{
    code: string;
    message: string;
    result: GetRecommendationListResponse;
  }>("/api/v1/recommendations", { params });

  return response.data.result;
};

export const patchPreferences = async (
  preferences: WorkPreferenceType[]
): Promise<boolean> => {
  const requestBody: UpdatePreferencesRequest = {
    preferences,
  };

  const response = await axiosInstance.patch<UpdatePreferencesResponse>(
    "/api/v1/preferences",
    requestBody
  );

  return response.data.result.saved;
};

// 희망 조건 조회
export const getPreferences = async (): Promise<WorkPreferenceType[]> => {
  const res = await axiosInstance.get<GetPreferencesResponse>("/api/v1/preferences");
  return res.data.result?.preferences ?? [];
};