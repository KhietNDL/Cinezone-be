import React, { useRef, useState } from "react";
import {
  Plus,
  X,
  Bold,
  Italic,
  Eye,
  User,
  Star,
  MessageCircle,
  FileText,
  Trash2,
  Sparkles,
  Clock,
  Calendar,
  Tag,
  BarChart3,
  MessageSquare,
  Wand2,
  Save,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  content: "", // Add content field for markdown editor
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const datePickerRef = useRef(null);
  // Stats
  const statsData = [
    {
      title: "Total Blogs",
      value: blogs.length,
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Rated Blogs",
      value: blogs.filter((b) => b.rating).length,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Authors",
      value: [...new Set(blogs.map((b) => b.author))].length,
      icon: User,
      color: "text-purple-600",
    },
    {
      title: "Total Views",
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

  // Markdown keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          insertMarkdown("**", "**", "Bold text");
          break;
        case "i":
          e.preventDefault();
          insertMarkdown("*", "*", "Italic text");
          break;
        case "k":
          e.preventDefault();
          insertMarkdown("[", "](url)", "Link text");
          break;
        case "1":
          e.preventDefault();
          insertAtStart("# ");
          break;
        case "2":
          e.preventDefault();
          insertAtStart("## ");
          break;
        case "3":
          e.preventDefault();
          insertAtStart("### ");
          break;
      }
    }
  };

  const insertMarkdown = (before, after, placeholder = "") => {
    const textarea = document.querySelector('textarea[name="content"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;
    const newText =
      textarea.value.substring(0, start) +
      before +
      selectedText +
      after +
      textarea.value.substring(end);

    setForm((prev) => ({ ...prev, content: newText }));

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertAtStart = (prefix) => {
    const textarea = document.querySelector('textarea[name="content"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = textarea.value.split("\n");
    const currentLineIndex =
      textarea.value.substr(0, start).split("\n").length - 1;

    lines[currentLineIndex] = prefix + lines[currentLineIndex];
    const newText = lines.join("\n");

    setForm((prev) => ({ ...prev, content: newText }));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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

  const handleSubmit = () => {
    if (
      !form.title ||
      !form.summary ||
      !form.image ||
      !form.author ||
      !form.readTime ||
      !form.tags
    ) {
      alert("Please fill in all required information!");
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
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setForm((prev) => ({ ...prev, date: formatDate(selectedDate) }));
    setShowDatePicker(false);
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!form.date) return false;
    const selectedDate = new Date(form.date);
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="w-10 h-10 flex items-center justify-center text-gray-300"
        >
          {new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            -firstDay + i + 1
          ).getDate()}
        </div>
      );
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 ${
            isSelected(day)
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:text-white"
              : isToday(day)
              ? "bg-blue-100 text-blue-700 font-bold"
              : "text-gray-700 hover:scale-105"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80 animate-in zoom-in-95 duration-200"
        ref={datePickerRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <h3 className="font-bold text-lg text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>

          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="w-10 h-8 flex items-center justify-center text-xs font-semibold text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 mb-4">{days}</div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              setForm((prev) => ({ ...prev, date: "" }));
              setShowDatePicker(false);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => {
              setForm((prev) => ({ ...prev, date: formatDate(new Date()) }));
              setShowDatePicker(false);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Today
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
                    placeholder="Search by title or author"
                  />
                </div>
              </div>
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Create New Blog
              </button>
            </div>

            {/* Table */}
            <div className="bg-white p-2 lg:p-4 rounded-lg shadow-sm">
              <div className="hidden sm:block">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left text-slate-500 text-xs sm:text-sm border-b border-gray-200">
                      <th className="py-2 px-2 sm:px-4 text-center">Title</th>
                      <th className="py-2 px-2 sm:px-4 text-center">Author</th>
                      <th className="py-2 px-2 sm:px-4 text-center">Date</th>
                      <th className="py-2 px-2 sm:px-4 text-center">
                        Read Time
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
                          No matching blogs found.
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
                              View/Edit
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-6xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Create New Blog</h2>
                      <p className="text-blue-100 mt-1">
                        Share your thoughts with the world
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(95vh-120px)] p-8 bg-gradient-to-b from-gray-50/50 to-white">
                {/* Basic Information Section */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Title */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <FileText size={16} />
                        Title *
                      </label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Enter an engaging blog title..."
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <User size={16} />
                        Author *
                      </label>
                      <input
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <ImageIcon size={16} />
                        Featured Image *
                      </label>
                      <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Read Time */}
                    <div>
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <Clock size={16} />
                        Read Time *
                      </label>
                      <input
                        name="readTime"
                        value={form.readTime}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="5 minutes"
                      />
                    </div>

                    {/* Date */}
                    <div className="relative">
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <Calendar size={16} />
                        Publish Date
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm text-left flex items-center justify-between hover:border-blue-300"
                        >
                          <span
                            className={
                              form.date ? "text-gray-800" : "text-gray-400"
                            }
                          >
                            {formatDisplayDate(form.date)}
                          </span>
                          <Calendar size={18} className="text-blue-500" />
                        </button>

                        {/* Custom Date Picker Dropdown */}
                        {showDatePicker && (
                          <div className="absolute top-full left-0 mt-2 z-50">
                            {renderCalendar()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags - Full Width */}
                  <div className="mt-6">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                      <Tag size={16} />
                      Tags *
                    </label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="technology, web development, react (comma separated)"
                    />
                  </div>

                  {/* Summary */}
                  <div className="mt-6">
                    <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                      <MessageCircle size={16} />
                      Summary *
                    </label>
                    <textarea
                      name="summary"
                      value={form.summary}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                      placeholder="Write a compelling summary that captures your readers' attention..."
                    />
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 size={20} className="text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Analytics & Ratings
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Optional
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <Star size={16} />
                        Rating (1-5)
                      </label>
                      <input
                        name="rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={form.rating}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="4.5"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <Eye size={16} />
                        Views
                      </label>
                      <input
                        name="views"
                        type="number"
                        value={form.views}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="1000"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                        <MessageSquare size={16} />
                        Comments
                      </label>
                      <input
                        name="comments"
                        type="number"
                        value={form.comments}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="25"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Editor Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Wand2 size={20} className="text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Content Editor
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const templates = {
                              intro: `# Welcome to My Blog\n\n## Introduction\n\nIn this article, we'll explore...\n\n- Key point 1\n- Key point 2\n- Key point 3\n\n> Remember: Great content starts with great ideas!`,
                              review: `# Review: [Product/Movie Name]\n\n## Overview\n**Rating:** ⭐⭐⭐⭐⭐\n\n## Pros\n- Amazing feature 1\n- Great aspect 2\n\n## Cons\n- Minor issue 1\n\n## Final Thoughts\n\nOverall, this is...`,
                              tutorial: `# Step-by-Step Guide: [Title]\n\n## What You'll Need\n- Requirement 1\n- Requirement 2\n\n## Step 1: Getting Started\n\n## Step 2: Implementation\n\n## Step 3: Final Steps\n\n## Conclusion\n\n🎉 Congratulations! You've successfully...`,
                            };
                            const newContent =
                              form.content +
                              (form.content ? "\n\n" : "") +
                              templates[e.target.value];
                            setForm((prev) => ({
                              ...prev,
                              content: newContent,
                            }));
                            e.target.value = "";
                          }
                        }}
                        className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium hover:border-blue-300 transition-colors"
                      >
                        <option value="">📝 Choose Template</option>
                        <option value="intro">🚀 Introduction</option>
                        <option value="review">⭐ Review</option>
                        <option value="tutorial">📚 Tutorial</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, content: "" }))
                        }
                        className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center gap-2"
                        title="Clear content"
                      >
                        <Trash2 size={16} />
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Editor Panel */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText size={20} className="text-blue-600" />
                        <h4 className="font-semibold text-gray-800">
                          Markdown Editor
                        </h4>
                      </div>

                      {/* Enhanced Toolbar */}
                      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-t-xl">
                        <button
                          type="button"
                          onClick={() => insertMarkdown("**bold text**")}
                          className="p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 group"
                          title="Bold (Ctrl+B)"
                        >
                          <Bold
                            size={18}
                            className="text-gray-600 group-hover:text-gray-800"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown("*italic text*")}
                          className="p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 group"
                          title="Italic (Ctrl+I)"
                        >
                          <Italic
                            size={18}
                            className="text-gray-600 group-hover:text-gray-800"
                          />
                        </button>
                        <div className="w-px h-8 bg-gray-300 mx-2"></div>
                        {["# ", "## ", "### "].map((syntax, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => insertMarkdown(syntax)}
                            className="px-3 py-2 text-sm font-bold hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800"
                            title={`Heading ${idx + 1}`}
                          >
                            H{idx + 1}
                          </button>
                        ))}
                        <div className="w-px h-8 bg-gray-300 mx-2"></div>
                        <button
                          type="button"
                          onClick={() => insertMarkdown("- List item")}
                          className="px-3 py-2 text-sm hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800"
                          title="List"
                        >
                          List
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown("> Quote")}
                          className="px-3 py-2 text-sm hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800"
                          title="Quote"
                        >
                          Quote
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown("```\ncode here\n```")}
                          className="px-3 py-2 text-sm hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-800"
                          title="Code Block"
                        >
                          Code
                        </button>
                      </div>

                      <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="# Your Amazing Title

