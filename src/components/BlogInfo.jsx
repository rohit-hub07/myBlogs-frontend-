import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useForm } from "react-hook-form";
import { usePostStore } from "../store/usePostStore";
import { useCommentStore } from "../store/useCommentStore";
import {
  CalendarDays,
  Clock,
  LoaderCircle,
  PlusCircle,
  Tag,
  User2,
  X
} from "lucide-react";
import { useParams } from "react-router-dom";

const BlogInfo = () => {
  const { post, isPostLoading, getPostById } = usePostStore();
  const { addComment,getAllComments } = useCommentStore();
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { description: "" }
  });

  useEffect(() => {
    getPostById(id);
  }, [id]);

  if (isPostLoading || !post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      await addComment(id, data);
      await getAllComments(id);
      await getPostById(id);
      reset(); // Clear the form
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      // Optionally show user feedback
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {/* Add your blog content / metadata here */}
      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 space-x-4">
        <div className="flex items-center space-x-1">
          <User2 className="w-4 h-4" />
          <span>{post.author?.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{post.readTime} min read</span>
        </div>
      </div>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt="cover"
          className="w-full h-96 object-cover rounded-xl mb-8"
        />
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Tags:
          </h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add comment</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                reset(); // Optional: reset on close
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add a new comment</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <textarea
                rows={4}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Your comment..."
                {...register("description", { required: "Comment is required" })}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">
                  {errors.description.message}
                </p>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogInfo;

