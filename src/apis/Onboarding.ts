import type { PostPreferenceResponse } from "../types/Onboarding";
import { axiosInstance } from "./axios";

export const postPreferences = async (postData: {
  preferenceList: string[];
}): Promise<PostPreferenceResponse> => {
  const response = await axiosInstance.post<PostPreferenceResponse>(
    "/api/v1/preferences",
    postData
  );
  return response.data;
};
