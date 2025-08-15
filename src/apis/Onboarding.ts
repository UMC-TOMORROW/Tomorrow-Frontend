import type {
  PostPreferenceRequest,
  PostPreferenceResponse,
  MemberType,
} from "../types/Onboarding";
import { axiosInstance } from "./axios";

export const postPreferences = async (
  postData: PostPreferenceRequest
): Promise<boolean> => {
  console.log("[postPreferences] payload =", JSON.stringify(postData));

  const { data, status } = await axiosInstance.post<PostPreferenceResponse>(
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

  console.log("[postPreferences] status =", status);
  console.log("[postPreferences] response.data =", JSON.stringify(data));

  return data.result.saved === true;
};

export const patchMemberType = async (body: MemberType): Promise<void> => {
  console.log("[patchMemberType] payload =", JSON.stringify(body));
  const { status } = await axiosInstance.patch(
    "/api/v1/members/member-type",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    }
  );
  console.log("[patchMemberType] status =", status);
};
