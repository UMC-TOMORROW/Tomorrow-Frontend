import type {
  PostPreferenceRequest,
  PostPreferenceResponse,
} from "../types/Onboarding";
import { axiosInstance } from "./axios";

export const postPreferences = async (
  postData: PostPreferenceRequest
): Promise<PostPreferenceResponse> => {
  const response = await axiosInstance.post<PostPreferenceResponse>(
    "/api/v1/preferences",
    postData
  );

  return response.data;
};
