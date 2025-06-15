// Landing.jsx - Cách tích hợp component
import React, { useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

// Import component MovieHeroSwiper
import MovieHeroSwiper from "./MovieHeroSwiper";

// Import assets
import CaptainTrailer from "../../../assets/Video/CaptainTrailer.mp4";
import DeadpoolTrailer from "../../../assets/Video/DeadpoolTrailer.mp4";
import DoctorStrangeTrailer from "../../../assets/Video/DoctorStrangeTrailer.mp4";
import MarvelTrailer from "../../../assets/Video/MarvelTrailer.mp4";
import SpiderManTrailer from "../../../assets/Video/SpiderManTrailer.mp4";
import ThorTrailer from "../../../assets/Video/ThorTrailer.mp4";
import TransformersTrailer from "../../../assets/Video/TransformersTrailer.mp4";
import TheEndPoster from "../../../assets/TheEndPoster.jpg";
import DoctorStrangePoster from "../../../assets/DoctorStrangePoster.jpg";
import SpiderManPoster from "../../../assets/SpiderManPoster.jpg";
import TranformerPoster from "../../../assets/TranformerPoster.jpg";
import DeadPoolPoster from "../../../assets/DeadPoolPoster.jpg";
import CaptainPoster from "../../../assets/CaptainPoster.jpg";
import ThorPoster from "../../../assets/ThorPoster.jpg";
import promotionMovie1 from "../../../assets/PromotionMovie1.jpg";
import promotionMovie2 from "../../../assets/PromotionMovie2.jpg";
import promotionMovie3 from "../../../assets/PromotionMovie3.jpg";

const LandingPage = () => {
  const [movieData] = useState([
    {
      idMovie: 1,
      nameMovie: "Deadpool & Wolverine",
      category: [{ title: "Action" }, { title: "Comedy" }],
      imgUrl: DeadPoolPoster,
      sub: "English",
      trailerUrl: DeadpoolTrailer,
    },
    {
      idMovie: 2,
      nameMovie: "Captain America: Brave New World",
      category: [{ title: "Action" }, { title: "Adventure" }],
      imgUrl: CaptainPoster,
      sub: "English",
      trailerUrl: CaptainTrailer,
    },
    {
      idMovie: 3,
      nameMovie: "Avengers: Infinity War",
      category: [{ title: "Action" }, { title: "Sci-Fi" }],
      imgUrl: TheEndPoster,
      sub: "English",
      trailerUrl: MarvelTrailer,
    },
    {
      idMovie: 4,
      nameMovie: "Transformers: Rise of the Beasts",
      category: [{ title: "Action" }, { title: "Sci-Fi" }],
      imgUrl: TranformerPoster,
      sub: "English",
      trailerUrl: TransformersTrailer,
    },
    {
      idMovie: 5,
      nameMovie: "Spider-Man: No Way Home",
      category: [{ title: "Action" }, { title: "Adventure" }],
      imgUrl: SpiderManPoster,
      sub: "English",
      trailerUrl: SpiderManTrailer,
    },
    {
      idMovie: 6,
      nameMovie: "Doctor Strange",
      category: [{ title: "Action" }, { title: "Fantasy" }],
      imgUrl: DoctorStrangePoster,
      sub: "English",
      trailerUrl: DoctorStrangeTrailer,
    },
    {
      idMovie: 7,
      nameMovie: "Thor: Love and Thunder",
      category: [{ title: "Action" }, { title: "Comedy" }],
      imgUrl: ThorPoster,
      sub: "English",
      trailerUrl: ThorTrailer,
    },
  ]);

  const [promotionData] = useState([
    {
      idPromotion: 1,
      imageUrl: promotionMovie1,
      namePromotion: "Buy 2 Get 1 Free",
      startActive: "May 20, 2025",
      endActive: "June 20, 2025",
      isActive: "active",
    },
    {
      idPromotion: 2,
      imageUrl: promotionMovie2,
      namePromotion: "Happy Wednesday - 50% Off",
      startActive: "May 20, 2025",
      endActive: "June 20, 2025",
      isActive: "active",
    },
    {
      idPromotion: 3,
      imageUrl: promotionMovie3,
      namePromotion: "International Children's Day - 30% Off",
      startActive: "June 1, 2025",
      endActive: "June 2, 2025",
      isActive: "active",
    },
  ]);

  const navigate = useNavigate();
  const handleClickMovie = (idMovie) => {
    navigate(`/${idMovie}`);
  };

  // Responsive breakpoints for Swiper
  const swiperBreakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
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
      slidesPerView: 4,
      spaceBetween: 50,
    },
  };

  return (
    <div className="w-full select-none landingPage">
      {/* HERO SECTION - Thay thế bằng MovieHeroSwiper */}
      <MovieHeroSwiper movieData={movieData} />

      {/* Screen 3D Effect */}
      <div className="w-full mt-10 px-4">
        <div className="w-full h-[40px] relative overflow-hidden group">
          {/* SVG cho đường cong gradient */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 40"
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            preserveAspectRatio="none"
            style={{ background: "transparent" }}
          >
            {/* Định nghĩa gradient từ nhạt đến đậm ở giữa */}
            <defs>
              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
                <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
                <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient
                id="purpleGlowHover"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#b0a8ff" stopOpacity="0" />
                <stop offset="25%" stopColor="#b0a8ff" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#c9c2ff" stopOpacity="1" />
                <stop offset="75%" stopColor="#b0a8ff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#b0a8ff" stopOpacity="0" />
              </linearGradient>

              <linearGradient
                id="purpleGradientHover"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#b0a8ff" stopOpacity="0.01" />
                <stop offset="25%" stopColor="#b0a8ff" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#c9c2ff" stopOpacity="1" />
                <stop offset="75%" stopColor="#b0a8ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#b0a8ff" stopOpacity="0.01" />
              </linearGradient>

              <linearGradient
                id="lightGlowBelow"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#c9c2ff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#c9c2ff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#c9c2ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Đường cong với hiệu ứng glow */}
            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGlow)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="blur-[1px] transition-all duration-500 group-hover:blur-[0px] group-hover:stroke-[7px] group-hover:[stroke:url(#purpleGlowHover)]"
            />

            {/* Đường cong chính */}
            <path
              d="M 0 20 Q 400 0 800 20"
              stroke="url(#purpleGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500 group-hover:stroke-[6px] group-hover:[stroke:url(#purpleGradientHover)]"
            />

            {/* Ánh sáng nhẹ phía dưới khi hover */}
            <path
              d="M 0 25 Q 400 5 800 25"
              stroke="url(#lightGlowBelow)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              className="opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
            />
          </svg>
        </div>
      </div>

      {/* TRENDING MOVIE */}
      <div className=" w-full px-[30px] pt-[40px] space-y-3 ">
        <div className="flex justify-center items-center text-white">
          <p className="font-bold pb-[30px] text-center text-[30px]">
            Now showing
          </p>
        </div>{" "}
        <div className="flex items-center justify-center mt-[20px] ">
          <Swiper
            breakpoints={swiperBreakpoints}
            slidesPerView={5}
            spaceBetween={50}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {movieData.map((item) => (
              <SwiperSlide
                key={item.idMovie}
                className="bg-slate-800 flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
              >
                <img
                  src={item.imgUrl}
                  alt=""
                  loading="lazy"
                  className="w-full h-[250px] md:h-[320px] object-cover rounded-tl-xl rounded-tr-xl"
                />
                <div className="text-white text-center font-semibold text-sm md:text-base px-2">
                  {item.nameMovie}
                </div>
                <div className="flex xl:flex-row md:flex-col sm:flex-row justify-center md:space-y-2 xl:space-y-0 sm:space-y-0 sm:space-x-1 items-center w-full px-2">
                  <div
                    role="button"
                    className="text-white flex items-center justify-center hover:bg-slate-700 p-2 rounded-4xl px-3 text-[11px] md:text-[12px] w-full sm:w-auto"
                  >
                    <FaRegCirclePlay size={16} className="mr-1" />
                    Watch Trailer
                  </div>
                  <div
                    role="button"
                    onClick={() => handleClickMovie(item.idMovie)}
                    className="bg-[#6a57f5] rounded-4xl px-6 py-2 text-white hover:bg-[#6957f5ea] text-[12px]  shadow-[#6a57f5]  shadow-sm sm:w-auto "
                  >
                    Book now
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* COMING SOON SECTION */}
      <div className="w-full px-4 md:px-[30px] pt-[30px] md:pt-[40px] space-y-3">
        <div className="flex justify-center items-center text-white">
          <p className="font-bold pb-[20px] md:pb-[30px] text-[24px] md:text-[30px]">
            Coming soon
          </p>
        </div>
        <div className="flex items-center justify-center mt-[15px] md:mt-[20px]">
          <Swiper
            breakpoints={swiperBreakpoints}
            slidesPerView={5}
            spaceBetween={50}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {movieData.map((item) => (
              <SwiperSlide
                key={item.idMovie}
                className="bg-slate-800 flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
              >
                <img
                  src={item.imgUrl}
                  alt=""
                  loading="lazy"
                  className="w-full h-[250px] md:h-[320px] object-cover rounded-tl-xl rounded-tr-xl"
                />
                <div className="text-white text-center font-semibold text-sm md:text-base px-2">
                  {item.nameMovie}
                </div>
                <div className="flex md:flex-col lg:flex-row sm:flex-row justify-center md:space-y-2 sm:space-y-0 sm:space-x-1 items-center w-full px-2">
                  <div
                    role="button"
                    className="text-white flex items-center justify-center hover:bg-slate-700 p-2 rounded-4xl px-3 text-[11px] md:text-[12px] w-full sm:w-auto"
                  >
                    <FaRegCirclePlay size={16} className="mr-1" />
                    Watch Trailer
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* PROMOTION SECTION */}
      <div className="py-[30px] md:py-[40px] px-4 md:px-[30px] w-full space-y-8">
        <div className="text-white font-bold text-[24px] md:text-[30px]">
          Special Promotions
        </div>

        <div className="flex w-full items-center justify-center mt-[15px] md:mt-[20px]">
          <Swiper
            breakpoints={swiperBreakpoints}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {promotionData.map((item) => (
              <SwiperSlide
                key={item.idPromotion}
                className="w-full flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
              >
                <div className="relative h-[180px] w-full md:h-[200px] lg:h-[180px]">
                  <img
                    src={item.imageUrl}
                    alt={item.namePromotion}
                    className="w-full rounded-md h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Decorative circles and dashed line */}
                  <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-black top-[-20px] md:top-[-30px] md:right-[10%] lg:right-[20%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>
                  <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-black bottom-[-20px] md:bottom-[-30px] lg:right-[20%] md:right-[10%] right-[20%]  transform translate-x-1/2 md:translate-x-0"></div>
                  <div className=" absolute h-[75%] top-[12%] border-dashed border-black  border-2 md:right-[45px] right-[70px] lg:right-[35%] xl:right-[27%]"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
