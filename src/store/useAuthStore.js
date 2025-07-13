import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isUserLoading: "false",
  isSigningUp: false,
  isLogging: false,
  isLoggingOut: false,
  isProfileLoading: false,
  isLoggedIn: false,
  usePosts: [],
  registerUser: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.newUser, isLoggedIn: true }); // Correctly setting isLoggedIn
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error registering the user!");
    } finally {
      set({ isSigningUp: false });
    }
  },

  loginUser: async (data) => {
    set({ isLogging: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user, isLoggedIn: true });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error logging the user!");
    } finally {
      set({ isLogging: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const res = await axiosInstance.get("/auth/logout");
      set({ authUser: null, isLoggedIn: false });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error logging out the user!");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  profile: async () => {
    set({ isProfileLoading: true });
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.loggedInUser, isLoggedIn: true, userPosts: res.data.posts });
      // toast.success(res.data.message);
    } catch (error) {
      set({ authUser: null, isLoggedIn: false }); 
      toast.error("Error getting user profile or session expired!");
    } finally {
      set({ isProfileLoading: false });
    }
  },
}));