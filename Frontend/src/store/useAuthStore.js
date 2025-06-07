import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/users/me");
      set({ authUser: res.data.data.user });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true, error: null });
    try {
      const res = await axiosInstance.post("/users/register", data);
      set({ authUser: res.data.data.user });
    } catch (error) {
      throw new Error(error.response.data.message)
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true, error: null });
    try {
      const res = await axiosInstance.post("/users/login", data);
      set({ authUser: res.data.data.user });
    } catch (error) {
      throw new Error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/users/logout");
      set({ authUser: null });
    } catch (error) {

    }
  },

  verifyEmail: async (token) => {
    try {
      const res = await axiosInstance.get(`/users/verify/${token}`)
      const data = res.data
      return data
    } catch (error) {
      throw new Error(error.response.data.message)
    }
  },

  requestVerificaion: async (data) => {
    try {
      return await axiosInstance.post("users/request-verificaion", data)
    } catch (error) {
      throw new Error(error.response.data.message)
    }
  },

  resetPasswordRequest: async (data) => {
    try {
      return await axiosInstance.post("/reset-password-request", data)
    } catch (error) {
      throw new Error(error.response.data.message)
    }
  },
  resetPassword: async (data) => {
    try {
      return await axiosInstance.post(`/reset-password/${data.token}`, data)
    } catch (error) {
      throw new Error(error.response.data.message)
    }
  },

  updatePassword: async (data) => {
    try {
      return await axiosInstance.post("/update-password", data)
    } catch (error) {
      throw new Error(error.response.data.message)
    }
  }
}));
