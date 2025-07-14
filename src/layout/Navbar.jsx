import React, { useEffect, useState } from "react";
import { Search, Edit, Menu, X, LogOut, User, Settings } from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo state
  const [localQuery, setLocalQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const setSearchQuery = usePostStore((state) => state.setSearchQuery);
  const { authUser, profile, logout } = useAuthStore();

  // useEffect(() => {
  //   profile();
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 10);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", localQuery);
    setSearchQuery(localQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsAvatarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsAvatarOpen(false);
    
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white/95 backdrop-blur-sm border-b border-gray-200/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">Mg</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-200"></div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                MyBlogs
              </span>
            </div>

            {/* Desktop Navigation with hover effects */}
            <div className="hidden md:flex items-center space-x-1">
              {["Home", "Pending Blogs", "Create Blog"].map((item, index) => (
                <a
                  key={item}
                  href={
                    index === 0
                      ? "/"
                      : `/posts/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className="relative px-4 py-2 text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors duration-200 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            <div className="hidden md:block relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  placeholder="Search articles..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                    Login
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsAvatarOpen((prev) => !prev)}
                    className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <span className="text-white font-medium">
                      {authUser?.name.charAt(0).toUpperCase()}
                    </span>
                  </button>

                  {isAvatarOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {authUser.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {authUser.email}
                        </p>
                      </div>
                      <Link to="/auth/profile">
                        <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-150">
                          <User className="w-4 h-4 mr-2" /> Profile
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile collapse */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-sm animate-in slide-in-from-top duration-200">
            <div className="px-4 pt-4 pb-3 space-y-1">
              {["Home", "Pending Blogs", "Create Blog"].map((item, idx) => (
                <Link
                  key={item}
                  to={
                    idx === 0
                      ? "/"
                      : `/posts/${item.toLowerCase().replace(" ", "-")}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="px-4 pb-3">
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                  setIsMenuOpen(false);
                }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </form>
            </div>

            {/* mobile avatar/actions */}
            <div className="px-4 pt-3 pb-4 border-t border-gray-200/50">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 rounded-lg text-center transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/profile">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      Profile
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
