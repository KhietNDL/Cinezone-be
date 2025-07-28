import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import '../component/SwiperButton.css';
import { toast } from 'react-toastify';
import BackButton from '../component/BackButton';
import VersionCard from '../component/VersionCard';

export default function MovieDetail() {
  const {slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imageError, setImageError] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  const toSlug = (str) =>
    str
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const res = await getCurrentMovies();
      if (res.data) {
        const found = res.data.find(m => toSlug(m.NameOfEnglish) === slug);
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
  };

  const fetchTopMovies = async () => {
    try {
      const res = await getCurrentMovies();
      if (res.data) {
        const sortedMovies = res.data
          .filter(movie => movie.AverageRating)
          .sort((a, b) => parseFloat(b.AverageRating) - parseFloat(a.AverageRating))
          .slice(0, 10)
          .map((movie, index) => ({
            MovieId: movie.MovieId,
            name: movie.NameOfEnglish,
            image: movie.PosterImage,
            rating: movie.AverageRating,
            index
          }));
        setTopMovies(sortedMovies);
      }
    } catch (error) {
      console.error("Error fetching top movies:", error);
      setTopMovies([]);
    }
  };

  const fetchRecommended = async () => {
    if (!movie) return;
    try {
      const res = await getCurrentMovies();
      if (res.data) {
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
  };

  useEffect(() => {
    fetchMovie();
    fetchTopMovies();
  }, [slug]);

  useEffect(() => {
    fetchRecommended();
  }, [movie]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!movie) return <div className="p-8 text-center">Movie not found.</div>;

  const versions = Array.isArray(movie.versions) ? movie.versions : [];

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
    320: { slidesPerView: 1, spaceBetween: 50 },
    640: { slidesPerView: 2, spaceBetween: 30 },
    768: { slidesPerView: 3, spaceBetween: 40 },
    1024: { slidesPerView: 5, spaceBetween: 50 },
  };

  return (
    <div className='w-full flex flex-col p-[20px]'>
      <div className="flex flex-row items-start justify-between gap-4 mb-6">
        <div className='w-[20%]'><BackButton /></div>
        <h1 className="mx-auto lg:mx-0 text-3xl font-bold text-[#9810FA] flex flex-col lg:items-start items-center">
          Movie Detail
        </h1>
        <div className='w-[20%]'></div>
      </div>

      <div className='flex gap-5 w-full lg:flex-row flex-col'>
        <div className='w-full lg:w-[70%] flex flex-col'>
          <div className='flex lg:flex-row flex-col w-full'>
            <div className='w-full lg:w-[30%] lg:aspect-[2/3] lg:py-4 px-4'>
              <img className='rounded-2xl w-full h-auto lg:h-[350px] object-cover'
                src={movie.PosterImage}
                alt={movie.NameOfEnglish}
              />
            </div>
            <div className='w-full lg:w-[70%] p-4'>
              <div className='flex flex-col border-b border-gray-500 items-center lg:items-start pb-4 w-full font-semibold'>
                <p className='text-3xl '>{movie.NameOfEnglish} </p>
                <p className='text-[20px]'>({movie.NameOfVietnamese})</p>
              </div>
              <div className='mt-4 space-y-2'>
                <p className='flex gap-6 w-full font-semibold'>Director: <span className='font-normal'>{movie.Director}</span></p>
                <p className='flex gap-9 w-full font-semibold'>Actors: <span className='font-normal'>{movie.Actors}</span></p>
                <p className='flex gap-8 w-full font-semibold'>Genres: <span className='font-normal'>{movie.Genres}</span></p>
                <p className='flex gap-12 w-full font-semibold'>Date: <span className='font-normal'>{formatDate(movie.FromDate)} - {formatDate(movie.ToDate)}</span></p>
                <p className='flex gap-5 w-full font-semibold'>Duration: <span className='font-normal'>{movie.RunningTime}m</span></p>
                <div className="flex gap-3 flex-wrap">
                  {versions.map((ver, index) => (
                    <VersionCard key={index} version={ver.VersionType} selectedVersion={null} readonly={true} />
                  ))}
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-lg font-semibold ">Rating:</span>
                  <div className='flex gap-1 items-center'>
                    <div className="flex">{renderStars(movie.AverageRating)}</div>
                    <span className="text-sm text-gray-500 ml-2">({movie.AverageRating})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='px-4 pb-4 w-full border-b border-gray-700'>
            <div className='font-semibold flex items-center gap-1'><LuChartBar /> Describe:</div>
            <p className='pt-2'>{movie.ContentSynopsis}</p>
          </div>
        </div>

        <div className='w-full lg:w-[25%]'>
          <div className='w-full flex font-semibold text-xl items-center gap-2 justify-center mb-4'><GiTrophyCup /> Top 10 Movies</div>
          <ul className='flex flex-col'>
            {topMovies.map((top, index) => (
              <li
                key={top.MovieId}
                className='relative flex items-center gap-3 p-2 rounded hover:bg-purple-100 transition group cursor-pointer'
                onClick={() => navigate(`/staff/movie/${toSlug(top.name)}`)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                title={top.name}
              >
                <span className='text-lg font-bold w-6 text-center text-purple-600'>
                  {index === 0 && <span role="img" aria-label="gold">🥇</span>}
                  {index === 1 && <span role="img" aria-label="silver">🥈</span>}
                  {index === 2 && <span role="img" aria-label="bronze">🥉</span>}
                  {index > 2 && index + 1}
                </span>
                <span className='text-sm font-medium text-gray-800 hover:text-purple-700'>{top.name}</span>
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
        <div className="text-xl font-bold lg:mt-8 mb-2 text-[#9810FA] lg:text-start text-center">Recommended Movies</div>
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
                <SwiperSlide
                  key={rec.MovieId}
                  style={{ height: 270, display: 'flex', alignItems: 'center' }}
                >
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