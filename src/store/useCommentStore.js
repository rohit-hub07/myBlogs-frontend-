import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useCommentStore = create((set) => ({
  comments: [],
  isCommnetLoading: false,
  addedComment: null,
  isCommentAdding: false,
  getAllComments: async (id) => {
    set({ isCommnetLoading: true });
    try {
      const res = await axiosInstance.get(`/comments/${id}`);
      set({ comments: res.data.allComments });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting the comments: ", error.response.data);
      toast.error("Error getting comments");
    } finally {
      set({ isCommnetLoading: false });
    }
  },

  addComment: async (id, data) => {
    set({ isCommentAdding: true });
    try {
      const res = await axiosInstance.post(`/comments/add-comment/${id}`, data);
      set({ addedComment: res.data.newComment });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error while adding comment: ", error.response.data);
      toast.error("Error while adding comment");
    } finally {
      set({ isCommentAdding: false });
    }
  },

  deleteComment: async (id) => {
    try {
      const res = await axiosInstance.delete(`/comments/delete-comment/${id}`);
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error deleting the message: ", error.response.data);
      toast.error("Error deleting the message");
    }
  },
}));
