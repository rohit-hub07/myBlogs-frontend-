import React, { useEffect, useState, useMemo } from 'react';
import { usePostStore } from '../store/usePostStore';
import { useCategoryStore } from '../store/useCategoryStore';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Search, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Tag, 
  PenSquare, 
  Filter, 
  Flame, 
  Compass,
  CheckCircle,
  Share2,
  Bookmark
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const approvedBlogs = usePostStore((state) => state.approvedBlogs);
  const isApproveBlogLoading = usePostStore((state) => state.isApproveBlogLoading);
  const approvedPosts = usePostStore((state) => state.approvedPosts);
  const searchQuery = usePostStore((state) => state.searchQuery);
  const setSearchQuery = usePostStore((state) => state.setSearchQuery);
  const { allCategories, getAllCategory } = useCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    approvedPosts();
    getAllCategory();
  }, [approvedPosts, getAllCategory]);

  // Filter posts based on search query & selected category
  const filtered = useMemo(() => {
    let list = approvedBlogs || [];

    if (selectedCategory !== "all") {
      list = list.filter((p) => {
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        return catName?.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q) ||
        p.author?.name?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [approvedBlogs, selectedCategory, searchQuery]);

  const handleShare = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/posts/${post._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Post link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen mesh-bg pb-24">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/60">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 via-purple-500/15 to-pink-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-xs text-xs font-semibold text-brand-700 mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Discover Knowledge & Engineering Perspectives</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15] mb-6">
            Where curious minds craft, share & explore{" "}
            <span className="gradient-text">exceptional stories</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Dive into in-depth engineering breakdowns, design reflections, and insightful narratives published by our community of writers and developers.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/posts/create-blog"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm"
            >
              <PenSquare className="w-4 h-4" />
              <span>Start Writing</span>
            </Link>

            <a
              href="#explore-section"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all text-sm"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Explore Feed</span>
            </a>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {approvedBlogs?.length || 0}+
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Published Articles</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {allCategories?.length || 8}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Diverse Categories</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Peer Reviewed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="explore-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Category Filter & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              All Topics
            </button>
            {allCategories?.map((cat) => (
              <button
                key={cat._id || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.name
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Status Tag */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>
              Showing <strong className="text-slate-800">{filtered.length}</strong> stories
            </span>
          </div>
        </div>

        {/* Loading State Skeletons */}
        {isApproveBlogLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-card animate-pulse space-y-4"
              >
                <div className="w-full h-48 bg-slate-200 rounded-2xl"></div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-200 rounded-full"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-2.5 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-4/5"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-full"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-card max-w-lg mx-auto p-8">
            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {searchQuery
                ? `We couldn't find any articles matching "${searchQuery}". Try searching for something else or clearing filters.`
                : "No published posts are available in this category yet. Be the first to share one!"}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/posts/create-blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write First Post</span>
              </Link>
            )}
          </div>
        ) : (
          /* Rich Articles Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => {
              const categoryName = typeof post.category === 'object' ? post.category?.name : post.category;
              
              return (
                <article
                  key={post._id}
                  className="group bg-white rounded-3xl border border-slate-200/70 hover:border-brand-300 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5"
                >
                  {/* Cover Image Container */}
                  <Link to={`/posts/${post._id}`} className="relative block h-52 overflow-hidden bg-slate-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-brand-600/10 via-indigo-600/10 to-pink-600/10 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-brand-400" />
                      </div>
                    )}
                    
                    {/* Category Overlay Tag */}
                    {categoryName && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-xs border border-white/60">
                        {categoryName}
                      </div>
                    )}

                    {/* Share Action */}
                    <button
                      onClick={(e) => handleShare(e, post)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-brand-600 hover:bg-white shadow-xs transition-colors"
                      title="Share Article"
                      aria-label="Share Article"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Author Header */}
                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0">
                          {post.author?.name ? post.author.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {post.author?.name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span>
                              {new Date(post.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime || 3}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <Link to={`/posts/${post._id}`} className="block group-hover:text-brand-600 transition-colors">
                        <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Snippet */}
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4 font-normal">
                        {post.content}
                      </p>
                    </div>

                    {/* Footer Tags & Read Link */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {post.tags && post.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[80px]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/posts/${post._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors group/link"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
