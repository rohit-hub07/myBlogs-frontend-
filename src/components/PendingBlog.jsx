import { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { Link } from "react-router-dom";
import { LocationEdit } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const PendingBlogPage = () => {
  const { authUser } = useAuthStore();
  const {
    pendingPosts,
    isPendingPostLoading,
    getPendingPosts,
    approvePostById,
    rejectPostById,
  } = usePostStore();

  useEffect(() => {
    getPendingPosts();
  }, [getPendingPosts]);

  if (isPendingPostLoading)
    return <h1 className="text-center mt-10">Loading Posts!</h1>;

  const rejectPostFunc = async (id) => {
    // console.log("id inside of rejectfunc: ",id);
    await rejectPostById(id);
    await getPendingPosts();
    // navigate("/posts/pending-blogs");
  };

  const approvePostFunc = async (id) => {
    // console.log("id inside of approveFunc: ",id);
    await approvePostById(id);
    await getPendingPosts();
    // navigate("/posts/pending-blogs");
  };

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      {pendingPosts?.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No pending posts available.
        </div>
      ) : (
        pendingPosts?.map((p) => (
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
              {authUser.role === "admin" ? (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => approvePostFunc(p._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectPostFunc(p._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <></>
              )}
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

export default PendingBlogPage;
