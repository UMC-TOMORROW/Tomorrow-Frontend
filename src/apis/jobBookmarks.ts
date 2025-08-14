import { axiosInstance } from "./axios";

type BookmarkItem = {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  bookmarkedAt: string;
};

export async function fetchBookmarkedJobIds(): Promise<number[]> {
  const res = await axiosInstance.get("/api/v1/job-bookmarks");
  const list: BookmarkItem[] = res?.data?.result ?? [];
  return list.map((b) => b.jobId);
}

export async function addJobBookmark(jobId: number) {
  return axiosInstance.post(`/api/v1/job-bookmarks/${jobId}`);
}

export async function deleteJobBookmark(jobId: number) {
  return axiosInstance.delete(`/api/v1/job-bookmarks/${jobId}`);
}
