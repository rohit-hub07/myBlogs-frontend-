import React, { useState, useEffect } from "react";
import PendingBlogPage from "../components/PendingBlog";
import RejectedBlog from "../components/RejectedBlogs";
import { Clock, AlertTriangle, ShieldCheck, Sparkles, Filter } from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState("pending"); // pending | rejected
  const { pendingPosts, rejectedPosts, getPendingPosts, getRejectedPosts } = usePostStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getPendingPosts();
    getRejectedPosts();
  }, [getPendingPosts, getRejectedPosts]);

  return (
    <div className="min-h-screen mesh-bg pb-24">
      {/* Header Banner */}
      <section className="pt-10 pb-8 border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold text-brand-700 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Editorial Workflow</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Story Review & Moderation Queue
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Track pending submissions awaiting approval or review rejected posts to make necessary revisions.
              </p>
            </div>

            {/* Tab Selection Switch */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "pending"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Pending</span>
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                  {pendingPosts?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "rejected"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Rejected</span>
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                  {rejectedPosts?.length || 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Review Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === "pending" ? <PendingBlogPage /> : <RejectedBlog />}
      </main>
    </div>
  );
};

export default ReviewPage;
