import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Link,
  Play,
  Star,
  Users,
  Film,
  Award,
  BookOpen,
  TrendingUp,
  Eye,
  MessageCircle,
  Heart,
  Bookmark,
  Search,
  Menu,
  X,
} from "lucide-react";

const blogData = [
  {
    id: 1,
    title:
      "Joaquin Phoenix and Pedro Pascal Face Off in New Aster Satire 'Eddington'",
    summary:
      "Controversial auteur Ari Aster revisits the COVID-19 pandemic's most divisive issues in Eddington, an absolutely bonkers Neo-Western satire that's both hilarious and disturbing.",
    image:
      "https://images.unsplash.com/photo-1489599578549-d786a2c4c405?w=800&h=600&fit=crop",
    date: "2024-07-15",
    author: "John Smith",
    readTime: "5 min read",
    tags: ["Western", "Satire", "Review"],
    rating: 8.5,
    views: "15.2k",
    comments: 342,
    video: "https://www.youtube.com/embed/abcd1234",
    content: `
      <p><strong>Eddington</strong> is Ari Aster's most ambitious and controversial film to date. Set in May 2020 in fictional Eddington, New Mexico, <strong>Joaquin Phoenix</strong> stars as antisocial Sheriff Joe Cross, who has problems on the home front with his mentally ill wife Lydia (Emma Stone) and her Qanon-obsessed mother Dawn (Dianne O'Connell). Joe wants to start a family, but his endless Lucas Kyle David internet rabbit holes prevent him from proceeding.</p>
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=400&fit=crop" alt="Eddington Scene" style="border-radius:12px; margin:24px 0;" />
      <p>The film takes a sharp turn when tensions rise between Joe and Eddington mayor Ted Garcia (Pedro Pascal), who briefly dated Lydia in college. This becomes the catalyst for a series of events that spiral completely out of control.</p>
      <h2>A Pandemic Allegory</h2>
      <p>Aster uses the pandemic as a backdrop to explore themes of isolation, conspiracy theories, and social breakdown. The film's Neo-Western setting provides a perfect canvas for examining how communities fracture under pressure.</p>
      <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=400&fit=crop" alt="Desert Landscape" style="border-radius:12px; margin:24px 0;" />
      <h2>Standout Performances</h2>
      <p>Phoenix delivers another powerhouse performance, channeling his intensity into a character that's both sympathetic and terrifying. Pascal provides an excellent counterpoint as the pragmatic mayor trying to hold his town together.</p>
      <p>Emma Stone shines in her supporting role, bringing depth to what could have been a one-dimensional character. Her portrayal of mental illness is both sensitive and authentic.</p>
      <h2>Visual Mastery</h2>
      <p>Cinematographer Pawel Pogorzelski creates a visual language that's both beautiful and unsettling. The desert landscapes become a character in their own right, reflecting the internal states of the protagonists.</p>
      <p>The film's use of practical effects and minimal CGI creates an authentic feel that grounds the more surreal elements of the story.</p>
      <h2>Watch the Official Trailer</h2>
      <div class="aspect-w-16 aspect-h-9" style="margin-bottom:24px;">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/abcd1234" title="Eddington Trailer" frameborder="0" allowfullscreen></iframe>
      </div>
      <h2>Director's Note</h2>
      <p>The director shares: "Eddington is a story about hope and the power of memory. We wanted to create a visual experience that stays with the audience long after the credits roll."</p>
      <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=400&fit=crop" alt="Director's Note" style="border-radius:12px; margin:24px 0;" />
      <h2>Critical Reception</h2>
      <p>Critics have praised Eddington for its bold storytelling and unique visual style. The film currently holds an 89% rating on Rotten Tomatoes.</p>
      <blockquote style="margin:24px 0; padding:16px; background:#222; border-radius:8px; color:#eee;">
        "Aster's Eddington is a fever dream of the pandemic era, blending satire and drama in a way only he can." – IndieWire
      </blockquote>
      <h2>Final Thoughts</h2>
      <p>Eddington is not just a movie—it's an experience. Whether you love it or hate it, you won't forget it.</p>
    `,
  },
  {
    id: 2,
    title: "Inside Out 2: Pixar's Emotional Rollercoaster Returns",
    summary:
      "Pixar's sequel brings new emotions and deeper themes, making it a must-watch for all ages.",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    date: "2024-06-20",
    author: "Sarah Johnson",
    readTime: "4 min read",
    tags: ["Animation", "Family", "Review"],
    rating: 9.2,
    views: "22.1k",
    comments: 567,
    video: "https://www.youtube.com/embed/efgh5678",
    content: `
      <p><strong>Inside Out 2</strong> returns with even more emotional depth and creativity. The film introduces new emotions and explores the challenges of growing up, making it relatable for both kids and adults.</p>
      <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop" alt="Inside Out 2 Scene" style="border-radius:12px; margin:24px 0;" />
      <p>Pixar once again delivers a heartfelt story with stunning animation and clever humor. The sequel expands on the original's themes, offering fresh insights into the complexities of our inner worlds.</p>
      <h2>Watch the Trailer</h2>
      <div class="aspect-w-16 aspect-h-9" style="margin-bottom:24px;">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/efgh5678" title="Inside Out 2 Trailer" frameborder="0" allowfullscreen></iframe>
      </div>
      <h2>Fun Fact</h2>
      <p>Did you know? The new emotion 'Anxiety' was inspired by real stories from children and parents.</p>
      <img src="https://images.unsplash.com/photo-1465101178521-c1a4c8a0f8f9?w=800&h=400&fit=crop" alt="Pixar Animation" style="border-radius:12px; margin:24px 0;" />
      <h2>Critical Reception</h2>
      <p>Inside Out 2 has received universal acclaim, with audiences praising its emotional depth and creative storytelling.</p>
      <blockquote style="margin:24px 0; padding:16px; background:#222; border-radius:8px; color:#eee;">
        "Pixar does it again—Inside Out 2 is a masterpiece of animated storytelling." – Variety
      </blockquote>
      <h2>Final Thoughts</h2>
      <p>Inside Out 2 is a must-watch for families and animation lovers alike.</p>
    `,
  },
  {
    id: 3,
    title: "A Quiet Place: Day One – A Terrifying New Beginning",
    summary:
      "The prequel to the hit horror franchise delivers suspense and heart-stopping moments.",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop",
    date: "2024-06-28",
    author: "Mike Chen",
    readTime: "6 min read",
    tags: ["Horror", "Thriller", "Review"],
    rating: 8.7,
    views: "18.7k",
    comments: 423,
    video: "https://www.youtube.com/embed/ijkl9012",
    content: `
      <p><strong>A Quiet Place: Day One</strong> takes audiences back to the terrifying origins of the alien invasion. The film is packed with suspense, jump scares, and emotional moments that deepen the franchise's lore.</p>
      <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=400&fit=crop" alt="A Quiet Place Scene" style="border-radius:12px; margin:24px 0;" />
      <p>The direction is tight, and the sound design is as chilling as ever. New characters add fresh perspectives, while the relentless tension keeps you on the edge of your seat.</p>
      <h2>Watch the Official Trailer</h2>
      <div class="aspect-w-16 aspect-h-9" style="margin-bottom:24px;">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/ijkl9012" title="A Quiet Place: Day One Trailer" frameborder="0" allowfullscreen></iframe>
      </div>
      <h2>Behind the Scenes</h2>
      <p>Filming took place in real abandoned locations to enhance the sense of dread and realism.</p>
      <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=400&fit=crop" alt="Behind the Scenes" style="border-radius:12px; margin:24px 0;" />
      <h2>Critical Reception</h2>
      <p>Fans and critics alike have praised the film's suspenseful atmosphere and strong performances.</p>
      <blockquote style="margin:24px 0; padding:16px; background:#222; border-radius:8px; color:#eee;">
        "A Quiet Place: Day One is a masterclass in tension and horror." – The Hollywood Reporter
      </blockquote>
      <h2>Final Thoughts</h2>
      <p>If you love horror, don't miss this chilling new chapter in the franchise.</p>
    `,
  },
];

