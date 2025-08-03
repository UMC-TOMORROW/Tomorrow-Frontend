import { create } from "zustand";

export type Job = {
  id: number;
  date: string;
  company: string;
  title: string;
  status: "모집중" | "모집완료";
  tags: string[];
};

interface JobState {
  jobs: Job[];
  completeJob: (id: number) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [
    {
      id: 1,
      date: "2025.06.01",
      company: "(주) 내일",
      title: "사무 보조 (문서 스캔 및 정리)",
      status: "모집중",
      tags: ["앉아서 근무 중심", "반복 손작업 포함"],
    },
    {
      id: 2,
      date: "2025.06.01",
      company: "내일도서관",
      title: "도서 정리 및 대출 보조",
      status: "모집중",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    },
    {
      id: 3,
      date: "2025.06.10",
      company: "내일텃밭",
      title: "텃밭 관리 도우미",
      status: "모집중",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    },
    {
      id: 4,
      date: "2025.06.01",
      company: "(주) 내일",
      title: "사무 보조 (문서 스캔 및 정리)",
      status: "모집완료",
      tags: ["앉아서 근무 중심", "반복 손작업 포함"],
    },
    {
      id: 5,
      date: "2025.06.01",
      company: "내일도서관",
      title: "도서 정리 및 대출 보조",
      status: "모집완료",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    },
    {
      id: 6,
      date: "2025.06.10",
      company: "내일텃밭",
      title: "텃밭 관리 도우미",
      status: "모집완료",
      tags: ["가벼운 물건 운반", "손이나 팔을 자주 사용하는 작업"],
    },
  ],
  completeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, status: "모집완료" } : job
      ),
    })),
}));
