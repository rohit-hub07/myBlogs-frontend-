// CreateBlogPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PenTool, FileText, Tag, Image, Eye, Save, ArrowLeft, Type, AlignLeft
} from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCategoryStore } from "../store/useCategoryStore";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
});

// const possibleCategories = [
//   "Technology", "Lifestyle", "Travel",
//   "Food", "Health", "Business",
//   "Education", "Entertainment"
// ];

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { getAllCategory, allCategories } = useCategoryStore();
  const { uploadPost, isCreatingPost } = usePostStore();
  const { authUser } = useAuthStore();
  const [isPreview, setIsPreview] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", content: "", category: "", tags: "", coverImage: "" },
  });

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);
  console.log("allcategories: ", allCategories)
  // const filteredCategories = useMemo(
  //   () => possibleCategories.filter(cat => allCategories.includes(cat)),
  //   [allCategories]
  // );

  const watchedValues = watch();

  const onSubmit = async (data) => {
    try {
      const processedTags = data.tags
        ? data.tags.split(",").map(t => t.trim()).filter(t => t.length > 0) : [];
      const postData = {
        ...data,
        tags: processedTags,
        author: authUser._id,
      };
      await uploadPost(postData);
      toast.success("Blog post created successfully!");
      reset();
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to create blog post");
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("blogDraft", JSON.stringify(watchedValues));
    toast.success("Draft saved locally!");
  };

  const loadDraft = () => {
    const draft = localStorage.getItem("blogDraft");
    if (draft) {
      reset(JSON.parse(draft));
      toast.success("Draft loaded!");
    }
  };

  const formatContentForPreview = (content) =>
    content.split("\n").map((paragraph, idx) => (
      <p key={idx} className="mb-4">{paragraph}</p>
    ));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="flex items-center space-x-2">
              <PenTool className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button type="button" onClick={loadDraft} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Load Draft</button>
              <button type="button" onClick={handleSaveDraft} className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Save className="w-4 h-4 mr-2" /> Save Draft
              </button>
              <button type="button" onClick={() => setIsPreview(!isPreview)} className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isPreview ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form & Preview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Area */}
          <div className="lg:col-span-2">
            {!isPreview ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <Type className="w-5 h-5 text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Blog Title</label>
                  </div>
                  <input {...register("title")} type="text" placeholder="Enter your blog title..." className="w-full text-2xl font-bold border-none outline-none resize-none placeholder-gray-400" />
                  {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <AlignLeft className="w-5 h-5 text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Content</label>
                  </div>
                  <textarea {...register("content")} rows={20} placeholder="Start writing your blog content here..." className="w-full border-none outline-none resize-none placeholder-gray-400 text-gray-900 leading-relaxed" />
                  {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>}
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={isCreatingPost} className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
                    {isCreatingPost ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Publish Blog Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">{watchedValues.title || "Your Blog Title"}</h1>
                  {watchedValues.coverImage && (
                    <img src={watchedValues.coverImage} alt="Featured" className="w-full h-64 object-cover rounded-lg mb-6" />
                  )}
                  <div className="text-gray-700 leading-relaxed">
                    {watchedValues.content ? formatContentForPreview(watchedValues.content) : (
                      <p className="text-gray-400 italic">Your content will appear here...</p>
                    )}
                  </div>
                  {watchedValues.tags && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex flex-wrap gap-2">
                        {watchedValues.tags.split(",").map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Settings</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Tag className="w-4 h-4 text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Category</label>
                  </div>
                  <select {...register("category")} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select a category</option>
                    {allCategories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Tag className="w-4 h-4 text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Tags</label>
                  </div>
                  <input {...register("tags")} type="text" placeholder="react, javascript, web development" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Image className="w-4 h-4 text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Featured Image URL</label>
                  </div>
                  <input {...register("coverImage")} type="url" placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>}
                </div>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Writing Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Start with an engaging title</li>
                <li>• Write in a conversational tone</li>
                <li>• Use short paragraphs for readability</li>
                <li>• Add relevant tags to help readers find your content</li>
                <li>• Include a featured image to make your post stand out</li>
                <li>• Preview your post before publishing</li>
              </ul>
            </div>

            {/* Author Info */}
            {authUser && (
              <div className="bg-gray-50 rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {authUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{authUser.name}</p>
                    <p className="text-sm text-gray-600">{authUser.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
