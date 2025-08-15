import { axiosInstance } from "./axios";

export type Review = {
  id: number;
  rating: number; // 0~5
  author?: string;
  content: string;
  createdAt?: string; // ISO
};

export type ReviewsPayload =
  | Review[]
  | {
      content?: Review[];
      reviews?: Review[];
      averageRating?: number;
      totalElements?: number;
    };

export async function getJobReviewsByPostId(postId: string | number) {
  const { data } = await axiosInstance.get<ReviewsPayload>(`/api/v1/reviews/${postId}`);
  return data;
}
