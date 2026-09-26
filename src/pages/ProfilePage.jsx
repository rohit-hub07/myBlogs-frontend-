import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePostStore } from '../store/usePostStore';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  BookOpen, 
  Eye, 
  Calendar, 
  Clock, 
  Sparkles, 
  Edit3, 
  PlusCircle, 
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ProfilePage = () => {
  const { authUser, profile, userPosts, isProfileLoading } = useAuthStore();
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    profile();
  }, [profile]);

  const stats = useMemo(() => {
    const posts = userPosts || [];
    const totalWords = posts.reduce((acc, p) => acc + (p.content?.split(/\s+/).length || 0), 0);
    const approved = posts.filter(p => p.status === "approved" || !p.status).length;
    const pending = posts.filter(p => p.status === "pending").length;

    return {
      total: posts.length,
      approved,
      pending,
      totalWords
    };
  }, [userPosts]);

  const filteredPosts = useMemo(() => {
    if (!userPosts) return [];
    if (filterStatus === "all") return userPosts;
    return userPosts.filter(p => p.status === filterStatus);
  }, [userPosts, filterStatus]);

  if (isProfileLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        <h2 className="text-sm font-semibold text-slate-600">Loading Author Profile...</h2>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const isAdmin = role?.toLowerCase() === 'admin';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        isAdmin 
          ? "bg-rose-100 text-rose-800 border border-rose-200" 
          : "bg-brand-100 text-brand-800 border border-brand-200"
      }`}>
        <Shield className="w-3.5 h-3.5" />
        <span>{role || "Author"}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-2.5 h-2.5" /> Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-2.5 h-2.5" /> Changes Needed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5" /> Published
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen mesh-bg pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl shadow-card border border-slate-200/80 overflow-hidden mb-10">
          
          {/* Banner Graphic */}
          <div className="h-36 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            <div className="absolute right-6 top-6 text-white/30 font-black text-6xl select-none">
              AUTHOR
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-14 mb-6">
              
              {/* Avatar */}
              <div className="flex items-end gap-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg ring-4 ring-white">
                    {authUser?.name ? authUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{authUser?.name}</h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{authUser?.email}</span>
                  </div>
                </div>
              </div>

              {/* Badges & Actions */}
              <div className="flex items-center gap-3">
                {getRoleBadge(authUser?.role)}
                <Link
                  to="/posts/create-blog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Write New</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Articles</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Published</span>
                <p className="text-2xl font-black text-emerald-900 mt-1">{stats.approved}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">In Review</span>
                <p className="text-2xl font-black text-amber-900 mt-1">{stats.pending}</p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Words Written</span>
                <p className="text-2xl font-black text-brand-900 mt-1">{stats.totalWords.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Stories Listing Section */}
        <div className="bg-white rounded-3xl shadow-card border border-slate-200/80 p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Authored Stories</h2>
                <p className="text-xs text-slate-400">Manage, review, and track your content performance</p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {["all", "approved", "pending", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    filterStatus === st
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((p) => (
                <article
                  key={p._id}
                  className="bg-slate-50/60 rounded-3xl border border-slate-200/80 hover:border-brand-300 hover:bg-white shadow-xs hover:shadow-card transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Thumbnail */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-brand-600/10 via-purple-600/10 to-pink-600/10 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-brand-400" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      {getStatusBadge(p.status)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(p.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
                        {p.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                        {p.content}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                      <Link
                        to={`/posts/${p._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>

                      <Link
                        to={`/posts/update/${p._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
              <h3 className="text-base font-bold text-slate-800">No stories found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {filterStatus !== "all"
                  ? `You do not have any articles matching the "${filterStatus}" status filter.`
                  : "You haven't written any articles yet. Start inspiring readers today!"}
              </p>
              <Link
                to="/posts/create-blog"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Your First Post</span>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
