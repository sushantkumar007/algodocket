import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");
      set({ submissions: res.data.data.submissions });

    } catch (error) {
      set({ error })
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(`/submission/get-submission/${problemId}`);
      set({ submission: res.data.data.submissions });

    } catch (error) {
      set({ error })      
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`);                
      set({ submissionCount: res.data.data.submissions });

    } catch (error) {
      set({ error })
    }
  },
}));