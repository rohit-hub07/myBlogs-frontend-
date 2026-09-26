import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useForm } from "react-hook-form";
import { usePostStore } from "../store/usePostStore";
import { useCommentStore } from "../store/useCommentStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  CalendarDays,
  Clock,
  LoaderCircle,
  MessageSquarePlus,
  Tag,
  Share2,
  ArrowLeft,
  Check,
  Bookmark,
  Sparkles,
  User,
  Heart,
  Edit3,
  X
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BlogInfo = () => {
  const { post, isPostLoading, getPostById } = usePostStore();
  const { addComment, getAllComments, isCommentAdding } = useCommentStore();
  const { authUser } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { description: "" }
  });

  useEffect(() => {
    getPostById(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, getPostById]);

  if (isPostLoading || !post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading story details...</p>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data) => {
    try {
      await addComment(id, data);
      await getAllComments(id);
      await getPostById(id);
      reset();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const isAuthorOrAdmin = authUser && (authUser._id === post.author?._id || authUser.role === "admin");
  const categoryName = typeof post.category === 'object' ? post.category?.name : post.category;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {isAuthorOrAdmin && (
            <Link
              to={`/posts/update/${post._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </Link>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs"
            title="Copy link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Category Pill */}
      {categoryName && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider border border-brand-100">
            <Sparkles className="w-3 h-3 text-brand-500" />
            {categoryName}
          </span>
        </div>
      )}

      {/* Article Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2] mb-6">
        {post.title}
      </h1>

      {/* Author & Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{post.author?.name || "Anonymous"}</h3>
            <p className="text-xs text-slate-400">Writer & Contributor</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{post.readTime || 3} min read</span>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      {post.coverImage && (
        <div className="mb-10 rounded-3xl overflow-hidden shadow-lg border border-slate-200/70 bg-slate-100 max-h-[480px]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center max-h-[480px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Article Markdown Body */}
      <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed mb-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Tags Section */}
      {post.tags?.length > 0 && (
        <div className="pt-6 border-t border-slate-200/80 mb-10">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Related Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar (Like & Add Comment) */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-brand-50/50 via-slate-50 to-purple-50/50 rounded-3xl border border-slate-200 shadow-xs mb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isLiked
                ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-xs scale-105"
                : "bg-white text-slate-600 hover:text-rose-600 border border-slate-200 shadow-xs"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{isLiked ? "Liked" : "Like Article"}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 hover:shadow-brand-500/35 transition-all"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Add Comment</span>
        </button>
      </div>

      {/* Modal for adding comment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Join the Conversation</h3>
                <p className="text-xs text-slate-400">Share your thoughts on this article</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                  placeholder="What are your thoughts on this story? Write respectfully..."
                  {...register("description", { required: "Comment cannot be empty" })}
                />
                {errors.description && (
                  <p className="text-rose-600 text-xs font-semibold mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCommentAdding}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isCommentAdding ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Post Comment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogInfo;
