import React, { useEffect } from "react";
import { usePostStore } from "../store/usePostStore";
import { LoaderCircle, CalendarDays, Clock, User2, Tag } from "lucide-react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogDetailPage = () => {
  const { post, isPostLoading, getPostById } = usePostStore();
  const { id } = useParams();

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

      {/* Meta Info */}
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

      {/* Cover Image */}
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
    </div>
  );
};

export default BlogDetailPage;
