import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { Link } from "react-router-dom";
import { Heart, LocationEdit, MessageCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const RejectedBlog = () => {
  const { authUser, profile } = useAuthStore();
  const navigate = useNavigate();
  const { rejectedPosts, isRejectedPostLoading, getRejectedPosts, deletePost, getPendingPosts } =
    usePostStore();

  useEffect(() => {
    getRejectedPosts();
    getPendingPosts();
    profile();
  }, []);

  if (isRejectedPostLoading)
    return <h1 className="text-center mt-10">Loading Posts!</h1>;

  const deletePostFunc = async (id) => {
    await deletePost(id);
    await getRejectedPosts();
    await getPendingPosts();
  };

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      {rejectedPosts.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No Rejected posts available.
        </div>
      ) : (
        rejectedPosts.map((p) => (
          <div
            key={p._id}
            className="flex justify-between items-start border-b pb-4"
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {p.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                <span className="text-sm font-semibold text-gray-700">
                  {p.author.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Link to={`/posts/${p._id}`}>
                <h2 className="text-lg font-semibold text-gray-900 hover:underline">
                  {p.title}
                </h2>
              </Link>
              <div className="mt-2 flex items-center space-x-4 text-gray-500">
                <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                  <LocationEdit className="w-4 h-4" />
                  <span>{p.status}</span>
                </div>
              </div>
              {/* Accept / Reject Buttons */}
              { authUser?.email == p.author.email ? (
                <>
                  <div className="mt-4 flex space-x-2">
                <Link to={`/posts/update/${p._id}`}>
                  <button
                    onClick={() => approvePostFunc(p._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Update Blog
                  </button>
                </Link>
                <button
                  onClick={() => deletePostFunc(p._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
                </>
              ) : <></>}
              
            </div>
            {p.coverImage && (
              <img
                src={
                  p.coverImage
                    ? p.coverImage
                    : `https://cdn-icons-png.flaticon.com/512/1326/1326377.png`
                }
                alt="cover"
                className="w-44 h-24 object-cover rounded-md flex-shrink-0"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RejectedBlog;
