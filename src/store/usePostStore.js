import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const usePostStore = create((set, get) => ({
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
      set({ posts: res.data.allPosts || [] });
    } catch (error) {
      console.log("Error getting the blogs:", error.response?.data);
      set({ posts: [] });
    } finally {
      set({ isPostsLoading: false });
    }
  },

  getPostById: async (id) => {
    set({ isPostLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/${id}`);
      set({ post: res.data.post });
    } catch (error) {
      console.log("Error fetching blog:", error.response?.data);
    } finally {
      set({ isPostLoading: false });
    }
  },

  uploadPost: async (data) => {
    set({ isCreatingPost: true });
    try {
      const res = await axiosInstance.post("/posts", data);
      toast.success(res.data.message || "Post submitted for review!");
      await get().getPendingPosts();
    } catch (error) {
      console.log("error inside of uploadPost: ", error.response?.data);
      toast.error(error.response?.data?.message || "Error uploading post");
    } finally {
      set({ isCreatingPost: false });
    }
  },

  updatePost: async (id, data) => {
    set({ isPostUpdating: true });
    try {
      const res = await axiosInstance.put(`/posts/${id}`, data);
      toast.success(res.data.message || "Post updated!");
      await get().getPendingPosts();
      await get().getRejectedPosts();
    } catch (error) {
      console.log("Error while updating posts: ", error.response?.data);
      toast.error(error.response?.data?.message || "Error updating the post!");
    } finally {
      set({ isPostUpdating: false });
    }
  },

  deletePost: async (id) => {
    // Optimistic delete
    const prevRejected = get().rejectedPosts;
    const prevPending = get().pendingPosts;
    set({
      rejectedPosts: prevRejected.filter((p) => p._id !== id),
      pendingPosts: prevPending.filter((p) => p._id !== id),
    });

    try {
      const res = await axiosInstance.delete(`/posts/${id}`);
      toast.success(res.data.message || "Post deleted successfully");
      await get().getRejectedPosts();
      await get().getPendingPosts();
    } catch (error) {
      console.log("Error deleting blog: ", error.response?.data);
      // Rollback on failure
      set({ rejectedPosts: prevRejected, pendingPosts: prevPending });
      toast.error(error.response?.data?.message || "Error deleting the blog!");
    }
  },

  getRejectedPosts: async () => {
    set({ isRejectedPostLoading: true });
    try {
      const res = await axiosInstance.get("/posts/rejected-blogs");
      set({ rejectedPosts: res.data.posts || [] });
    } catch (error) {
      console.log("Error getting rejected blogs!", error.response?.data);
      set({ rejectedPosts: [] });
    } finally {
      set({ isRejectedPostLoading: false });
    }
  },

  getPendingPosts: async () => {
    set({ isPendingPostLoading: true });
    try {
      const res = await axiosInstance.get("/posts/pending-blogs");
      set({ pendingPosts: res.data.posts || [] });
    } catch (error) {
      console.log("Error getting pending blogs!", error.response?.data);
      set({ pendingPosts: [] });
    } finally {
      set({ isPendingPostLoading: false });
    }
  },

  approvedPosts: async () => {
    set({ isApproveBlogLoading: true });
    try {
      const res = await axiosInstance.get("/posts/approved-blogs");
      set({ approvedBlogs: res.data.posts || [] });
    } catch (error) {
      set({ approvedBlogs: [] });
    } finally {
      set({ isApproveBlogLoading: false });
    }
  },

  rejectPostById: async (id) => {
    // Optimistic removal from pending
    const postToReject = get().pendingPosts.find((p) => p._id === id);
    const prevPending = get().pendingPosts;
    const prevRejected = get().rejectedPosts;

    set({
      pendingPosts: prevPending.filter((p) => p._id !== id),
      rejectedPosts: postToReject
        ? [{ ...postToReject, status: "rejected" }, ...prevRejected]
        : prevRejected,
    });

    try {
      const res = await axiosInstance.put(`/admin/posts/${id}/reject`);
      toast.success(res.data.message || "Post rejected");
      await get().getPendingPosts();
      await get().getRejectedPosts();
    } catch (error) {
      // Rollback on failure
      set({ pendingPosts: prevPending, rejectedPosts: prevRejected });
      toast.error(error.response?.data?.message || "Error rejecting the blog!");
    }
  },

  approvePostById: async (id) => {
    // Optimistic approval
    const postToApprove = get().pendingPosts.find((p) => p._id === id);
    const prevPending = get().pendingPosts;
    const prevApproved = get().approvedBlogs;

    set({
      pendingPosts: prevPending.filter((p) => p._id !== id),
      approvedBlogs: postToApprove
        ? [{ ...postToApprove, status: "approved" }, ...prevApproved]
        : prevApproved,
    });

    try {
      const res = await axiosInstance.put(`/admin/posts/${id}/approve`);
      toast.success(res.data.message || "Post approved and published!");
      await get().getPendingPosts();
      await get().approvedPosts();
    } catch (error) {
      // Rollback on failure
      set({ pendingPosts: prevPending, approvedBlogs: prevApproved });
      toast.error(error.response?.data?.message || "Error approving the blog!");
    }
  },
}));
