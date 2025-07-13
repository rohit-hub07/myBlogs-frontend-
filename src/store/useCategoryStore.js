import { create } from "zustand";
import {axiosInstance} from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
  allCategories: [],
  category: null,

  addNewCategory: async (data) => {
    try {
      const res = await axiosInstance.post("/category", data);
      set({ category: res.data.category });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error adding category: ", error.response.data);
      toast.error("Error adding a new category");
    }
  },

  getAllCategory: async () => {
    try {
      const res = await axiosInstance.get("/category");
      set({ allCategories: res.data.categories });
    } catch (error) {
      console.log("Error getting categories: ", error.response.data);
      toast.error("Error getting categories");
    }
  },
}));
