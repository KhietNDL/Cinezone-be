import { FaRegCirclePlay } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import React, { useState } from "react";
import landingBackground from "../../../assets/The-Flash-2023-Teaser-Banner-01.jpg";

import { FaPlay } from "react-icons/fa";
import { Pagination, Navigation } from "swiper/modules";
import imageMovie from "../../../assets/imageMovie.jpg";
import imageMovie2 from "../../../assets/imageMovie2.jpg";
import imageMovie3 from "../../../assets/imageMovie3.jpg";
import imageMovie4 from "../../../assets/imageMovie4.jpg";
import imageMovie5 from "../../../assets/imageMovie5.jpg";
import imageMovie6 from "../../../assets/imageMovie6.jpg";
import imageMovie7 from "../../../assets/imageMovie7.jpg";
import imageMovie8 from "../../../assets/imageMovie8.jpg";
import promotionMovie1 from "../../../assets/PromotionMovie1.jpg";
import promotionMovie2 from "../../../assets/PromotionMovie2.jpg";
import promotionMovie3 from "../../../assets/PromotionMovie3.jpg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [movieData] = useState([
    {
      idMovie: 1,
      nameMovie: "Stree 2 Sarkate Ka Atank",
      category: [{ title: "Action" }, { title: "Horror" }],
      imgUrl: imageMovie2,
      sub: "English",
    },
    {
      idMovie: 2,
      nameMovie: "Stree 2 Sarkate Ka Atank",
      category: [{ title: "Action" }, { title: "Horror" }],
      imgUrl: imageMovie3,
      sub: "English",
    },
    {
      idMovie: 3,
      nameMovie: "Stree 2 Sarkate Ka Atank",
      category: [{ title: "Action" }, { title: "Horror" }],
      imgUrl: imageMovie4,
      sub: "English",
    },
    {
      idMovie: 4,
      nameMovie: "Stree 2 Sarkate Ka Atank",
      category: [{ title: "Action" }, { title: "Horror" }],
      imgUrl: imageMovie5,
      sub: "English",
    },
    {
      idMovie: 5,
      nameMovie: "Stree 2 Sarkate Ka Atank",
      category: [{ title: "Action" }, { title: "Horror" }],
      imgUrl: imageMovie6,
      sub: "English",
    },
    {
      idMovie: 6,
      nameMovie: "Stree 2 Sarkate Ka Atank",
      category: [{ title: "Action" }, { title: "Horror" }],
      imgUrl: imageMovie7,
      sub: "English",
    },
    {
      idMovie: 7,
      nameMovie: "Stree 2 Sarkate Ka Atank",
      category: [{ title: "Action" }, { title: "Horror" }],
      imgUrl: imageMovie8,
      sub: "English",
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
      namePromotion: "Happy Wenesday - 50% Off",
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
      {/* HERO SECTION */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full">
        <img
          src={landingBackground}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute w-full h-full bottom-0 flex flex-col md:flex-row items-center justify-between bg-gradient-to-b from-transparent to-black/100">
          {/* Content Section */}
          <div className="w-full md:w-[50%] flex flex-col items-center md:items-start space-y-3 md:space-y-5 px-4 md:px-[20px] pt-10 md:pt-0 md:mt-70">
            <div className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-white text-center md:text-left">
              Deadpools & Wolverine
            </div>
            <div className="text-white text-center md:text-left text-sm md:text-base px-2 md:px-0">
              cbehwecwec ưe ce cewc ưecwe cưe c cư ec ưec ư ecwe c cưec ưec ưe
              cư ec ecwec ưec ưe cưec ưe cưe cưe c cưechwe chưe cưec ưiecưiec
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              <div
                role="button"
                className="p-2 md:p-3 rounded-4xl shadow-[#6a57f5] shadow-md bg-[#6a57f5] px-4 md:px-6 text-white font-semibold hover:bg-[#6957f5ea] active:bg-[#6957f5ea] active:scale-[1.1] text-sm md:text-base w-full sm:w-auto text-center"
              >
                Book Now
              </div>
              <div
                role="button"
                className="p-2 md:p-3 shadow-[#6a57f5] shadow-md flex items-center justify-center rounded-4xl px-4 md:px-6 border-solid border-[1px] border-[#6957f5ea] bg-black hover:bg-slate-950 text-[#ffffffea] font-semibold active:scale-[1.1] text-sm md:text-base w-full sm:w-auto"
              >
                <FaPlay size={16} className="mr-2" /> Watch trailer
              </div>
            </div>
          </div>

          {/* Movie Poster - Hidden on mobile */}
          <div className="hidden md:flex w-1/2 absolute right-0 top-35 justify-center items-center">
            <img
              src={imageMovie}
              alt=""
              loading="lazy"
              className="w-[150px] md:w-[200px] rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* NOW SHOWING SECTION */}
      <div className="w-full px-4 md:px-[30px] pt-[30px] md:pt-[40px] space-y-3">
        <div className="flex justify-center items-center text-white">
          <p className="font-bold pb-[20px] md:pb-[30px] text-center text-[24px] md:text-[30px]">
            Now showing
          </p>
        </div>
        <div className="flex items-center justify-center mt-[15px] md:mt-[20px]">
          <Swiper
            breakpoints={swiperBreakpoints}
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
                <div className="flex md:flex-col sm:flex-row justify-center md:space-y-2 sm:space-y-0 sm:space-x-1 items-center w-full px-2">
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
                    className="bg-[#6a57f5] rounded-4xl px-4 md:px-6 py-2 pb-3 text-white hover:bg-[#6957f5ea] text-[11px] md:text-[12px] shadow-[#6a57f5] shadow-sm w-full sm:w-auto text-center"
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
                <div className="flex md:flex-col sm:flex-row justify-center md:space-y-2 sm:space-y-0 sm:space-x-1 items-center w-full px-2">
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
                    className="bg-[#6a57f5] rounded-4xl px-4 md:px-6 py-2 pb-3 text-white hover:bg-[#6957f5ea] text-[11px] md:text-[12px] shadow-[#6a57f5] shadow-sm w-full sm:w-auto text-center"
                  >
                    Book now
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
                <div className=" relative h-[180px] w-full md:h-[200px]">
                  <img
                    src={item.imageUrl}
                    alt={item.namePromotion}
                    className="w-full h-full object-cover"
                  />
                  {/* Decorative circles and dashed line */}
                  <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] rounded-full bg-black top-[-20px] md:top-[-30px] right-25 transform translate-x-1/2 md:translate-x-0 md:right-[90px]"></div>
                  <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] rounded-full bg-black bottom-[-20px] md:bottom-[-30px] right-25 transform translate-x-1/2 md:translate-x-0 md:right-[90px]"></div>
                  <div className="hidden md:block absolute h-[75%] top-[25px] border-dashed right-[120px] border-black border-2"></div>
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
