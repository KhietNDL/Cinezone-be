import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaRegCirclePlay } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import React, { useState } from "react";
import landingBackground from "../../../assets/The-Flash-2023-Teaser-Banner-01.jpg";

import { FaPlay } from "react-icons/fa";
import { Pagination } from "swiper/modules";
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
  return (
    <div className="w-full  select-none landingPage">
      {/* <div className="font-bold py-3 text-center text-[30px] text-white">
        Trending movies
      </div> */}
      <div className="relative h-[500px] w-full ">
        <img
          src={landingBackground}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />{" "}
        <div className="absolute w-full h-full bottom-0 flex items-center justify-between bg-gradient-to-b from-transparent to-black/100">
          <div className="w-[50%] flex flex-col items-start space-y-5 mt-70 px-[20px]">
            <div className="text-[40px] font-bold text-white">
              Deadpools & Wolverine
            </div>
            <div className="text-white">
              cbehwecwec ưe ce cewc ưecwe cưe c cưec ưec ư ecwe c cưec ưec ưe cư
              ec ecwec ưec ưe cưec ưe cưe cưe c cưechwe chưe cưec ưiecưiec
            </div>
            <div className="flex items-center space-x-3">
              <div
                role="button"
                className="p-3  rounded-4xl shadow-[#6a57f5]  shadow-md   bg-[#6a57f5] px-6  text-white font-semibold  hover:bg-[#6957f5ea]  active:bg-[#6957f5ea] active:scale-[1.1]"
              >
                Book Now
              </div>
              <div
                role="button"
                className="p-3 shadow-[#6a57f5]  shadow-md   flex items-center rounded-4xl px-6 border-solid border-[1px] border-[#6957f5ea] bg-black hover:bg-slate-950 text-[#ffffffea] font-semibold active:scale-[1.1]"
              >
                <FaPlay size={20} className="mr-2" /> Watch trailer
              </div>
            </div>
          </div>
          <div className="w-1/2 absolute right-0  top-35 flex justify-center items-center">
            <img
              src={imageMovie}
              alt=""
              loading="lazy"
              className="w-[200px] rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* QUICK BOOKING */}
      {/* <div className="w-full px-[20px] bg-slate-900 pt-[40px] ">
        <div className="bg-slate-800 flex items-center justify-between px-7 py-3 rounded-xl">
          <div className="text-white font-bold text-[20px]">Quick booking</div>
          <div className="bg-slate-900 rounded-xl px-9 py-3 text-white flex justify-center items-center">
            1.Select Movie <MdOutlineArrowDropDown size={20} className="ml-2" />
          </div>
          <div className="bg-slate-900 rounded-xl px-9 py-3 text-white flex justify-center items-center">
            2.Select Date <MdOutlineArrowDropDown size={20} className="ml-2" />
          </div>
          <div className="bg-slate-900 rounded-xl px-9 py-3 text-white flex justify-center items-center">
            3.Select Showtime{" "}
            <MdOutlineArrowDropDown size={20} className="ml-2" />
          </div>
          <div
            role="button"
            className="bg-purple-500 rounded-xl px-9 py-3 text-white"
               
          >
            Book Now
          </div>
        </div>
      </div> */}

      {/* TRENDING MOVIE */}
      <div className=" w-full px-[30px] pt-[40px] space-y-3 ">
        <div className="flex justify-start items-center text-white">
          <p className="font-bold pb-[30px] text-[30px]">Now showing</p>
        </div>{" "}
        <div className="flex items-center justify-center mt-[20px] ">
          <Swiper
            slidesPerView={5}
            spaceBetween={50}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {movieData.map((item) => (
              <SwiperSlide
                key={item.id}
                className="bg-slate-800 flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
              >
                <img
                  src={item.imgUrl}
                  alt=""
                  loading="lazy"
                  className="w-full h-[300px] object-cover rounded-tl-xl rounded-tr-xl "
                />
                <div className="text-white text-center font-semibold ">
                  {item.nameMovie}
                </div>
                <div className="flex justify-center space-x-1 items-center w-full ">
                  <div
                    role="button"
                    className="text-white flex items-center hover:bg-slate-700 p-2 rounded-4xl px-3 text-[12px] "
                  >
                    <FaRegCirclePlay size={20} className="mr-1" />
                    Watch Trailer
                  </div>
                  <div
                    role="button"
                    onClick={() => handleClickMovie(item.idMovie)}
                    className="bg-[#6a57f5] rounded-4xl px-6 py-2 text-white hover:bg-[#6957f5ea] text-[12px]  shadow-[#6a57f5]  shadow-sm "
                  >
                    Book now
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* COMMING SOON MOVIE */}
      <div className="w-full px-[30px] pt-[40px] space-y-3 ">
        <div className="flex justify-center items-center text-white">
          <p className="font-bold pb-[30px] text-[30px]">Comming soon</p>
        </div>{" "}
        <div className="flex items-center justify-center mt-[20px] ">
          <Swiper
            slidesPerView={5}
            spaceBetween={50}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {movieData.map((item) => (
              <SwiperSlide
                key={item.id}
                className="bg-slate-800 flex flex-col justify-center items-center pb-2 rounded-xl space-y-2"
              >
                <img
                  src={item.imgUrl}
                  alt=""
                  loading="lazy"
                  className="w-full h-[300px] object-cover rounded-tl-xl rounded-tr-xl "
                />
                <div className="text-white text-center font-semibold ">
                  {item.nameMovie}
                </div>
                <div className="flex justify-center space-x-1 items-center w-full ">
                  <div
                    role="button"
                    className="text-white px-3 flex items-center hover:bg-slate-700 p-2 rounded-4xl text-[12px]"
                  >
                    <FaRegCirclePlay size={20} className="mr-1" />
                    Watch Trailer
                  </div>
                  <div
                    role="button"
                    className="bg-purple-500 rounded-lg px-3 py-2 text-white hover:bg-purple-600 text-[12px]"
                    onClick={()=>{handleClickMovie(item.idMovie)}}
                  >
                    Book now
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* PROMOTION */}
      <div className="py-[40px] px-[30px] w-full space-y-3 ">
        <div className="text-white font-bold text-[30px] ">
          Special Promotions
        </div>
        <div className="flex justify-between items-center w-full">
          {promotionData.map((item) => (
            <div key={item.idPromotion} className="w-[30%]  bg-slate-800">
              <div className="w-full relative h-[200px]">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute w-[60px] h-[60px] rounded-full bg-black top-[-35px] right-[90px]"></div>
                <div className="absolute w-[60px] h-[60px] rounded-full bg-black bottom-[-35px] right-[90px]"></div>
                <div className="absolute h-[75%]  top-[25px] border-dashed right-[120px] border-black border-2 "></div>
              </div>
              {/* <div className="p-2 space-y-2 space-x-2">
                <div className="text-white font-bold">{item.namePromotion}</div>
                <div className="text-white ">
                  {item.startActive} to {item.endActive}
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
