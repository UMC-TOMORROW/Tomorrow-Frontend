import type { GetCareerTalksResponse } from "../types/careerTalk";
import { axiosInstance } from "./axios";

export const getCareerTalks = async (
  size: number,
  cursor?: number
): Promise<GetCareerTalksResponse> => {
  const params = { size, ...(cursor !== undefined && { cursor }) };

  const response = await axiosInstance.get<GetCareerTalksResponse>(
    "/api/v1/careertalks",
    {
      params,
    }
  );

  console.log("API 응답 데이터:", response.data);
  return response.data;
};
