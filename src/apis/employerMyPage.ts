import { axiosInstance } from "./axios";
import type { GetUserTypeResponse, MemberType, MyInfo } from "../types/member";
import type {
  ApiEnvelope,
  ApiEnvelopeNoResult,
  MyPostItem,
  MyPostStatus,
} from "../types/employer";
import type {
  Applicant,
  ApplicantResume,
  ApplicantResumeRaw,
  ApplicationDecisionCode,
  UpdateApplicationStatusResult,
} from "../types/applicant";
import { parseApplicantContent } from "../utils/parseApplicantContent";

// 내 정보
export const getMyInfo = async (): Promise<MyInfo> => {
  const response = await axiosInstance.get<MyInfo>("/api/v1/members/me");
  return response.data;
};

// 내 '모집중' 공고 조회
export const getMyOpenPosts = async (): Promise<MyPostItem[]> => {
  const res = await axiosInstance.get<ApiEnvelope<MyPostItem[]>>(
    "/api/v1/my-posts/open"
  );
  return res.data.result;
};

// 내 '모집완료' 공고 조회
export const getMyClosedPosts = async (): Promise<MyPostItem[]> => {
  const res = await axiosInstance.get<ApiEnvelope<MyPostItem[]>>(
    "/api/v1/my-posts/closed"
  );
  return res.data.result;
};

// 모집글 상태 변경 (모집중/모집완료)
export const updateMyPostStatus = async (
  jobId: number,
  status: MyPostStatus
): Promise<void> => {
  await axiosInstance.patch<ApiEnvelopeNoResult>(
    `/api/v1/jobs/${jobId}/status`,
    { status }
  );
};

// 지원자 목록 조회 (변경된 엔드포인트/스키마 반영)
// status: "open" | "closed" 생략 시 전체
export const getApplicantsByPostId = async (
  jobId: number,
  status?: "open" | "closed" | string
): Promise<Applicant[]> => {
  const res = await axiosInstance.get<ApiEnvelope<Applicant[]>>(
    `/api/v1/jobs/${jobId}/applications`,
    { params: status ? { status } : {} }
  );
  return res.data.result;
};

// 개별 지원자 이력서 조회 (변경된 엔드포인트: applicationId 사용)
export const getApplicantResume = async (
  jobId: number,
  applicationId: number
): Promise<ApplicantResume> => {
  const res = await axiosInstance.get<ApiEnvelope<ApplicantResumeRaw>>(
    `/api/v1/jobs/${jobId}/applications/${applicationId}/resume`
  );

  const raw = res.data.result;
  const parsedContent = parseApplicantContent(raw.content ?? null);

  return { ...raw, parsedContent };
};

// 내 역할(EMPLOYER | JOB_SEEKER) 조회
export const getMyMemberType = async (): Promise<MemberType> => {
  const res = await axiosInstance.get<ApiEnvelope<GetUserTypeResponse>>(
    "/api/v1/members/member-type"
  );
  return res.data.result.memberType;
};

export const updateApplicationStatus = async (
  jobId: number,
  applicationId: number,
  status: ApplicationDecisionCode
): Promise<UpdateApplicationStatusResult> => {
  if (!Number.isFinite(jobId) || !Number.isFinite(applicationId)) {
    console.error("[API] updateApplicationStatus: invalid ids =", {
      jobId,
      applicationId,
    });
    throw new Error("Invalid id(s)");
  }

  const res = await axiosInstance.patch<
    ApiEnvelope<UpdateApplicationStatusResult>
  >(`/api/v1/jobs/${jobId}/applications/${applicationId}/status`, { status });
  return res.data.result;
};

// 프로필 이미지 수정
export const updateProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post<ApiEnvelope<string>>(
    "/api/files/profile/update",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.result;
};
