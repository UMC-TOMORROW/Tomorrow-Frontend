import type {
  PostPreferenceRequest,
  PostPreferenceResponse,
  MemberType,
} from "../types/Onboarding";
import { axiosInstance } from "./axios";

/* 온보딩 선호 저장 */
export const postPreferences = async (
  postData: PostPreferenceRequest
): Promise<PostPreferenceResponse> => {
  const { data } = await axiosInstance.post<PostPreferenceResponse>(
    "/api/v1/preferences",
    postData,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return data;
};

/* 회원 유형 변경 */
export const patchMemberType = async (body: MemberType): Promise<void> => {
  await axiosInstance.patch("/api/v1/members/member-type", body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};
