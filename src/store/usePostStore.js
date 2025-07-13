import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const usePostStore = create((set) => ({
  post: null,
  posts: [],
  isPostLoading: false,
  isCreatingPost: false,
  isPostsLoading: false,
  isRejectedPostLoading: false,
  rejectedPosts: [],
  pendingPosts: [],
  isPendingPostLoading: false,
  approvedBlogs: [],
  isApproveBlogLoading: false,
  isPostUpdating: false,
  searchQuery: "",

  setSearchQuery: (q) => set({ searchQuery: q }),

  getAllPosts: async () => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstance.get("/posts");
      set({ posts: res.data.allPosts });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error getting the blogs!");
    } finally {
      set({ isPostsLoading: false });
    }
  },

  getPostById: async (id) => {
    set({ isPostLoading: true });
    try {
      console.log("id inside of usePostStore: ", id);
      const res = await axiosInstance.get(`/posts/${id}`);
      set({ post: res.data.post });
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error fetching blog!");
    } finally {
      set({ isPostLoading: false });
    }
  },

  uploadPost: async (data) => {
    set({ isCreatingPost: true });
    try {
      const res = await axiosInstance.post("/posts", data);
      toast.success(res.data.message);
    } catch (error) {
      console.log("error inside of uploadPost: ", error.response.data);
      toast.error(error);
    } finally {
      set({ isCreatingPost: false });
    }
  },

  updatePost: async (id, data) => {
    set({ isPostUpdating: true });
    try {
      const res = await axiosInstance.put(`/posts/${id}`, data);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error while updating posts: ", error.response.data);
      toast.error("Error updating the post!");
    } finally {
      set({ isPostUpdating: false });
    }
  },
  deletePost: async (id) => {
    try {
      const res = await axiosInstance.delete(`/posts/${id}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting blog: ", error.response.data);
      toast.error("Error deleting the blog!");
    }
  },

  getRejectedPosts: async () => {
    set({ isRejectedPostLoading: true });
    try {
      const res = await axiosInstance.get("/posts/rejected-blogs");
      set({ rejectedPosts: res.data.posts });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting rejectedd blogs!")
      // toast.error("Error fetching the data");
    } finally {
      set({ isRejectedPostLoading: false });
    }
  },

  getPendingPosts: async () => {
    set({ isPendingPostLoading: true });
    try {
      const res = await axiosInstance.get("/posts/pending-blogs");
      set({ pendingPosts: res.data.posts });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting pending blogs!")
      // toast.error("Error getting pending blogs!");
    } finally {
      set({ isPendingPostLoading: false });
    }
  },

  approvedPosts: async () => {
    set({ isApproveBlogLoading: true });
    try {
      const res = await axiosInstance.get("/posts/approved-blogs");
      set({ approvedBlogs: res.data.posts });
      toast.success(res.data.message);
    } catch (error) {
      // toast.error("Error getting approved blogs!");
    } finally {
      set({ isApproveBlogLoading: false });
    }
  },

  rejectPostById: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/posts/${id}/reject`);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error rejecting the blog!");
    }
  },

  approvePostById: async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/posts/${id}/approve`);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error approving the blog!");
    }
  },
}));
