import { cosmic } from "../../cosmic/client";

// Service để tăng lượt view của blog
export const incrementBlogView = async (blogId) => {
  try {
    // Lấy thông tin blog hiện tại
    const { object: currentBlog } = await cosmic.objects
      .findOne({
        id: blogId,
      })
      .props("id,views,metadata");

    // Tính toán view mới
    const currentViews = currentBlog.views || currentBlog.metadata.views || 0;
    const newViews = currentViews + 1;

    // Cập nhật lượt view
    await cosmic.objects.updateOne(blogId, {
      views: newViews,
      metadata: {
        ...currentBlog.metadata,
        views: newViews,
      },
    });

    return newViews;
  } catch {
    return null;
  }
};

// Service để lấy các blog theo category
export const getBlogsByCategory = async (category, limit = 5) => {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: "posts",
        "metadata.category": category,
      })
      .props("id,slug,title,metadata,views")
      .limit(limit)
      .status("published");

    return objects;
  } catch {
    return [];
  }
};

// Service để lấy tất cả categories
export const getAllCategories = async () => {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: "posts",
      })
      .props("metadata.category")
      .status("published");

    // Lấy tất cả categories duy nhất
    const categories = [
      ...new Set(
        objects
          .map((obj) => obj.metadata.category)
          .filter((category) => category && category.trim() !== "")
      ),
    ];

    return categories;
  } catch {
    return [];
  }
};
