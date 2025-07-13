import React from "react";
import PendingBlogPage from "../components/PendingBlog";
import RejectedBlog from "../components/RejectedBlogs";

const ReviewPage = () => {
  return (
    <>
      <PendingBlogPage /> 
      <RejectedBlog />
    </>
  );
};

export default ReviewPage;
