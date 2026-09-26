import React from 'react';
import Navbar from './Navbar';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowUp } from 'lucide-react';

const Layout = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen mesh-bg relative selection:bg-brand-500 selection:text-white">
      
      {/* Dynamic Ambient Background Aura Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="absolute inset-0 grid-pattern-bg opacity-70" />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 mt-auto relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              
              {/* Column 1: Brand */}
              <div className="md:col-span-2 space-y-4">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-brand-700 bg-clip-text text-transparent">
                    MyBlogs
                  </span>
                </Link>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-normal">
                  A collaborative publishing platform designed for curious minds, creators, and engineers to share narratives and ideas that matter.
                </p>
              </div>

              {/* Column 2: Navigation */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Explore</h4>
                <ul className="space-y-2 text-xs text-slate-500 font-medium">
                  <li>
                    <Link to="/" className="hover:text-brand-600 transition-colors">Home & Stories</Link>
                  </li>
                  <li>
                    <Link to="/posts/pending-blogs" className="hover:text-brand-600 transition-colors">Review Queue</Link>
                  </li>
                  <li>
                    <Link to="/posts/create-blog" className="hover:text-brand-600 transition-colors">Publish an Article</Link>
                  </li>
                  <li>
                    <Link to="/auth/profile" className="hover:text-brand-600 transition-colors">Author Dashboard</Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Community & Social */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Community</h4>
                <ul className="space-y-2 text-xs text-slate-500 font-medium">
                  <li>
                    <a href="#" className="hover:text-brand-600 transition-colors">Guidelines</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-600 transition-colors">Markdown Tips</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-600 transition-colors">Feedback & Support</a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p>© {new Date().getFullYear()} MyBlogs Platform. Crafted for thinkers & writers.</p>
              
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-colors font-semibold"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
