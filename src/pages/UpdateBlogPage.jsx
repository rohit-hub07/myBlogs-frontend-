import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { usePostStore } from "../store/usePostStore";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PenTool,
  Save,
  ArrowLeft,
  Type,
  AlignLeft,
  Tag,
  Image as ImageIcon,
  Eye,
  Sparkles,
  Clock,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.string().optional(),
  coverImage: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

const UpdateBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    post,
    getPostById,
    updatePost,
    isPostUpdating,
    isPostLoading
  } = usePostStore();

  const [activeTab, setActiveTab] = useState("write"); // write | preview

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      coverImage: "",
    },
  });

  const watchedValues = watch();

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

  const wordCount = useMemo(() => {
    if (!watchedValues.content) return 0;
    return watchedValues.content.trim().split(/\s+/).filter(Boolean).length;
  }, [watchedValues.content]);

  const estimatedReadTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const onSubmit = async (data) => {
    try {
      const processedTags = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
        : [];

      await updatePost(post._id, {
        ...data,
        readTime: estimatedReadTime,
        tags: processedTags,
      });

      toast.success("Blog updated successfully!");
      navigate(`/posts/${post._id}`);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  if (isPostLoading || !post?._id) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading post for editing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Writer Studio Bar */}
      <header className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discard Changes</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === "write"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === "preview"
                  ? "bg-white text-brand-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Update Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPostUpdating}
              className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              {isPostUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Story</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Editor Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Writing Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "write" ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Title Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-brand-600" />
                      Article Title
                    </span>
                    <span>{watchedValues.title?.length || 0}/120</span>
                  </div>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder="Enter an intriguing title..."
                    className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 border-none outline-none placeholder:text-slate-300 focus:ring-0 p-0"
                  />
                  {errors.title && (
                    <p className="mt-2 text-xs font-semibold text-rose-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Content Editor Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-semibold uppercase tracking-wider pb-3 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <AlignLeft className="w-4 h-4 text-brand-600" />
                      Markdown Content
                    </span>
                    <div className="flex items-center gap-3">
                      <span>{wordCount} words</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{estimatedReadTime} min read
                      </span>
                    </div>
                  </div>

                  <textarea
                    {...register("content")}
                    rows={18}
                    placeholder="Write your story content here..."
                    className="w-full border-none outline-none resize-none placeholder:text-slate-300 text-slate-800 text-base leading-relaxed p-0 focus:ring-0 font-sans"
                  />
                  {errors.content && (
                    <p className="mt-2 text-xs font-semibold text-rose-600">{errors.content.message}</p>
                  )}
                </div>
              </form>
            ) : (
              /* Live Preview */
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-10">
                {watchedValues.coverImage && (
                  <div className="rounded-2xl overflow-hidden mb-8 h-64 bg-slate-100">
                    <img
                      src={watchedValues.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                  {watchedValues.title || "Untitled Story"}
                </h1>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                  {watchedValues.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {watchedValues.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-slate-400 italic">No content written yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Settings Column */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Post Details
              </h3>

              <div className="space-y-4">
                {/* Tags Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tags (comma separated)
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      {...register("tags")}
                      type="text"
                      placeholder="react, typescript, ui"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cover Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      {...register("coverImage")}
                      type="url"
                      placeholder="https://..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  {errors.coverImage && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">{errors.coverImage.message}</p>
                  )}

                  {watchedValues.coverImage && (
                    <div className="mt-3 rounded-xl overflow-hidden h-28 border border-slate-200 bg-slate-100">
                      <img
                        src={watchedValues.coverImage}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default UpdateBlogPage;
