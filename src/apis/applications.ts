// src/apis/applications.ts
import { axiosInstance } from "./axios";
import { ensureAuth, isHtmlResponse, pickResult, AuthRequiredError, redirectToLogin } from "./jobs";

export type PostApplicationBody = {
  content: string;
  postId: number; // ✅ 백엔드 요구: 바디에도 postId 포함
  resumeId?: number; // 첨부 시만
};

/** 지원 생성: POST /api/v1/posts/{postId}/applications */
export async function createApplication(postId: number, body: PostApplicationBody) {
  // 쿠키 세션 기준으로 로그인 확인(미인증이면 /auth로 보냄)
  await ensureAuth();

  // 서버가 종종 text/html(로그인 화면)로 돌려보내는 케이스 가드
  const res = await axiosInstance.post(`/api/v1/posts/${postId}/applications`, body, {
    withCredentials: true,
    headers: { Accept: "application/json" },
    // 여기서 3xx도 일단 받아서 아래에서 HTML 가드로 판별
    validateStatus: (s) => s >= 200 && s < 400,
  });

  if (isHtmlResponse(res?.data, res?.headers)) {
    // 세션 만료 등으로 로그인 화면이 온 경우
    redirectToLogin();
    throw new AuthRequiredError();
  }

  // 공통 유틸: data.result || data.data || data
  return pickResult<{ id?: number | string }>(res);
}
