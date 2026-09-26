import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Zap
} from "lucide-react";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { loginUser, isLogging } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await loginUser(data);
      navigate("/");
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Dynamic Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="absolute inset-0 grid-pattern-bg opacity-70" />
      </div>

      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Brand Showcase Column (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-brand-700 via-indigo-700 to-purple-800 p-10 flex-col justify-between text-white relative overflow-hidden">
          {/* Ambient circles */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">MyBlogs</span>
            </Link>

            <div className="mt-12">
              <h2 className="text-3xl font-black leading-tight text-white mb-4">
                Welcome back to your reading hub.
              </h2>
              <p className="text-sm text-indigo-100 font-light leading-relaxed">
                Connect with engineers, writers, and curious minds exploring tomorrow's tech and creative stories.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="relative z-10 space-y-4 my-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-xs text-indigo-100 font-medium">Real-time discussion & notifications</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xs text-indigo-100 font-medium">Peer-reviewed article quality standards</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-sky-300" />
              </div>
              <p className="text-xs text-indigo-100 font-medium">Custom writer markdown studio</p>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="relative z-10 pt-6 border-t border-white/10">
            <p className="text-xs text-indigo-200 italic">
              "Writing is thinking on paper."
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8">
              <div className="lg:hidden mb-4">
                <Link to="/" className="inline-flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-slate-900">MyBlogs</span>
                </Link>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                Sign in to your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your credentials to manage your articles and join conversations.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-600 text-xs font-semibold mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-600 text-xs font-semibold mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLogging}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 hover:shadow-brand-500/35 active:translate-y-0 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isLogging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                New to MyBlogs?{" "}
                <Link to="/auth/register" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
