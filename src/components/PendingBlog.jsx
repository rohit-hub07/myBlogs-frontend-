import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { Link } from "react-router-dom";
import { 
  Check, 
  X, 
  Clock, 
  Calendar, 
  User, 
  Eye, 
  ShieldCheck, 
  Sparkles,
  Inbox,
  AlertTriangle
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const PendingBlogPage = () => {
  const { authUser } = useAuthStore();
  const {
    pendingPosts,
    isPendingPostLoading,
    getPendingPosts,
    approvePostById,
    rejectPostById,
    getRejectedPosts
  } = usePostStore();

  useEffect(() => {
    getPendingPosts();
  }, [getPendingPosts]);

  const confirmReject = (id, title) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>Reject "{title ? title.slice(0, 30) + '...' : 'this article'}"?</span>
          </div>
          <p className="text-[11px] text-slate-500 font-normal">
            The author will be asked to revise before republishing.
          </p>
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
                await rejectPostById(id);
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
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

  const approvePostFunc = async (id) => {
    await approvePostById(id);
  };

  if (isPendingPostLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-full border-3 border-amber-200 border-t-amber-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Checking moderation queue...</p>
      </div>
    );
  }

  if (!pendingPosts || pendingPosts.length === 0) {
    return (
      <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-card p-8">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Queue is clear!</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          There are currently no articles pending editorial review. New submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingPosts.map((p) => {
        const isAdmin = authUser?.role === "admin";
        
        return (
          <article
            key={p._id}
            className="bg-white rounded-3xl border border-slate-200/80 hover:border-amber-300 shadow-card p-6 transition-all duration-200 flex flex-col md:flex-row gap-6 items-start justify-between"
          >
            <div className="flex-1 space-y-3">
              {/* Author & Timestamp */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {p.author?.name ? p.author.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">{p.author?.name || "Anonymous"}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-2.5 h-2.5" />
                      Pending Approval
                    </span>
                  </div>
                  <time className="text-[11px] text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </time>
                </div>
              </div>

              {/* Title & Excerpt */}
              <Link to={`/posts/${p._id}`} className="block group">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {p.title}
                </h3>
              </Link>
              
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                {p.content}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/posts/${p._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Full Article</span>
                </Link>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approvePostFunc(p._id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => confirmReject(p._id, p.title)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            {p.coverImage && (
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-xs">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default PendingBlogPage;
