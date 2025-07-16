import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { getMovieById } from '../../../services/APIForStaff/API';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { LuChartBar } from "react-icons/lu";
import { GiTrophyCup } from "react-icons/gi";
import { getCurrentMovies } from '../../../services/APIForStaff/API';
import ItemCard from "../component/ItemCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import '../component/SwiperButton.css'
import { toast } from 'react-toastify';
//import { getDaysByMovieName, getVersionsAndTimesByMovieAndDay } from '../../../services/APIForStaff/API';

export default function MovieDetail() {

  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imageError, setImageError] = useState({});
  const [recommended, setRecommended] = useState([]);
  const { slug } = useParams();

  const toSlug = (str) =>
    str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  async function fetchMovie() {
    setLoading(true);
    try {
      const res = await getCurrentMovies();
      if (res.data) {
        const found = res.data.find(
          m => toSlug(m.NameOfEnglish) === slug
        );
        setMovie(found || null);
      } else {
        setMovie(null);
      }
    } catch (error) {
      setMovie(null);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovie();
  }, [slug]);

  async function fetchRecommended() {
    if (!movie) return;
    try {
      const res = await getCurrentMovies();
      if (res.data) {
        // Lọc các phim cùng thể loại (Genres) và khác MovieId hiện tại
        const currentGenres = movie.Genres?.split(',').map(g => g.trim().toLowerCase()) || [];
        const filtered = res.data.filter(
          m =>
            m.MovieId !== movie.MovieId &&
            m.Genres &&
            m.Genres.split(',').some(g => currentGenres.includes(g.trim().toLowerCase()))
        );
        setRecommended(filtered);
      }
    } catch (error) {
      setRecommended([]);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    fetchRecommended();
  }, [movie]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!movie) return <div className="p-8 text-center">Movie not found.</div>;

  const topMovies = [
    {
      name: "Inside Out 2",
      image: "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/03/inside-out-2-poster-showing-joy-and-the-other-emotions-squished-together.jpeg"
    },
    {
      name: "Dune: Part Two",
      image: "https://www.themoviedb.org/t/p/original/28L7YFGnuN24JTInn3GNdUzetBq.jpg"
    },
    {
      name: "Kung Fu Panda 4",
      image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/06/kung-fu-panda-4-film-poster.jpg"
    },
    {
      name: "Deadpool & Wolverine",
      image: "https://cdn.marvel.com/content/1x/dp3_1sht_intl_digital_srgb_ka_blades_v2_resized.jpg"
    },
    {
      name: "The Garfield Movie",
      image: "https://tse3.mm.bing.net/th/id/OIP.4QItB3FqUHdTcLl2qZbKHAHaK_?rs=1&pid=ImgDetMain"
    },
    {
      name: "Kingdom of the Planet of the Apes",
      image: "https://posterspy.com/wp-content/uploads/2023/11/The-Kingdom-of-the-Planet-of-the-Apes-Poster-Winter.jpg"
    },
    {
      name: "Despicable Me 4",
      image: "https://image.tmdb.org/t/p/original/dbtxg1bQYYuWMQvtEuoiUe4uvFJ.jpg"
    },
    {
      name: "The Fall Guy",
      image: "https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-fall-guy/images/regions/us/onesheet.jpg"
    },
    {
      name: "Godzilla x Kong: The New Empire",
      image: "https://image.tmdb.org/t/p/original/vAoubdb2TeqA9joJ7FBcchUMSC3.jpg"
    },
    {
      name: "IF",
      image: "https://m.media-amazon.com/images/M/MV5BMzBmODhmZjEtYzI3MC00OTUwLWIwYjAtNjJjYmQxNzBmYjc0XkEyXkFqcGc@._V1_.jpg"
    },
  ];

  // const versions = movie.Version.split(' ').map(item => item.trim());
  const versions = Array.isArray(movie.Version) ? movie.Version : [];

  const versionStyles = {
    "K": "text-white bg-cyan-800 font-bold",
    "4DX": "text-gray-500 font-semibold",
    "IMAX": "text-blue-600 border-blue-400 font-semibold",
    "SCREENX": "text-gray-400 font-semibold",
    "STARIUM": "text-orange-500 border-orange-400 font-semibold",
    "ULTRA 4DX": "text-black font-semibold"
  };

  const renderStars = (AverageRating) => {
    const stars = [];
    const full = Math.floor(AverageRating);
    const hasHalf = AverageRating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === full && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return stars;
  };

  const fallbackImage = "https://via.placeholder.com/80x120.png?text=No+Image";


  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const swiperBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 50,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 50,
    },
  };

  return (
    <div className='w-full flex flex-col p-[20px]'>
      <div className='text-3xl font-bold mb-4 text-[#9810FA]'>Movie Detail</div>

      <div className='flex gap-5 w-full '>
        <div className='w-[70%] flex flex-col'>
          <div className='flex w-full'>
            <div className='w-[30%] aspect-[2/3] p-4 '>
              <img className='rounded-2xl w-full h-[350px] object-cover'
                src={movie.PosterImage}
                alt={movie.NameOfEnglish}
              />
            </div>

            <div className='w-[70%] p-4'>
              <div className='flex flex-col border-b border-gray-500  pb-4 w-full font-semibold '>
                <p className='text-3xl '>{movie.NameOfEnglish} </p>
                <p className='text-[20px]'>{"("}{movie.NameOfVietnamese}{")"}</p>
              </div>

              <div className='mt-4 space-y-2'>
                <p className='flex gap-6 w-full font-semibold'>Director: <span className='font-normal'>{movie.Director}</span></p>
                <p className='flex gap-9 w-full font-semibold'>Actors: <span className='font-normal'>{movie.Actors}</span></p>
                <p className='flex gap-8 w-full font-semibold'>Genres: <span className='font-normal'>{movie.Genres}</span></p>
                <p className='flex gap-12 w-full font-semibold'>Date: <span className='font-normal'>{formatDate(movie.FromDate)} - {formatDate(movie.ToDate)}</span></p>
                {/* <p className='flex gap-12 w-full font-semibold'>Time: <span className='font-normal'>{movie.time}</span></p> */}
                <p className='flex gap-5 w-full font-semibold'>Duration: <span className='font-normal'>{movie.RunningTime}m</span></p>
                <div className="flex gap-2 flex-wrap mt-4">
                  {versions.map((ver, index) => (
                    <button
                      key={index}
                      className={`border px-3 py-1 rounded ${versionStyles[ver] || 'text-gray-600'}`}
                    >
                      {ver}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-8">
                  <span className="text-lg font-semibold ">Rating:</span>
                  <div className='flex gap-1 items-center'>
                    <div className="flex">{renderStars(movie.AverageRating)}</div>
                    <span className="text-sm text-gray-500 ml-2">({movie.AverageRating})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='p-4 w-full border-b border-gray-700'>
            <div className='font-semibold flex items-center gap-1'><LuChartBar /> Describe:</div>
            <p className='pt-2'>{movie.ContentSynopsis}</p>
          </div>
        </div>

        <div className='w-[25%]'>
          <div className='w-full flex font-semibold text-xl items-center gap-2 justify-center mb-4'><GiTrophyCup /> Top 10 Movies</div>
          <ul className='flex flex-col'>
            {topMovies.map((top, index) => (
              <li
                key={index}
                className='relative flex items-center gap-3 p-2 rounded hover:bg-purple-100 transition group'
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className='text-lg font-bold w-6 text-center text-purple-600'>
                  {index === 0 && <span role="img" aria-label="gold">🥇</span>}
                  {index === 1 && <span role="img" aria-label="silver">🥈</span>}
                  {index === 2 && <span role="img" aria-label="bronze">🥉</span>}
                  {index > 2 && index + 1}
                </span>
                <span className='text-sm font-medium text-gray-800'>{top.name}</span>

                {hoveredIndex === index && (
                  <img
                    src={imageError[index] ? fallbackImage : top.image}
                    onError={() => setImageError(prev => ({ ...prev, [index]: true }))}
                    alt={top.name}
                    className="absolute right-[-40px] w-20 h-28 object-cover rounded-md shadow-lg border"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='w-full '>
        <div className="text-xl font-bold mt-8 mb-2 text-[#9810FA]">Recommended Movies</div>
        <div className="relative">
          {recommended.length === 0 ? (
            <div className="text-gray-500">No recommended movies found.</div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              slidesPerView={5}
              style={{ padding: "0 50px", minHeight: 300 }}
              breakpoints={swiperBreakpoints}
              className="custom-swiper-nav"
            >
              {recommended.map((rec) => (
                <SwiperSlide key={rec.MovieId}
                  style={{ height: 270, display: 'flex', alignItems: 'center' }}>

                  <Link to={`/staff/movie/${toSlug(rec.NameOfEnglish)}`}>
                    <ItemCard item={rec} type="movie" small />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}
