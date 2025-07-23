import React, { useState, useEffect } from "react";
import { getAllCategories, getBlogsByCategory } from "../services/blogService";
import { BlogCard, PostType } from "../../cosmic/blocks/blog/BlogCard";
import { cosmic } from "../../cosmic/client";

export function BlogFilter({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const allCategories = await getAllCategories();
        setCategories(["all", ...allCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    if (onFilterChange) {
      onFilterChange(category);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {category === "all" ? "All Categories" : category}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BlogListWithFilter({ className }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchBlogs(selectedCategory);
  }, [selectedCategory]);

  const fetchBlogs = async (category) => {
    setLoading(true);
    try {
      let blogData;
      if (category === "all") {
        // Fetch all blogs
        const { objects } = await cosmic.objects
          .find({
            type: "posts",
          })
          .props("id,slug,title,metadata,views")
          .status("published")
          .limit(20);
        blogData = objects;
      } else {
        // Fetch blogs by category
        blogData = await getBlogsByCategory(category, 20);
      }
      setBlogs(blogData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className={className}>
      <BlogFilter onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div>Loading blogs...</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} post={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
