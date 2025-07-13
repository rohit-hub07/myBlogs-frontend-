import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';
import { User, Mail, Shield, BookOpen, Eye, Calendar, Camera } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, profile, userPosts, isProfileLoading } = useAuthStore();  

  useEffect(() => {
    profile();
  },[]);

  if(isProfileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-6"></div>
          <h1 className="text-2xl font-semibold text-gray-700">Loading Profile...</h1>
        </div>
      </div>
    );
  }

  const getRoleBadgeColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'author':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="text-center md:text-left text-white">
                <h1 className="text-4xl font-bold mb-2">{authUser?.name}</h1>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-indigo-200" />
                    <span className="text-indigo-100">{authUser?.email}</span>
                  </div>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleBadgeColor(authUser?.role)} bg-white`}>
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">{authUser?.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {userPosts?.length || 0}
              </span>
            </div>
          </div>

          <div className="p-8">
            {userPosts && userPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userPosts.map((p) => (
                  <article key={p._id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    {/* Cover Image */}
                    <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100">
                      {p.coverImage ? (
                        <img 
                          src={p.coverImage} 
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-12 h-12 text-indigo-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {p.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <User className="w-4 h-4" />
                        <span>By {p.author.name}</span>
                      </div>

                      <Link 
                        to={`/posts/${p._id}`}
                        className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors duration-200 group/button"
                      >
                        <Eye className="w-4 h-4 group-hover/button:scale-110 transition-transform duration-200" />
                        <span className="font-medium">View Details</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-12 max-w-md mx-auto">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Posts Yet
                  </h3>
                  <p className="text-gray-500">
                    Start creating your first post to share your thoughts with the world!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage