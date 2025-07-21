import { Link } from "react-router-dom"
import { getFormattedDateFromString } from "../../utils"

// Cập nhật type để phản ánh cấu trúc API thực tế
export type PostType = {
  id?: string
  slug: string
  title: string
  type: string
  metadata: {
    categories?: any[] // Optional
    khung_long?: {
      url?: string
      imgix_url?: string
    }
    videokhungloong?: {
      url?: string
      imgix_url?: string
    }
    khunglonggg?: string
    day_la_khug_long?: string
    khung_long_t_rex?: string
    content?: string // Optional
    author?: { // Optional
      title?: string
      metadata?: {
        image?: {
          imgix_url?: string
        }
      }
    }
    published_date?: string // Optional
  }
}

export function BlogCard({
  post,
  className,
}: {
  post: PostType
  className?: string
}) {
  // Lấy nội dung từ một trong các trường văn bản có sẵn
  const content = post.metadata.khunglonggg || 
                 post.metadata.day_la_khug_long || 
                 post.metadata.khung_long_t_rex || 
                 post.metadata.content || 
                 'No content available';
  
  return (
    <article className={className} data-cosmic-object={post.id || post.slug}>
      <Link
        className="linear group relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-zinc-50 shadow-md 
        shadow-gray-500/20 transition duration-300 hover:bg-white hover:shadow-xl dark:bg-zinc-900 dark:shadow-none dark:hover:bg-zinc-800"
        to={`/blog/${post.slug}`}
      >
        <div className="relative h-full">
          {post.metadata.khung_long?.imgix_url ? (
            <img
              alt={post.title}
              className="h-80 w-full object-cover"
              src={`${post.metadata.khung_long.imgix_url}?w=1200&auto=format,compression`}
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
            {/* Chỉ hiển thị categories nếu có */}
            {post.metadata.categories && Array.isArray(post.metadata.categories) && 
              post.metadata.categories.map((category: any) => (
                <span
                  className="mr-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                  key={category.slug || Math.random().toString()}
                >
                  {category.title}
                </span>
              ))
            }
            <h2 className="mt-2 text-2xl font-bold text-black dark:text-white">
              {post.title}
            </h2>
            <p className="line-clamp-3 w-full pt-3 text-gray-600 dark:text-gray-400">
              {content ? content.slice(0, 200) + '...' : 'No content available'}
            </p>
          </div>
          
          {/* Chỉ hiển thị author nếu có */}
          {post.metadata.author ? (
            <div
              className="relative z-10 flex w-full flex-col items-start justify-between 
            space-y-10 pt-8 md:flex-row md:items-center md:space-y-0"
            >
              <div className="flex w-full items-center gap-10 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  {post.metadata.author.metadata?.image?.imgix_url ? (
                    <div className="flex items-center justify-center overflow-hidden 
                    rounded-full bg-gray-200 dark:bg-gray-800">
                      <img
                        alt={post.metadata.author.title || "Author"}
                        src={`${post.metadata.author.metadata.image.imgix_url}?w=400&auto=format,compression`}
                        className="h-[50px] w-[50px] rounded-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div>
                    <div>
                      <span className="font-semibold">
                        {post.metadata.author.title || "Unknown"}
                      </span>
                      {post.metadata.published_date && (
                        <>
                          <br />
                          {getFormattedDateFromString(post.metadata.published_date)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
