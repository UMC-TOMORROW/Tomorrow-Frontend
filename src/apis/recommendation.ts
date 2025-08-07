import { axiosInstance } from "./axios";
import type { GetRecommendationListResponse } from "../types/recommendation";

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
  }>("/api/v1/jobs/recommendations", { params });

  return response.data.result;
};
