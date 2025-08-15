// src/apis/jobBookmarks.ts
import { axiosInstance } from "./axios";

type BookmarkItem = { jobId: number };

function pickArray(d: any): any[] {
  if (Array.isArray(d?.result)) return d.result;
  if (Array.isArray(d?.result?.content)) return d.result.content;
  if (Array.isArray(d?.result?.list)) return d.result.list;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d)) return d;
  return [];
}

export async function fetchBookmarkedJobIds(): Promise<number[]> {
  const res = await axiosInstance.get("/api/v1/job-bookmarks");
  const arr = pickArray(res?.data).filter(Boolean) as BookmarkItem[];
  return arr.map((x) => Number(x.jobId)).filter((n) => Number.isFinite(n));
}

export async function getIsBookmarked(jobId: number): Promise<boolean> {
  const ids = await fetchBookmarkedJobIds();
  return ids.includes(jobId);
}

export const addJobBookmark = (jobId: number) => axiosInstance.post(`/api/v1/job-bookmarks/${jobId}`);

export const deleteJobBookmark = (jobId: number) => axiosInstance.delete(`/api/v1/job-bookmarks/${jobId}`);