## Introduction
Start writing your content here...

**Bold text** and *italic text* for emphasis.

- Create engaging lists
- Share valuable insights
- Connect with your readers

> Add inspiring quotes to make your content memorable

```javascript
// Include code examples when relevant
console.log('Hello, world!');
```

Happy writing! ✨"
                        className="w-full h-96 px-6 py-4 rounded-b-xl border-l-2 border-r-2 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-mono text-sm resize-none bg-white/90 backdrop-blur-sm"
                      />

                      {/* Enhanced Shortcuts */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800 mb-2">
                            ✨ Pro Tips:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <span>
                              <kbd className="bg-white px-1 rounded">
                                Ctrl+B
                              </kbd>{" "}
                              Bold
                            </span>
                            <span>
                              <kbd className="bg-white px-1 rounded">
                                Ctrl+I
                              </kbd>{" "}
                              Italic
                            </span>
                            <span>
                              <kbd className="bg-white px-1 rounded">
                                Ctrl+K
                              </kbd>{" "}
                              Link
                            </span>
                            <span>
                              <kbd className="bg-white px-1 rounded">
                                Ctrl+1/2/3
                              </kbd>{" "}
                              Headers
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Eye size={20} className="text-green-600" />
                          <h4 className="font-semibold text-gray-800">
                            Live Preview
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {form.content.length} chars
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const wordCount = form.content
                                .split(/\s+/)
                                .filter((word) => word.length > 0).length;
                              const readTime = Math.ceil(wordCount / 200);
                              setForm((prev) => ({
                                ...prev,
                                readTime: `${readTime} minutes`,
                              }));
                            }}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center gap-2"
                            title="Auto calculate reading time"
                          >
                            <Clock size={14} />
                            Auto Time
                          </button>
                        </div>
                      </div>

                      <div className="h-96 p-6 rounded-xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm overflow-y-auto">
                        {form.content ? (
                          <div className="prose prose-sm max-w-none">
                            {/* Simplified preview - in real app, use ReactMarkdown */}
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                              {form.content}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="p-4 bg-gray-50 rounded-full mb-4">
                              <Eye size={32} />
                            </div>
                            <p className="text-center text-sm">
                              Your content preview will appear here
                              <br />
                              <span className="text-xs">
                                Start typing to see the magic ✨
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <Save size={20} />
                    Publish Blog
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-3"
                  >
                    <X size={20} />
                    Cancel
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
                    {editingBlockIndex >= 0 ? "Edit Content" : "Add Content"}
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
                      Content Type
                    </label>
                    <select
                      name="type"
                      value={currentContentBlock.type}
                      onChange={handleContentBlockChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Title
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
                          ? "Image URL"
                          : "Video URL"}
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
                      Content
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
                      Formatting
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
                          <span>Bold</span>
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
                          <span>Italic</span>
                        </label>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-600">
                          Font Size
                        </label>
                        <select
                          value={currentContentBlock.formatting.size}
                          onChange={(e) =>
                            handleFormattingChange("size", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        >
                          <option value="small">Small</option>
                          <option value="normal">Normal</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 text-sm text-gray-600">
                          Text Case
                        </label>
                        <select
                          value={currentContentBlock.formatting.case}
                          onChange={(e) =>
                            handleFormattingChange("case", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        >
                          <option value="normal">Normal</option>
                          <option value="uppercase">UPPERCASE</option>
                          <option value="lowercase">lowercase</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block mb-1 text-sm text-gray-600">
                          Alignment
                        </label>
                        <select
                          value={currentContentBlock.formatting.align}
                          onChange={(e) =>
                            handleFormattingChange("align", e.target.value)
                          }
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
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
                    {editingBlockIndex >= 0 ? "Update" : "Add"}
                  </button>
                  <button
                    onClick={() => {
                      setShowContentForm(false);
                      setCurrentContentBlock(initialContentBlock);
                      setEditingBlockIndex(-1);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold"
                  >
                    Cancel
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
