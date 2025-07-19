import React, { useEffect } from "react";
import { Loader, User, MessageSquare, Delete } from "lucide-react";
import { useCommentStore } from "../store/useCommentStore";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";

const CommentPage = () => {
  const comments = useCommentStore((state) => state.comments);
  const getAllComments = useCommentStore((state) => state.getAllComments);
  const isCommentLoading = useCommentStore((state) => state.isCommentLoading);
  const deleteComment = useCommentStore((state) => state.deleteComment);
  const authUser = useAuthStore((state) => state.authUser);
  const {id } = useParams();
  useEffect(() => {
    getAllComments(id);
  }, [getAllComments]);

  const deleteCommentFunc = async (cId) => {
    await deleteComment(cId);
    await getAllComments(id);
  };

  if (isCommentLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-white">
        <Loader className="animate-spin w-16 h-16 text-indigo-500 mb-4" />
        <p className="text-xl text-indigo-600">Loading comments…</p>
      </div>
    );

  if (comments.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-50">
        <MessageSquare className="w-12 h-12 text-indigo-300 mb-2 rotate-180" />
        <p className="text-2xl text-indigo-400">No comments yet</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 px-4">
      {comments.map((c) => (
        <div
          key={c._id}
          className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <MessageSquare className="absolute top-4 left-4 w-6 h-6 text-indigo-300" />
          <p className="mt-6 text-gray-800 leading-relaxed">{c.description}</p>
          <div className="flex items-center justify-between mt-4 border-t pt-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {c.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-indigo-600">{c.user.name}</p>
                <time
                  dateTime={c.user.createdAt}
                  className="text-sm text-gray-500"
                >
                  {new Date(c.user.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
            {authUser?._id == c.user._id || authUser?.role == "admin" ? (
              <button
                onClick={() => deleteCommentFunc(c._id)}
                className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                aria-label="Delete comment"
              >
                <Delete className="w-5 h-5" />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentPage;
