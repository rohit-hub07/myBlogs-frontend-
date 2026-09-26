import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PenTool, 
  FileText, 
  Tag, 
  Image as ImageIcon, 
  Eye, 
  Save, 
  ArrowLeft, 
  Type, 
  AlignLeft,
  Sparkles,
  Check,
  FolderPlus,
  HelpCircle,
  Clock,
  BookOpen,
  Info,
  Shuffle
} from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCategoryStore } from "../store/useCategoryStore";

const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().optional(),
  coverImage: z.string().optional().or(z.literal("")),
});

const defaultCategories = [
  "Technology", "Engineering", "Design", "Productivity", 
  "Artificial Intelligence", "Career", "Web Development", "Tutorials"
];

const PRESET_COVERS = [
  {
    name: "Tech Matrix",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Coding Desk",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Cyber Gradient",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Creative Design",
    url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "AI Network",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Modern Editorial",
    url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  },
];

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { getAllCategory, allCategories } = useCategoryStore();
  const { uploadPost, isCreatingPost } = usePostStore();
  const { authUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState("write"); // write | preview

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: { 
      title: "", 
      content: "", 
      category: "", 
      tags: "", 
      coverImage: "" 
    },
  });

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  const watchedValues = watch();

  // Calculate stats
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
      
      const postData = {
        title: data.title.trim(),
        content: data.content,
        category: data.category,
        tags: processedTags,
        coverImage: data.coverImage ? data.coverImage.trim() : undefined,
        readTime: estimatedReadTime,
        author: authUser?._id,
      };

      await uploadPost(postData);
      localStorage.removeItem("blogDraft");
      reset();
      navigate("/posts/pending-blogs");
    } catch (error) {
      toast.error(error.message || "Failed to create blog post");
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("blogDraft", JSON.stringify(watchedValues));
    toast.success("Draft saved to browser storage!");
  };

  const loadDraft = () => {
    const draft = localStorage.getItem("blogDraft");
    if (draft) {
      const parsed = JSON.parse(draft);
      reset(parsed);
      toast.success("Draft restored!");
    } else {
      toast.error("No saved draft found.");
    }
  };

  const handleSelectPreset = (url) => {
    setValue("coverImage", url);
    toast.success("Cover image selected!");
  };

  // Combine fetched categories with default categories
  const categoriesList = useMemo(() => {
    const map = new Map();
    if (Array.isArray(allCategories)) {
      allCategories.forEach((cat) => {
        if (cat.name) {
          map.set(cat.name, cat._id || cat.name);
        }
      });
    }
    defaultCategories.forEach((catName) => {
      if (!map.has(catName)) {
        map.set(catName, catName);
      }
    });
    return Array.from(map.entries()).map(([name, val]) => ({ name, value: val }));
  }, [allCategories]);

  return (
    <div className="min-h-screen pb-20">
      
      {/* Top Writer Studio Bar */}
      <header className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
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
              <span>Write</span>
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

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Save draft locally"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={loadDraft}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Load Draft
            </button>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isCreatingPost}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              {isCreatingPost ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish Story</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Editor Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Writing / Preview Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === "write" ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Title Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8">
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
                    className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-300 focus:ring-0 p-0"
                  />
                  {errors.title && (
                    <p className="mt-2 text-xs font-semibold text-rose-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Content Editor Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8">
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
                    placeholder="Tell your story using Markdown syntax...

## Key Takeaway
Share clear explanations, code blocks, bullet points, or personal lessons learned."
                    className="w-full bg-transparent border-none outline-none resize-none placeholder:text-slate-300 text-slate-800 text-base leading-relaxed p-0 focus:ring-0 font-sans"
                  />
                  {errors.content && (
                    <p className="mt-2 text-xs font-semibold text-rose-600">{errors.content.message}</p>
                  )}
                </div>
              </form>
            ) : (
              /* Live Preview Card */
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-10">
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

                {watchedValues.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase mb-4">
                    {watchedValues.category}
                  </span>
                )}

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                  {watchedValues.title || "Untitled Article"}
                </h1>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                  {watchedValues.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {watchedValues.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-slate-400 italic">No content written yet. Switch back to write tab.</p>
                  )}
                </div>

                {watchedValues.tags && (
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                    {watchedValues.tags.split(",").map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        #{t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Settings Column */}
          <aside className="space-y-6">
            
            {/* Metadata Settings Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-card p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Publication Settings
              </h3>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    {...register("category")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="">Select Topic Category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.name} value={cat.value}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">{errors.category.message}</p>
                  )}
                </div>

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
                      placeholder="react, tailwind, webdev"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Cover Image URL & Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Cover Image URL (Optional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      {...register("coverImage")}
                      type="url"
                      placeholder="Paste image link or choose preset below"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  {errors.coverImage && (
                    <p className="mt-1 text-xs font-semibold text-rose-600">{errors.coverImage.message}</p>
                  )}

                  {/* Preset Wallpapers Picker */}
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
                      <span>Quick Select Covers</span>
                      <span className="text-[10px] text-slate-400">or left empty for auto-assign</span>
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_COVERS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleSelectPreset(preset.url)}
                          className="group/preset relative h-14 rounded-xl overflow-hidden border border-slate-200 hover:border-brand-500 hover:scale-105 transition-all shadow-xs"
                          title={preset.name}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] font-bold text-white opacity-0 group-hover/preset:opacity-100 transition-opacity">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {watchedValues.coverImage && (
                    <div className="mt-3 rounded-xl overflow-hidden h-28 border border-slate-200 bg-slate-100 relative">
                      <img
                        src={watchedValues.coverImage}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <button
                        type="button"
                        onClick={() => setValue("coverImage", "")}
                        className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Markdown Guidelines & Tips Card */}
            <div className="bg-gradient-to-br from-brand-50/70 via-indigo-50/40 to-purple-50/50 rounded-3xl border border-brand-100 p-6">
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-brand-600" />
                Writing Guidelines
              </h4>
              <ul className="space-y-2 text-xs text-brand-800 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <span>Use clear headers (##, ###) for structure.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <span>Include relatable code snippets or examples.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <span>Submissions undergo swift community review.</span>
                </li>
              </ul>
            </div>

            {/* Author Status */}
            {authUser && (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-card p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  {authUser.name ? authUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">Publishing as {authUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{authUser.email}</p>
                </div>
              </div>
            )}

          </aside>
        </div>
      </main>
    </div>
  );
};

export default CreateBlogPage;
