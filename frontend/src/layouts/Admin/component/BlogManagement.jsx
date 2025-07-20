import React, { useState } from "react";
import {
  Plus,
  X,
  Bold,
  Italic,
  Eye,
  Calendar,
  User,
  Clock,
  Star,
  MessageCircle,
} from "lucide-react";

const initialForm = {
  title: "",
  summary: "",
  image: "",
  date: "",
  author: "",
  readTime: "",
  tags: "",
  rating: "",
  views: "",
  comments: "",
  contentBlocks: [],
};

const initialContentBlock = {
  type: "text",
  title: "",
  content: "",
  media: "",
  formatting: {
    bold: false,
    italic: false,
    size: "normal",
    case: "normal",
    align: "left",
  },
};

const BlogManagement = () => {
  const [form, setForm] = useState(initialForm);
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentContentBlock, setCurrentContentBlock] =
    useState(initialContentBlock);
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingBlockIndex, setEditingBlockIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");

  // Stats
  const statsData = [
    {
      title: "Tổng số Blog",
      value: blogs.length,
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Blog có đánh giá",
      value: blogs.filter((b) => b.rating).length,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Tác giả",
      value: [...new Set(blogs.map((b) => b.author))].length,
      icon: User,
      color: "text-purple-600",
    },
    {
      title: "Tổng lượt xem",
      value: blogs.reduce((acc, b) => acc + (parseInt(b.views) || 0), 0),
      icon: Eye,
      color: "text-green-600",
    },
  ];

  // Search
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentBlockChange = (e) => {
    const { name, value } = e.target;
    setCurrentContentBlock((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormattingChange = (property, value) => {
    setCurrentContentBlock((prev) => ({
      ...prev,
      formatting: { ...prev.formatting, [property]: value },
    }));
  };

  const addContentBlock = () => {
    if (editingBlockIndex >= 0) {
      const updatedBlocks = [...form.contentBlocks];
      updatedBlocks[editingBlockIndex] = currentContentBlock;
      setForm((prev) => ({ ...prev, contentBlocks: updatedBlocks }));
      setEditingBlockIndex(-1);
    } else {
      setForm((prev) => ({
        ...prev,
        contentBlocks: [...prev.contentBlocks, currentContentBlock],
      }));
    }
    setCurrentContentBlock(initialContentBlock);
    setShowContentForm(false);
  };

  const editContentBlock = (index) => {
    setCurrentContentBlock(form.contentBlocks[index]);
    setEditingBlockIndex(index);
    setShowContentForm(true);
  };

  const removeContentBlock = (index) => {
    setForm((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (
      !form.title ||
      !form.summary ||
      !form.image ||
      !form.author ||
      !form.readTime ||
      !form.tags
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    setBlogs((prev) => [
      ...prev,
      {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()),
        date: form.date || new Date().toISOString().slice(0, 10),
      },
    ]);
    setForm(initialForm);
    setShowForm(false);
  };

  const getFormattedStyle = (formatting) => ({
    fontWeight: formatting.bold ? "bold" : "normal",
    fontStyle: formatting.italic ? "italic" : "normal",
    fontSize:
      formatting.size === "small"
        ? "0.875rem"
        : formatting.size === "large"
        ? "1.125rem"
        : "1rem",
    textTransform: formatting.case,
    textAlign: formatting.align,
  });

  const renderContentBlock = (block, index) => {
    const style = getFormattedStyle(block.formatting);
    return (
      <div
        key={index}
        className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
      >
        {block.title && (
          <h4 className="font-semibold text-gray-800 mb-2" style={style}>
            {block.title}
          </h4>
        )}
        {block.type === "image" && block.media && (
          <img
            src={block.media}
            alt={block.title}
            className="w-full max-w-md mx-auto rounded-lg mb-2"
          />
        )}
        {block.type === "video" && block.media && (
          <div className="aspect-video mb-2 max-w-md mx-auto">
            <iframe
              width="100%"
              height="100%"
              src={block.media}
              title={block.title}
              frameBorder="0"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        )}
        {block.content && (
          <div style={style} className="text-gray-700 whitespace-pre-wrap">
            {block.content}
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => editContentBlock(index)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => removeContentBlock(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-[90%] md:w-[95%] lg:w-[95%] max-w-7xl space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 w-full">
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-slate-500">
                      {stat.title}
                    </p>
                    <div className={`p-1.5 rounded-full ${stat.color}`}>
                      <IconComponent size={20} className="sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  <p className="font-bold text-base sm:text-[19px] mt-1">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Search and Filter */}
          <div className="w-full py-3 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <div className="flex items-center p-2 px-3 w-full sm:w-80 rounded-xl bg-white shadow-sm">
                  <Eye size={20} className="shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 focus:outline-none w-full text-sm"
                    placeholder="Tìm kiếm theo tiêu đề hoặc tác giả"
                  />
                </div>
              </div>
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Tạo Blog Mới
              </button>
            </div>

            {/* Table */}
            <div className="bg-white p-2 lg:p-4 rounded-lg shadow-sm">
              <div className="hidden sm:block">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left text-slate-500 text-xs sm:text-sm border-b border-gray-200">
                      <th className="py-2 px-2 sm:px-4 text-center">Tiêu đề</th>
                      <th className="py-2 px-2 sm:px-4 text-center">Tác giả</th>
                      <th className="py-2 px-2 sm:px-4 text-center">Ngày</th>
                      <th className="py-2 px-2 sm:px-4 text-center">
                        Thời gian đọc
                      </th>
                      <th className="py-2 px-2 sm:px-4 text-center">Tags</th>
                      <th className="py-2 px-2 sm:px-4 text-center">Rating</th>
                      <th className="py-2 px-2 sm:px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBlogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-400"
                        >
                          <MessageCircle size={48} className="mx-auto mb-2" />
                          Không có blog nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredBlogs.map((blog, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-200 hover:bg-slate-100 text-xs sm:text-sm"
                        >
                          <td className="py-2 px-2 sm:px-4 text-center font-semibold text-gray-800">
                            {blog.title}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            {blog.author}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            {blog.date}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            {blog.readTime}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            {blog.tags?.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mr-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            {blog.rating ? (
                              <span className="font-bold text-yellow-600">
                                {blog.rating}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            <button
                              onClick={() => setShowForm(true)}
                              className="text-blue-600 cursor-pointer hover:text-blue-800 p-2 rounded-xl border-solid border-slate-100 sm:p-2"
                            >
                              Xem/Sửa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Tạo Blog Mới
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Tiêu đề *
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Tác giả *
                    </label>
                    <input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-medium text-gray-700">
                      Tóm tắt *
                    </label>
                    <textarea
                      name="summary"
                      value={form.summary}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Ảnh đại diện *
                    </label>
                    <input
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Ngày
                    </label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Thời gian đọc *
                    </label>
                    <input
                      name="readTime"
                      value={form.readTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Tags (phân cách bằng dấu phẩy) *
                    </label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                {/* Content Blocks Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Nội dung
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowContentForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Thêm nội dung
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.contentBlocks.map((block, index) =>
                      renderContentBlock(block, index)
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex-1"
                  >
                    Lưu Blog
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold"
                    onClick={() => setShowForm(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Block Form Modal */}
        {showContentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingBlockIndex >= 0
                      ? "Chỉnh sửa nội dung"
                      : "Thêm nội dung"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowContentForm(false);
                      setCurrentContentBlock(initialContentBlock);
                      setEditingBlockIndex(-1);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Loại nội dung
                    </label>
                    <select
                      name="type"
                      value={currentContentBlock.type}
                      onChange={handleContentBlockChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="text">Văn bản</option>
                      <option value="image">Hình ảnh</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Tiêu đề
                    </label>
                    <input
                      name="title"
                      value={currentContentBlock.title}
                      onChange={handleContentBlockChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {(currentContentBlock.type === "image" ||
                    currentContentBlock.type === "video") && (
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        {currentContentBlock.type === "image"
                          ? "URL Hình ảnh"
                          : "URL Video"}
                      </label>
                      <input
                        name="media"
                        value={currentContentBlock.media}
                        onChange={handleContentBlockChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Nội dung
                    </label>
                    <textarea
                      name="content"
                      value={currentContentBlock.content}
                      onChange={handleContentBlockChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {/* Formatting Options */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Định dạng
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={currentContentBlock.formatting.bold}
                            onChange={(e) =>
                              handleFormattingChange("bold", e.target.checked)
                            }
                            className="rounded"
                          />
                          <Bold size={16} />
                          <span>Đậm</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={currentContentBlock.formatting.italic}
                            onChange={(e) =>
                              handleFormattingChange("italic", e.target.checked)
                            }
                            className="rounded"
                          />
                          <Italic size={16} />
                          <span>Nghiêng</span>
                        </label>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-600">
                          Cỡ chữ
                        </label>
                        <select
                          value={currentContentBlock.formatting.size}
                          onChange={(e) =>
                            handleFormattingChange("size", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        >
                          <option value="small">Nhỏ</option>
                          <option value="normal">Bình thường</option>
                          <option value="large">Lớn</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-600">
                          Kiểu chữ
                        </label>
                        <select
                          value={currentContentBlock.formatting.case}
                          onChange={(e) =>
                            handleFormattingChange("case", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        >
                          <option value="normal">Bình thường</option>
                          <option value="uppercase">HOA</option>
                          <option value="lowercase">thường</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block mb-1 text-sm text-gray-600">
                          Căn chỉnh
                        </label>
                        <select
                          value={currentContentBlock.formatting.align}
                          onChange={(e) =>
                            handleFormattingChange("align", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        >
                          <option value="left">Trái</option>
                          <option value="center">Giữa</option>
                          <option value="right">Phải</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={addContentBlock}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex-1"
                  >
                    {editingBlockIndex >= 0 ? "Cập nhật" : "Thêm"}
                  </button>
                  <button
                    onClick={() => {
                      setShowContentForm(false);
                      setCurrentContentBlock(initialContentBlock);
                      setEditingBlockIndex(-1);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
