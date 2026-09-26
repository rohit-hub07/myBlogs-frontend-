import React, { useEffect, useState, useRef } from "react";
import { 
  Search, 
  PenSquare, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Bell, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Shield, 
  ChevronDown,
  Layers,
  FileText,
  AlertCircle
} from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const notifRef = useRef(null);

  const setSearchQuery = usePostStore((state) => state.setSearchQuery);
  const searchQuery = usePostStore((state) => state.searchQuery);
  const { pendingPosts, getPendingPosts } = usePostStore();
  const { authUser, logout } = useAuthStore();

  const isAdmin = authUser?.role === "admin";
  const pendingCount = pendingPosts?.length || 0;

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (authUser) {
      getPendingPosts();
    }
  }, [authUser, getPendingPosts]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    setIsAvatarOpen(false);
  };

  const navLinks = [
    { name: "Explore", path: "/", icon: BookOpen },
    { 
      name: "Review Queue", 
      path: "/posts/pending-blogs", 
      icon: Clock,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: isAdmin ? "bg-rose-500 text-white" : "bg-amber-100 text-amber-800"
    },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-nav shadow-card py-2.5"
            : "bg-white/95 backdrop-blur-md border-b border-slate-200/70 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-11">
            
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 group-hover:shadow-brand-500/30 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 bg-clip-text text-transparent">
                    MyBlogs
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                    Publish & Inspire
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "text-brand-600 bg-brand-50/80 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? "text-brand-600" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                      
                      {/* Notification Count Badge */}
                      {item.badge !== null && (
                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${item.badgeColor} shadow-xs animate-pulse`}>
                          {item.badge}
                        </span>
                      )}

                      {active && (
                        <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-brand-600 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Middle Search Bar */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search titles, stories, topics..."
                    className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all duration-200"
                  />
                  {localQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalQuery("");
                        setSearchQuery("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Action Items */}
            <div className="hidden md:flex items-center gap-3">
              {/* Write Story Button */}
              <Link
                to="/posts/create-blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write Story</span>
              </Link>

              {/* Notification Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setIsNotifOpen((prev) => !prev);
                    setIsAvatarOpen(false);
                  }}
                  className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {pendingCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-ping"></span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-card-hover border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                      {pendingCount > 0 && (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          {pendingCount} Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                      {pendingCount > 0 ? (
                        <Link
                          to="/posts/pending-blogs"
                          onClick={() => setIsNotifOpen(false)}
                          className="block p-3 hover:bg-rose-50/50 rounded-xl transition-colors bg-rose-50/20"
                        >
                          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                            <AlertCircle className="w-4 h-4" />
                            <span>Action Required: Review Queue</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            There {pendingCount === 1 ? "is 1 blog" : `are ${pendingCount} blogs`} waiting for editorial review and approval.
                          </p>
                          <span className="text-[10px] text-brand-600 font-bold mt-1.5 inline-block">
                            Go to Moderation Queue →
                          </span>
                        </Link>
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                          <p className="font-semibold text-slate-700">All caught up!</p>
                          <p className="text-[11px] text-slate-400">No pending actions required.</p>
                        </div>
                      )}

                      <div className="p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <p className="text-xs font-semibold text-slate-800">Welcome to MyBlogs</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          Start writing or exploring published stories in the community feed.
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Live Feed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Auth or Profile Avatar */}
              {!authUser ? (
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/auth/login"
                    className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-4 py-2 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => {
                      setIsAvatarOpen((prev) => !prev);
                      setIsNotifOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      {authUser.name ? authUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                      {authUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isAvatarOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-card-hover border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 truncate">{authUser.name}</p>
                          {isAdmin && (
                            <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{authUser.email}</p>
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <Link
                          to="/auth/profile"
                          onClick={() => setIsAvatarOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50/60 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Stories</span>
                        </Link>
                        
                        <Link
                          to="/posts/pending-blogs"
                          onClick={() => setIsAvatarOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50/60 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>Review Queue</span>
                          </div>
                          {pendingCount > 0 && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                              {pendingCount}
                            </span>
                          )}
                        </Link>

                        <Link
                          to="/posts/create-blog"
                          onClick={() => setIsAvatarOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50/60 rounded-xl transition-colors"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span>New Article</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
            {/* Search Input for Mobile */}
            <form
              onSubmit={(e) => {
                handleSearchSubmit(e);
                setIsMenuOpen(false);
              }}
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search articles & topics..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </form>

            <div className="space-y-1 pt-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-600 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? "text-brand-600" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                to="/posts/create-blog"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50/50 hover:bg-brand-50"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write Story</span>
              </Link>
            </div>

            {/* Auth Section in Mobile */}
            <div className="pt-3 border-t border-slate-100">
              {!authUser ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 rounded-xl shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {authUser.name ? authUser.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{authUser.name}</p>
                        {isAdmin && (
                          <span className="text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-md">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{authUser.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/auth/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    Profile & Posts
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
