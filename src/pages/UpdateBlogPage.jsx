// UpdateBlogPage.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  usePostStore
} from "../store/usePostStore";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PenTool,
  FileText,
  Tag,
  Image as LucideImage,
  Save,
  ArrowLeft,
  Type,
  AlignLeft
} from "lucide-react";
import toast from "react-hot-toast";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
});

const UpdateBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    post,
    getPostById,
    updatePost,
    isPostUpdating
  } = usePostStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      coverImage: "",
    },
  });

  useEffect(() => {
    if (id) getPostById(id);
  }, [id, getPostById]);

  // Prefill when post data loads
  useEffect(() => {
    if (post && post._id) {
      reset({
        title: post.title || "",
        content: post.content || "",
        tags: post.tags?.join(", ") || "",
        coverImage: post.coverImage || "",
      });
    }
  }, [post, reset]);

  const onSubmit = async (data) => {
    console.log("data: ",data)
    try {
      const processedTags = data.tags
        ? data.tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
        : [];
      await updatePost(post._id, {
        ...data,
        tags: processedTags,
      });
      toast.success("Blog updated successfully!");
      navigate(`/posts/${post._id}`);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  if (!post?._id) return <div className="p-6 text-center">Loading post...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <PenTool className="w-6 h-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold">Update Blog Post</h1>
          </div>

          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Type className="w-5 h-5 text-gray-500 mr-2" />
              Title
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Type className="w-5 h-5 text-gray-500 mr-2" />
              Expected reading time
            </label>
            <input
              {...register("readTime")}
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            />
            {errors.readTime && <p className="mt-1 text-sm text-red-600">{errors.readTime.message}</p>}
          </div> */}

          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <AlignLeft className="w-5 h-5 text-gray-500 mr-2" />
              Content
            </label>
            <textarea
              {...register("content")}
              rows={10}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-5 h-5 text-gray-500 mr-2" />
              Tags (comma-separated)
            </label>
            <input
              {...register("tags")}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <LucideImage className="w-5 h-5 text-gray-500 mr-2" />
              Cover Image URL
            </label>
            <input
              {...register("coverImage")}
              type="url"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
            />
            {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPostUpdating}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isPostUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Update Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlogPage;

