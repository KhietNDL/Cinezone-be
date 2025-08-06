import { useState, useEffect } from "react";
import { BlogCard, PostType } from "./BlogCard";
import { cosmic } from "../../client";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../src/component/BackButton";

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
        // Lấy tất cả blog có type là "movies"
        const { objects } = await cosmic.objects
          .find({
            type: "movies", // hoặc "movies" nếu bạn lưu blog dưới type này
          })
          .props("id,slug,title,metadata")
          .depth(1);

        setMovies(objects);
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
    <div className="pt-10 pb-15 px-4 min-h-screen bg-gradient-to-b from-black via-gray-900 via-50% via-purple-950/50 to-slate-900">
      {/* Back Button and Title */}
      <div className="flex items-center justify-between mb-8">
        <BackButton />

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
