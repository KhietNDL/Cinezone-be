
import React, { useState, useEffect } from "react";
import { Button, Input, Spin, Tag, message } from "antd";
import axios from "axios";
import MovieCard from "./MovieCard";
import ShowtimeButton from "./ShowtimeButton";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import './SwiperButton.css';
import { RiMovie2AiFill } from "react-icons/ri";


const SellTicketPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://683d6711199a0039e9e55241.mockapi.io/movie"
        );
        setMovies(res.data);
      } catch (err) {
        message.error("Failed to fetch movies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Lọc movie theo search
  const filteredMovies = movies.filter(movie =>
    movie.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-[#fafbfc] p-[20px]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-fuchsia-700">Sell Movie Ticket</h1>
       <Input.Search
          placeholder="Search movie..."
          style={{ width: 250 }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
     
        <h5 className="mt-5">
          <i className="fa-solid fa-film"></i> Select Movie
        </h5>

      <div className="staff-swiper">
        {loading ? (
          <div className="text-center my-8">
            <Spin size="large" />
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination ]}
            navigation
            pagination={{
              clickable: true,
            }}
            spaceBetween={50}
            slidesPerView={4}
            slidesPerGroup={2}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {movies.map((movie) => (
              <SwiperSlide  key={movie.id}>
                <div className="flex justify-center p-2 w-[260px]">
                  <MovieCard
                    movie={movie}
                    onSelect={setSelectedMovie}
                    selected={selectedMovie?.id === movie.id}
                  />
                </div>

              </SwiperSlide>
            ))}
          </Swiper>
        )}
</div>
        <h5 className="mt-5 flex items-center gap-2">
          <RiMovie2AiFill /> Select Version
        </h5>
        <div className="pl-15 pt-2 flex gap-4">
          {(!selectedVersion || selectedVersion === "IMAX") && (
            <div role="button"
              className=" font-bold text-white text-center
              px-7 py-2 rounded-lg  bg-[linear-gradient(to_right,_#004897,_#509AEA,_#60BCE6,_#56C3F5,_#0AF7FB)] "
              onClick={() =>
                setSelectedVersion(selectedVersion === "IMAX" ? null : "IMAX")
              }
            >
              IMAX
            </div>
          )}
          {(!selectedVersion || selectedVersion === "4DX") && (
            <div
              className=" font-bold text-white text-center
              px-7 py-2 rounded-lg bg-[linear-gradient(to_right,_#680000,_#991C1C,_#BF1616,_#DB3838,_#F26969)]"
             
              onClick={() =>
                setSelectedVersion(selectedVersion === "4DX" ? null : "4DX")
              }
            >
              4DX
            </div>
          )}
          {(!selectedVersion || selectedVersion === "3D") && (
            <div
              className=" font-bold text-white text-center
              px-7 py-2 rounded-lg bg-[linear-gradient(to_right,_#C88200,_#DB9E2D,_#D0B400,_#F3C91E,_#FFE606)]"
              color="cyan"
              onClick={() =>
                setSelectedVersion(selectedVersion === "3D" ? null : "3D")
              }
            >
              3D
            </div>
          )}
          {(!selectedVersion || selectedVersion === "2D") && (
            <div
              className=" font-bold text-white text-center
              px-7 py-2 rounded-lg bg-[linear-gradient(to_right,_#147800,_#03B000,_#0ACA00,_#4ADF00,_#5EFF41)]"
             
              onClick={() =>
                setSelectedVersion(selectedVersion === "2D" ? null : "2D")
              }
            >
              2D
            </div>
          )}
        </div>

      

      <h5 className="mt-5">
        <i className="fa-solid fa-clock"></i> Select Showtime
      </h5>

      <ShowtimeButton
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
      />

      <div className="mt-5 text-center">
        <Link to="/staff/ticket-selling/select-seats">
          <Button
            style={{
              backgroundColor: "#8A2BE2",
              color: "white",
              padding: "1rem"
             
            }}
          >
            <i className="fa-solid fa-couch"></i> Select seats
          </Button>
        </Link>
        <Button style={{ marginLeft: 10 }} danger>
          <i className="fa-solid fa-xmark"></i> Cancel
        </Button>
      </div>
    </div>
  );
};

export default SellTicketPage;
