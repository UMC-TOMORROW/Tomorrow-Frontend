import { axiosInstance } from "./axios";
import type { GetRecommendationListResponse } from "../types/recommendation";
import type { UpdatePreferencesRequest, UpdatePreferencesResponse, WorkPreferenceType } from "../types/workPreference";

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
