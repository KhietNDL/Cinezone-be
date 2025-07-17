import React from "react";
import { useNavigate } from "react-router-dom";

const blogData = [
  {
    id: 1,
    title: "Eddington Review: A Beautiful, Bittersweet Sci-Fi Drama",
    summary:
      "Eddington is a moving, visually stunning sci-fi drama about love, loss, and the nature of time.",
    image:
      "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/07/eddington-movie-review.jpg",
    url: "https://movieweb.com/eddington-review/",
    date: "2024-07-15",
    content: `
      <p><b>Eddington</b> is a moving, visually stunning sci-fi drama about love, loss, and the nature of time. The film follows a brilliant scientist who discovers a way to communicate across time, leading to a bittersweet journey of hope and heartbreak.</p>
      <p>With breathtaking visuals and a haunting score, Eddington explores the limits of human connection and the sacrifices we make for those we love. The performances are top-notch, especially from the lead actor, whose portrayal of grief and determination anchors the film.</p>
      <p>This is a must-watch for fans of thoughtful, emotional science fiction.</p>
    `,
  },
  {
    id: 2,
    title: "Inside Out 2: Pixar’s Emotional Rollercoaster Returns",
    summary:
      "Pixar’s sequel brings new emotions and deeper themes, making it a must-watch for all ages.",
    image:
      "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/06/inside-out-2-review.jpg",
    url: "https://movieweb.com/inside-out-2-review/",
    date: "2024-06-20",
    content: `
      <p><b>Inside Out 2</b> returns with even more emotional depth and creativity. The film introduces new emotions and explores the challenges of growing up, making it relatable for both kids and adults.</p>
      <p>Pixar once again delivers a heartfelt story with stunning animation and clever humor. The sequel expands on the original’s themes, offering fresh insights into the complexities of our inner worlds.</p>
      <p>It’s a joyful, tear-jerking ride that will leave you thinking long after the credits roll.</p>
    `,
  },
  {
    id: 3,
    title: "A Quiet Place: Day One – A Terrifying New Beginning",
    summary:
      "The prequel to the hit horror franchise delivers suspense and heart-stopping moments.",
    image:
      "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2024/06/a-quiet-place-day-one-review.jpg",
    url: "https://movieweb.com/a-quiet-place-day-one-review/",
    date: "2024-06-28",
    content: `
      <p><b>A Quiet Place: Day One</b> takes audiences back to the terrifying origins of the alien invasion. The film is packed with suspense, jump scares, and emotional moments that deepen the franchise’s lore.</p>
      <p>The direction is tight, and the sound design is as chilling as ever. New characters add fresh perspectives, while the relentless tension keeps you on the edge of your seat.</p>
      <p>Fans of the series will not be disappointed by this gripping prequel.</p>
    `,
  },
];

const BlogPage = () => {
  const navigate = useNavigate();

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="pt-24 pb-15 px-4 min-h-screen bg-slate-900">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogData.map((blog) => (
          <div
            key={blog.id}
            className="bg-slate-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleBlogClick(blog.id)}
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-300 text-sm mb-2">{blog.summary}</p>
              <div className="text-xs text-gray-400">{blog.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
