import { Link } from "react-router-dom";
import { EyeIcon } from "lucide-react";

// Updated type to reflect the new metadata structure
export type PostType = {
  id?: string;
  slug: string;
  title: string;
  type: string;
  views?: number; // Added views field
  metadata: {
    date: string;
    title1?: string;
    imagedetail1?: {
      url?: string;
      imgix_url?: string;
    };
    contentdetail1?: string;
    videodetail?: {
      url?: string;
      imgix_url?: string;
    };
    contentdetail2?: string;
    imagedetail2?: {
      url?: string;
      imgix_url?: string;
    };
    contentdetail3?: string;
    category?: string; // Added category field
    views?: number; // Views can also be in metadata
  };
};

export function BlogCard({
  post,
  className,
}: {
  post: PostType;
  className?: string;
}) {
  // Get content from the new content fields
  const content =
    post.metadata.contentdetail1 ||
    post.metadata.contentdetail2 ||
    post.metadata.contentdetail3 ||
    "No content available";

  return (
    <article className={className} data-cosmic-object={post.id || post.slug}>
      <Link
        className="linear group relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-zinc-50 shadow-md 
        shadow-gray-500/20 transition duration-300 hover:bg-white hover:shadow-xl dark:bg-zinc-900 dark:shadow-none dark:hover:bg-zinc-800"
        to={`/blog/${post.slug}`}
      >
        <div className="relative h-full">
          {post.metadata.imagedetail1?.imgix_url ? (
            <img
              alt={post.title}
              className="h-80 w-full object-cover"
              src={`${post.metadata.imagedetail1.imgix_url}?w=1200&auto=format,compression`}
            />
          ) : (
            <div className="h-80 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">No image</span>
            </div>
          )}
        </div>
        <div
          className="flex h-full flex-col justify-between rounded-b-lg border-x border-b 
        border-transparent px-5 py-8 dark:border-gray-900 md:px-8"
        >
          <div className="relative z-10">
            <h2 className="mt-2 text-2xl font-bold text-black dark:text-white">
              {post.title}
            </h2>
            <p className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
              {content ? content.slice(0, 200) + "..." : "No content available"}
            </p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{post.views || post.metadata.views} views</span>
                </div>
                {post.metadata.category && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {post.metadata.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
