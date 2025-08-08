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
  setJobs: (jobs: Job[]) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  completeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, status: "모집완료" } : job
      ),
    })),
  setJobs: (jobs) => set({ jobs }),
}));
