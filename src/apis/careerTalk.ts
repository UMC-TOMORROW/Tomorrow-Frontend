import type { GetCareerTalkDetailResponse, GetCareerTalksResponse, PostCareerTalkRequest, PostCareerTalkResponse } from "../types/careerTalk";
import { axiosInstance } from "./axios";

// 커리어톡 리스트 조회
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

  return response.data;
};

// 커리어톡 게시글 상세 조회
export const getCareerTalkDetail = async (
  id: number
): Promise<GetCareerTalkDetailResponse> => {
  const response = await axiosInstance.get<GetCareerTalkDetailResponse>(
    `/api/v1/careertalks/${id}`
  );
  return response.data;
};

// 커리어톡 게시글 작성
export const postCareerTalk = async (
  postData: PostCareerTalkRequest
): Promise<PostCareerTalkResponse> => {
  const response = await axiosInstance.post<PostCareerTalkResponse>(
    "/api/v1/careertalks",
    postData
  );
  return response.data;
};