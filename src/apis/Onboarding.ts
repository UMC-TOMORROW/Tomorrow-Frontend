import type {
  PostPreferenceRequest,
  PostPreferenceResponse,
  MemberType,
} from "../types/Onboarding";
import { axiosInstance } from "./axios";

export const postPreferences = async (
  postData: PostPreferenceRequest
): Promise<boolean> => {
  const { data } = await axiosInstance.post<PostPreferenceResponse>(
    "/api/v1/preferences",
    postData,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
      transformRequest: [(d) => JSON.stringify(d)],
    }
  );
  return data.result.saved === true;
};

export const patchMemberType = async (body: MemberType): Promise<void> => {
  await axiosInstance.patch("/api/v1/members/member-type", body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
  });
};
