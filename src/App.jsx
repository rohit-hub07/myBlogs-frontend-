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
import PendingBlogPage from "./components/PendingBlog";
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
      <Toaster />
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
