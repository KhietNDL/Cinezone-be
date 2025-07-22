import { useState, useEffect } from "react";
import { BlogCard, PostType } from "./BlogCard";
import { cosmic } from "../../client";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Khai báo component dạng client component React
export function BlogList({
  className,

  noWrap = false,
}: {
  query: any;
  sort?: string;
  limit?: number;
  skip?: number;
  className?: string;
  status?: "draft" | "published" | "any";
  noWrap?: boolean;
}) {
  const [movies, setMovies] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const navigate = useNavigate();

  // IDs của các movies bạn muốn hiển thị
  const movieIds = [
    "687dc178d5e8b76ec441ba89",
    "687e0313d5e8b76ec441ba9b",
    // Thêm các ID khác nếu có
  ];

  const handleBackToHome = () => {
    navigate("/");
  };

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
              .depth(1);

            return object;
          })
        );

        setMovies(moviesData);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  function MoviePosts({ posts }: { posts: PostType[] }) {
    return (
      <>
        {posts.map((post: PostType) => {
          return <BlogCard key={post.id} post={post} />;
        })}
      </>
    );
  }

  if (noWrap) return <MoviePosts posts={movies} />;

  return (
    <div className="pt-10 pb-15 px-4 min-h-screen bg-slate-900">
      {/* Back Button and Title */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 
                   border border-slate-700/50 hover:border-[#6a57f5]/30 
                   rounded-xl px-4 py-3 transition-all duration-300 group
                   shadow-lg hover:shadow-xl hover:shadow-[#6a57f5]/10"
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg 
                        bg-[#6a57f5]/20 group-hover:bg-[#6a57f5]/30 
                        transition-all duration-300"
          >
            <FaArrowLeft
              size={16}
              className="text-[#6a57f5] group-hover:translate-x-[-2px] transition-transform duration-300"
            />
          </div>
          <span className="text-white font-medium group-hover:text-[#6a57f5] transition-colors duration-300">
            Back to Home
          </span>
        </button>

        <h1 className="text-3xl font-bold text-white">Movie Blog</h1>

        {/* Empty div for spacing */}
        <div className="w-[120px]"></div>
      </div>

      <div
        className={`m-auto grid max-w-[900px] grid-cols-2 gap-4 ${className}`}
      >
        <MoviePosts posts={movies} />
      </div>
    </div>
  );
}
