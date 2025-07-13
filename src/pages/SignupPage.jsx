import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpSchema = z.object({
  name: z.string().min("Name must be at least of 5 letters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupPage = () => {
  const { registerUser, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
    } catch (error) {
      console.log("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Signup to MyBlogs
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* {Name field} */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="********"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {isSigningUp && (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            )}
            {isSigningUp ? "Logging in..." : "Signup"}
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
        </form>

      </div>
    </div>
  );
};

export default SignupPage;