const trendingArticles = [
  {
    id: 4,
    title: "Dune: Part Two Breaks Box Office Records",
    image:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop",
    views: "45.2k",
  },
  {
    id: 5,
    title: "Marvel's Phase 5: What We Know So Far",
    image:
      "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=300&h=200&fit=crop",
    views: "32.8k",
  },
  {
    id: 6,
    title: "Christopher Nolan's Next Project Revealed",
    image:
      "https://images.unsplash.com/photo-1489599578549-d786a2c4c405?w=300&h=200&fit=crop",
    views: "28.1k",
  },
];

const BlogDetail = () => {
  const [currentBlogId, setCurrentBlogId] = useState(1);
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(156);

  const blog = blogData.find((b) => b.id === currentBlogId) || blogData[0];

  const navigate = (path) => {
    if (path === "/blog") {
      console.log("Navigate to blog list");
    } else if (path.startsWith("/blog/")) {
      const id = parseInt(path.split("/")[2]);
      setCurrentBlogId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-15 px-4 min-h-screen relative">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="group flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300">
              <Play
                size={32}
                className="text-white ml-1 group-hover:scale-110 transition-transform"
              />
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-600/80 text-white text-sm font-medium rounded-full backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {blog.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl">
                {blog.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{blog.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>By {blog.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{blog.views}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    {blog.rating}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked
                        ? "bg-red-500 text-white"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isLiked ? "fill-current" : ""}
                    />
                  </button>
                  <span className="text-sm text-gray-400">{likeCount}</span>
                </div>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <Bookmark
                    size={16}
                    className={isBookmarked ? "fill-current" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Video Player */}
            {blog.video && (
              <div className="mb-8">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                  <iframe
                    width="100%"
                    height="100%"
                    src={blog.video}
                    title="Blog Video"
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-invert prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="text-gray-300 leading-relaxed"
              />
            </article>

            {/* Share Section */}
            <div className="mt-12 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-300">
                    Share this article:
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                      <Facebook size={18} className="text-blue-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                      <Twitter size={18} className="text-sky-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                      <Link size={18} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MessageCircle size={16} />
                  <span>{blog.comments} comments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Now */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp size={20} className="text-red-500" />
                <h2 className="text-xl font-bold">Trending Now</h2>
              </div>

              <div className="space-y-4">
                {trendingArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex space-x-4 group cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-20 h-16 bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Eye size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {article.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {blog.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white">{blog.author}</h3>
                  <p className="text-sm text-gray-400">Senior Film Critic</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Award-winning film critic with over 10 years of experience
                covering cinema from festivals to blockbusters.
              </p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                Follow Author
              </button>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-lg border border-red-500/30 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen size={20} className="text-red-400" />
                <h2 className="text-xl font-bold">Stay Updated</h2>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Get the latest movie reviews and industry news delivered to your
                inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                />
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center space-x-2">
            <Film size={24} className="text-red-500" />
            <span>More Reviews</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogData
              .filter((b) => b.id !== blog.id)
              .map((relatedBlog) => (
                <article
                  key={relatedBlog.id}
                  className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/blog/${relatedBlog.id}`)}
                >
                  <div className="relative">
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                        <Star size={12} className="text-yellow-400" />
                        <span className="text-xs text-yellow-400">
                          {relatedBlog.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {relatedBlog.tags?.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {relatedBlog.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{relatedBlog.author}</span>
                        <span>{relatedBlog.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{relatedBlog.views}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;
