// app/blog/[slug]/page.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NotFound from "./NotFound";
import { cosmic } from "../../client";
import { getFormattedDateFromString } from "../../utils";
import {
  incrementBlogView,
  getBlogsByCategory,
} from "../../../src/services/blogService";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  ShareIcon,
  EyeIcon,
} from "lucide-react";

export function SingleBlog({
  query,
  className,
  status,
}: {
  query: any;
  className?: string;
  status?: "draft" | "published" | "any";
}) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [currentViews, setCurrentViews] = useState(0);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const { object } = await cosmic.objects
          .findOne(query)
          .props("id,slug,title,metadata,views")
          .depth(1)
          .status(status ? status : "published");

        setBlog(object);

        // Tăng view count
        const newViews = await incrementBlogView(object.id);
        if (newViews) {
          setCurrentViews(newViews);
        } else {
          setCurrentViews(object.views || object.metadata.views || 0);
        }

        // Calculate reading time
        if (object) {
          const content = [
            object.metadata.contentdetail1,
            object.metadata.contentdetail2,
            object.metadata.contentdetail3,
          ]
            .filter(Boolean)
            .join(" ");

          const wordsPerMinute = 200;
          const wordCount = content.split(/\s+/).length;
          const time = Math.ceil(wordCount / wordsPerMinute);
          setReadingTime(time);

          // Lấy các bài blog liên quan theo category
          if (object.metadata.category) {
            const related = await getBlogsByCategory(
              object.metadata.category,
              3
            );
            // Lọc bỏ bài hiện tại
            const filteredRelated = related.filter(
              (item) => item.id !== object.id
            );
            setRelatedBlogs(filteredRelated);
          }
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [query, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-lg font-medium text-slate-600 dark:text-slate-300">
            Loading article...
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    if (error?.status === 404) return <NotFound />;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <div className="text-lg font-medium text-red-500">
            Error loading blog post
          </div>
        </div>
      </div>
    );
  }

  const date = getFormattedDateFromString(
    blog.metadata.date || blog.metadata.published_date
  );

  const content =
    blog.metadata.contentdetail1 ||
    blog.metadata.contentdetail2 ||
    blog.metadata.contentdetail3 ||
    "No content available";

  const mainImage =
    blog.metadata.imagedetail1?.imgix_url || blog.metadata.imagedetail1?.url;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${className}`}
    >
      {/* Hero Section */}
      <div className="relative">
        {mainImage && (
          <div className="relative h-[50vh] md:h-[80vh] overflow-hidden">
            <img
              src={`${mainImage}?w=2000&auto=format,compression`}
              alt={blog.title}
              className="w-full h-full object-fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Back Button Overlay */}
            <div className="absolute top-30 left-6 z-10">
              <Link
                to="/blog"
                className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </div>
          </div>
        )}

        {!mainImage && (
          <div className="pt-10 pb-10 px-6">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/blog"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 mb-8"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="relative -mt-12 md:-mt-16 z-10 px-6">
        <article className="max-w-4xl mx-auto">
          {/* Article Header Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 mb-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{date}</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4" />
                <span>{currentViews} views</span>
              </div>
              {blog.metadata.category && (
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                  {blog.metadata.category}
                </div>
              )}
              <button className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ShareIcon className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {(blog.metadata.title1 || blog.title).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {blog.metadata.title1 || "Author"}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Published on {date}
                </div>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-8 md:p-12" data-cosmic-object={blog.id}>
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                {/* Main Content */}
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg space-y-6">
                  <div className="whitespace-pre-wrap first-letter:text-6xl first-letter:font-bold first-letter:text-blue-600 dark:first-letter:text-blue-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                    {content}
                  </div>

                  {blog.metadata.contentdetail2 && (
                    <div className="whitespace-pre-wrap">
                      {blog.metadata.contentdetail2}
                    </div>
                  )}

                  {blog.metadata.imagedetail2?.imgix_url && (
                    <div className="my-10 -mx-8 md:-mx-12">
                      <img
                        src={`${blog.metadata.imagedetail2.imgix_url}?w=1200&auto=format,compression`}
                        alt="Additional content"
                        className="w-full"
                      />
                    </div>
                  )}

                  {blog.metadata.contentdetail3 && (
                    <div className="whitespace-pre-wrap">
                      {blog.metadata.contentdetail3}
                    </div>
                  )}

                  {blog.metadata.videodetail?.url && (
                    <div className="my-10 -mx-8 md:-mx-12">
                      <video controls className="w-full" poster={mainImage}>
                        <source
                          src={blog.metadata.videodetail.url}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <div className="mt-12 mb-8">
            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                  Related Articles
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.id}
                      to={`/blog/${relatedBlog.slug}`}
                      className="group block p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      {relatedBlog.metadata.imagedetail1?.imgix_url && (
                        <img
                          src={`${relatedBlog.metadata.imagedetail1.imgix_url}?w=400&auto=format,compression`}
                          alt={relatedBlog.title}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <EyeIcon className="w-3 h-3" />
                        <span>
                          {relatedBlog.views || relatedBlog.metadata.views || 0}{" "}
                          views
                        </span>
                        {relatedBlog.metadata.category && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                            {relatedBlog.metadata.category}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-center border border-blue-100 dark:border-slate-600">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Thanks for reading!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Want to read more articles like this?
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Explore More Articles
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
