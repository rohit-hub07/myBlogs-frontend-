import "./App.css";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import Layout from "./layout/Layout";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import BlogDetailPage from "./pages/BlogDetailPage";
import ReviewPage from "./pages/ReviewPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import UpdateBlogPage from "./pages/UpdateBlogPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { profile, authUser } = useAuthStore();

  useEffect(() => {
    profile();
  }, [profile]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            borderRadius: "1rem",
            border: "1px solid #e2e8f0",
            padding: "12px 16px",
            fontSize: "0.875rem",
            fontWeight: "600",
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          },
          success: {
            iconTheme: {
              primary: "#4f46e5",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#e11d48",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/auth/login"} />}
          />

          <Route path="/posts/:id" element={<BlogDetailPage />} />

          <Route path="/posts/pending-blogs" element={<ReviewPage />} />

          <Route path="/posts/create-blog" element={<CreateBlogPage />} />

          <Route path="/posts/update/:id" element={<UpdateBlogPage />} />

          <Route path="/auth/profile" element={<ProfilePage />} />

        </Route>
        <Route
          path="/auth/login"
          element={authUser ? <Navigate to={"/"} /> : <LoginPage />}
        />
        <Route
          path="/auth/register"
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />
      </Routes>
    </>
  );
}

export default App;
