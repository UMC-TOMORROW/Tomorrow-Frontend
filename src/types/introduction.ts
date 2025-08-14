export interface BaseResponse<T> {
  timestamp: string;
  code: string;
  message: string;
  result: T;
}

export interface Introduction {
  content: string;
}

export type GetIntroductionResponse = BaseResponse<Introduction>;

export interface PostIntroductionRequest {
  content: string;
}

export type PostIntroductionResponse = BaseResponse<{ introductionId: number }>;

export interface PutIntroductionRequest {
  content: string;
}
export type PutIntroductionResponse = BaseResponse<{ introductionId: number }>;
