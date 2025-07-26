import React from "react";
import { BlogListWithFilter } from "../../../component/BlogFilter";

const BlogPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog</h1>
      <BlogListWithFilter className="px-4" />
    </div>
  );
};

export default BlogPage;
