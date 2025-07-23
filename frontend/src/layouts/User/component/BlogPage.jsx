import React from "react";
import { BlogList } from "../../../../cosmic/blocks/blog/BlogList";

const BlogPage = () => {
  const query = { type: "posts" };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog</h1>
      <BlogList query={query} className="px-4" />
    </div>
  );
};

export default BlogPage;
