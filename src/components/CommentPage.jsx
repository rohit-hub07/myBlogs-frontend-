import React, { useEffect, useState } from "react";
import { Loader2, MessageSquare, Trash2, Send, CornerDownRight, User, AlertTriangle } from "lucide-react";
import { useCommentStore } from "../store/useCommentStore";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CommentPage = () => {
  const comments = useCommentStore((state) => state.comments);
  const getAllComments = useCommentStore((state) => state.getAllComments);
  const isCommentLoading = useCommentStore((state) => state.isCommentLoading);
  const deleteComment = useCommentStore((state) => state.deleteComment);
  const addComment = useCommentStore((state) => state.addComment);
  const isCommentAdding = useCommentStore((state) => state.isCommentAdding);
  const authUser = useAuthStore((state) => state.authUser);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { description: "" }
  });

  useEffect(() => {
    if (id) {
      getAllComments(id);
    }
  }, [id, getAllComments]);

  const confirmDeleteComment = (cId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>Delete this comment?</span>
          </div>
          <div className="flex items-center justify-end gap-2 mt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await deleteComment(cId);
                await getAllComments(id);
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 4000,
        position: "top-center",
        style: {
          border: "1px solid #fecdd3",
          background: "#ffffff",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          borderRadius: "1rem",
          padding: "12px",
        },
      }
    );
  };

  const onSubmitQuickComment = async (data) => {
    try {
      await addComment(id, data);
      await getAllComments(id);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Discussion & Comments</h3>
              <p className="text-xs text-slate-400">
                {comments?.length || 0} {comments?.length === 1 ? "thought" : "thoughts"} shared
              </p>
            </div>
          </div>
        </div>

        {/* Quick Comment Input Box */}
        {authUser ? (
          <form onSubmit={handleSubmit(onSubmitQuickComment)} className="mb-8">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0 mt-1">
                {authUser.name ? authUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all resize-none"
                  placeholder="Leave a helpful comment or question..."
                  {...register("description", { required: "Comment is required" })}
                />
                {errors.description && (
                  <p className="text-rose-600 text-xs font-semibold">{errors.description.message}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isCommentAdding}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 transition-all"
                  >
                    {isCommentAdding ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center mb-8">
            <p className="text-xs text-slate-600">
              Please sign in to join the conversation and share comments.
            </p>
          </div>
        )}

        {/* Comments Loading State */}
        {isCommentLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <p className="text-xs font-medium">Loading conversation...</p>
          </div>
        ) : comments?.length === 0 ? (
          /* Empty Comments State */
          <div className="py-12 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-sm font-semibold text-slate-700">No comments yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Be the first to share your thoughts on this story!</p>
          </div>
        ) : (
          /* Comments List */
          <div className="space-y-4">
            {comments.map((c) => {
              const isCommentOwner = authUser?._id === c.user?._id || authUser?.role === "admin";
              
              return (
                <div
                  key={c._id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        {c.user?.name ? c.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{c.user?.name || "Reader"}</span>
                          {c.user?.role === "admin" && (
                            <span className="text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-md">
                              Staff
                            </span>
                          )}
                        </div>
                        <time className="text-[11px] text-slate-400">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </time>
                      </div>
                    </div>

                    {isCommentOwner && (
                      <button
                        onClick={() => confirmDeleteComment(c._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete comment"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pl-11">
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default CommentPage;
