import { useState, useEffect } from "react"
import { BlogCard, PostType } from "./BlogCard"
import { cosmic } from "../../client"

// Khai báo component dạng client component React
export function BlogList({
  query,
  sort,
  limit,
  skip,
  className,
  status,
  noWrap = false,
}: {
  query: any
  sort?: string
  limit?: number
  skip?: number
  className?: string
  status?: "draft" | "published" | "any"
  noWrap?: boolean
}) {
  const [movies, setMovies] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | Error>(null)

  // IDs của các movies bạn muốn hiển thị
  const movieIds = [
    "6879e3ecd5e8b76ec441b701",
    // Thêm các ID khác nếu có
  ]

  useEffect(() => {
    async function fetchMovies() {
      try {
        // Fetch tất cả các movies theo ID
        const moviesData = await Promise.all(
          movieIds.map(async (id) => {
            const { object } = await cosmic.objects
              .findOne({
                id: id,
              })
              .props("id,slug,title,metadata")
              .depth(1)

            return object
          })
        )

        setMovies(moviesData)
      } catch (err) {
        console.error("Error fetching movies:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  function MoviePosts({ posts }: { posts: PostType[] }) {
    return (
      <>
        {posts.map((post: PostType) => {
          return <BlogCard key={post.id} post={post} />
        })}
      </>
    )
  }

  if (noWrap) return <MoviePosts posts={movies} />

  return (
    <div className={`m-auto grid max-w-[900px] grid-cols-2 gap-4 ${className}`}>
      <MoviePosts posts={movies} />
    </div>
  )
}
