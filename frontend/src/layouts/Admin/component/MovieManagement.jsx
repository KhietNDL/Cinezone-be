import React, { useMemo, useState } from "react";
import { GoPlus } from "react-icons/go";
import {
  IoCalendarOutline,
  IoClose,
  IoEyeOutline,
  IoFilmOutline,
  IoSearchOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoVideocamOutline,
  IoBookmarkOutline,
  IoMapOutline,
} from "react-icons/io5";
import { PiChartLineDownBold } from "react-icons/pi";
import { MdMovie, MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaUpload, FaCalendarAlt, FaClock } from "react-icons/fa";
import imageMovie7 from "../../../assets/imageMovie7.jpg";
import MovieForm from "../movieComponent/MovieForm";
const MovieManagement = () => {
  const [movies, setMovies] = useState([
    {
      idMovie: 1,
      movieNameEn: "Dune: Part Two",
      movieNameVn: "Hành Tinh Cát: Phần Hai",
      fromDate: "2024-03-01",
      toDate: "2024-04-30",
      actor: "Timothée Chalamet, Zendaya",
      productionCompany: "Warner Bros.",
      director: "Denis ",
      duration: "166",
      version: "IMAX 2D",
      type: ["Sci-fi", "Action"],
      cinemaRoom: "Room 1",
      schedule: ["13:30", "17:00", "21:00"],
      content:
        "Paul Atreides continues his journey to lead the Fremen and challenge the forces controlling the spice on Arrakis.",
      image: imageMovie7,
    },
    {
      idMovie: 2,
      movieNameEn: "Kung Fu Panda 4",
      movieNameVn: "Gấu Trúc Kung Fu 4",
      fromDate: "2024-10-11",
      toDate: "2024-11-30",
      actor: "Jack Black, Awkwafina",
      productionCompany: "DreamWorks Animation",
      director: "Mike Mitchell",
      duration: "94",
      version: "2D, 3D",
      type: ["Animation", "Comedy"],
      cinemaRoom: "Room 2",
      schedule: ["09:00", "11:00", "15:00"],
      content:
        "Po faces new challenges as he trains a new Dragon Warrior while confronting a powerful sorceress.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 3,
      movieNameEn: "Godzilla x Kong: The New Empire",
      movieNameVn: "Godzilla đại chiến Kong: Đế chế mới",
      fromDate: "2024-06-14",
      toDate: "2024-08-15",
      actor: "Rebecca Hall, Dan Stevens",
      productionCompany: "Legendary Pictures",
      director: "Adam Wingard",
      duration: "115",
      version: "4DX, 3D",
      type: ["Action", "Sci-fi"],
      cinemaRoom: "Room 3",
      schedule: ["17:00", "19:00", "21:00"],
      content:
        "Godzilla and Kong team up to face a new threat emerging from the Hollow Earth.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 4,
      movieNameEn: "Inside Out 2",
      movieNameVn: "Những Mảnh Ghép Cảm Xúc 2",
      fromDate: "2024-04-12",
      toDate: "2024-06-30",
      actor: "Amy Poehler, Maya Hawke",
      productionCompany: "Pixar Animation Studios",
      director: "Kelsey Mann",
      duration: "100",
      version: "2D, ScreenX",
      type: ["Animation", "Comedy"],
      cinemaRoom: "Room 4",
      schedule: ["08:00", "11:00", "15:00"],
      content:
        "Riley navigates new emotions as she enters her teenage years, facing Anxiety and other challenges.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 5,
      movieNameEn: "Civil War",
      movieNameVn: "Nội Chiến Mỹ",
      fromDate: "2024-08-21",
      toDate: "2024-10-15",
      actor: "Kirsten Dunst, Wagner Moura",
      productionCompany: "A24",
      director: "Alex Garland",
      duration: "109",
      version: "2D, Atmos",
      type: ["Action", "Drama"],
      cinemaRoom: "Room 1",
      schedule: ["13:30", "18:30", "21:00"],
      content:
        "A group of journalists travels across a war-torn America to document the conflict.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 6,
      movieNameEn: "The Fall Guy",
      movieNameVn: "Tay Stunt Siêu Đẳng",
      fromDate: "2024-09-15",
      toDate: "2024-11-10",
      actor: "Ryan Gosling, Emily Blunt",
      productionCompany: "Universal Pictures",
      director: "David Leitch",
      duration: "126",
      version: "IMAX 2D",
      type: ["Action", "Comedy"],
      cinemaRoom: "Room 2",
      schedule: ["15:00", "19:00", "21:00"],
      content:
        "A stuntman gets entangled in a dangerous conspiracy while working on a film set.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 7,
      movieNameEn: "Furiosa: A Mad Max Saga",
      movieNameVn: "Furiosa: Cơn Thịnh Nộ",
      fromDate: "2024-02-24",
      toDate: "2024-04-30",
      actor: "Anya Taylor-Joy, Chris Hemsworth",
      productionCompany: "Warner Bros.",
      director: "George Miller",
      duration: "148",
      version: "2D, 3D",
      type: ["Action", "Sci-fi"],
      cinemaRoom: "Room 3",
      schedule: ["09:00", "13:30", "17:00"],
      content:
        "The origin story of Furiosa, a fierce warrior in the post-apocalyptic Wasteland.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 8,
      movieNameEn: "Avatar: The Way of Water",
      movieNameVn: "Avatar: Dòng Chảy Của Nước",
      fromDate: "2022-12-16",
      toDate: "2023-02-28",
      actor: "Sam Worthington, Zoe Saldana",
      productionCompany: "20th Century Studios",
      director: "James Cameron",
      duration: "192",
      version: "IMAX 3D",
      type: ["Sci-fi", "Adventure"],
      cinemaRoom: "Room 4",
      schedule: ["11:00", "15:00", "19:00"],
      content:
        "Jake Sully and his family fight to protect Pandora from new threats.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 9,
      movieNameEn: "The Marvels",
      movieNameVn: "Biệt Đội Marvel",
      fromDate: "2023-11-10",
      toDate: "2024-01-15",
      actor: "Brie Larson, Iman Vellani",
      productionCompany: "Marvel Studios",
      director: "Nia DaCosta",
      duration: "105",
      version: "2D, 3D",
      type: ["Action", "Sci-fi"],
      cinemaRoom: "Room 1",
      schedule: ["08:00", "13:30", "18:30"],
      content:
        "Captain Marvel teams up with Ms. Marvel and Monica Rambeau to save the universe.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 10,
      movieNameEn: "Wonka",
      movieNameVn: "Cậu Bé Socola",
      fromDate: "2023-12-15",
      toDate: "2024-02-29",
      actor: "Timothée Chalamet, Olivia Colman",
      productionCompany: "Warner Bros.",
      director: "Paul King",
      duration: "116",
      version: "2D",
      type: ["Comedy", "Fantasy"],
      cinemaRoom: "Room 2",
      schedule: ["09:00", "11:00", "15:00"],
      content:
        "The story of young Willy Wonka and his journey to becoming a legendary chocolatier.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
    {
      idMovie: 11,
      movieNameEn: "Mission: Impossible – Dead Reckoning Part One",
      movieNameVn: "Nhiệm Vụ Bất Khả Thi: Đối Đầu Tử Thần – Phần Một",
      fromDate: "2023-07-12",
      toDate: "2023-09-30",
      actor: "Tom Cruise, Hayley Atwell",
      productionCompany: "Paramount Pictures",
      director: "Christopher McQuarrie",
      duration: "163",
      version: "IMAX 2D",
      type: ["Action", "Adventure"],
      cinemaRoom: "Room 3",
      schedule: ["13:30", "17:00", "21:00"],
      content: "Ethan Hunt races against time to stop a dangerous AI weapon.",
      image: "https://www.w3schools.com/howto/img_avatar.png",
    },
  ]);
  const [upcomingMovies] = useState([
    { date: "2024-07-03", title: "Midnight Shadows" },
    { date: "2024-07-15", title: "Echoes of Tomorrow" },
    { date: "2024-08-09", title: "Neon Skyline" },
    { date: "2024-08-25", title: "Fading Lights" },
    { date: "2024-09-12", title: "Celestial Drift" },
  ]);
  const [page, setPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTooltipMovie, setSelectedTooltipMovie] = useState(null); // Track movie for tooltip
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Track tooltip position
  const itemsPerPage = 7;
  const [searchMovie, setSearchMovie] = useState("");

  // Filter Movies based on search term
  const filteredMovies = useMemo(() => {
    return movies.filter(
      (mov) =>
        (mov.movieNameEn &&
          mov.movieNameEn.toLowerCase().includes(searchMovie.toLowerCase())) ||
        (mov.movieNameVn &&
          mov.movieNameVn.toLowerCase().includes(searchMovie.toLowerCase())) ||
        (mov.production_company &&
          mov.production_company
            .toLowerCase()
            .includes(searchMovie.toLowerCase()))
    );
  }, [movies, searchMovie]);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  const [formData, setFormData] = useState({
    movieNameEn: "",
    movieNameVn: "",
    fromDate: "",
    toDate: "",
    actor: "",
    productionCompany: "",
    director: "",
    duration: "",
    version: "2D",
    type: [],
    cinemaRoom: "",
    schedule: [],
    content: "",
    image: null,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type],
    }));
  };

  const handleScheduleChange = (time) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.includes(time)
        ? prev.schedule.filter((t) => t !== time)
        : [...prev.schedule, time],
    }));
  };

  const handleSave = () => {
    if (showEditForm && selectedMovie) {
      // Update existing movie
      setMovies((prev) =>
        prev.map((mov) =>
          mov.idMovie === selectedMovie.idMovie
            ? { ...formData, idMovie: mov.idMovie }
            : mov
        )
      );
    } else {
      // Add new movie
      const newMovie = {
        ...formData,
        idMovie:
          movies.length > 0 ? Math.max(...movies.map((m) => m.idMovie)) + 1 : 1,
      };
      setMovies((prev) => [...prev, newMovie]);
    }
    setFormData({
      movieNameEn: "",
      movieNameVn: "",
      fromDate: "",
      toDate: "",
      actor: "",
      productionCompany: "",
      director: "",
      duration: "",
      version: "2D",
      type: [],
      cinemaRoom: "",
      schedule: [],
      content: "",
      image: null,
    });
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedMovie(null);
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      movieNameEn: movie.movieNameEn,
      movieNameVn: movie.movieNameVn,
      fromDate: movie.fromDate,
      toDate: movie.toDate,
      actor: movie.actor,
      productionCompany: movie.productionCompany,
      director: movie.director,
      duration: movie.duration,
      version: movie.version,
      type: movie.type || [],
      cinemaRoom: movie.cinemaRoom,
      schedule: movie.schedule || [],
      content: movie.content,
      image: movie.image,
    });
    setShowEditForm(true);
  };

  const handleDelete = (movie) => {
    setSelectedMovie(movie);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    setMovies((prev) =>
      prev.filter((mov) => mov.idMovie !== selectedMovie.idMovie)
    );
    setShowDeletePopup(false);
    setSelectedMovie(null);
  };

  const handleRowClick = (movie, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top + window.scrollY,
    });
    setSelectedTooltipMovie(movie);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest("tr") && !e.target.closest(".tooltip")) {
      setSelectedTooltipMovie(null);
    }
  };

  const handleCloseMovieForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setFormData({
      movieNameEn: "",
      movieNameVn: "",
      fromDate: "",
      toDate: "",
      actor: "",
      productionCompany: "",
      director: "",
      duration: "",
      version: "2D",
      type: [],
      cinemaRoom: "",
      schedule: [],
      content: "",
      image: null,
    });
    setSelectedMovie(null);
  };

  const MovieTooltip = ({ movie, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {movie.movieNameEn}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {movie.movieNameVn}
            </p>
            <p className="text-sm text-gray-600 font-medium mt-1">
              {movie.productionCompany}
            </p>
          </div>
          <div
            onClick={onClose}
            role="button"
            className="p-2 rounded-2xl hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <IoClose size={24} className="text-gray-600" />
          </div>
        </div>

        {/* Movie Poster and Details */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={
                  movie.image ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt={movie.movieNameEn}
                className="w-48 h-72 rounded-xl object-cover shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Movie Information */}
          <div className="flex-1 space-y-4">
            {/* Release Date */}
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
                <IoCalendarOutline size={20} className="text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-blue-800 block">
                  Release Date
                </span>
                <span className="text-sm text-blue-600 font-semibold">
                  {movie.fromDate} to {movie.toDate}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Duration */}
              <div className="flex items-center p-3 w-[49%] bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
                  <IoTimeOutline size={20} className="text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-green-800 block">
                    Duration
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    {movie.duration ? `${movie.duration} min` : "TBA"}
                  </span>
                </div>
              </div>

              {/* Version */}
              <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-3">
                  <IoFilmOutline size={20} className="text-purple-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-purple-800 block">
                    Version
                  </span>
                  <span className="text-sm text-purple-600 font-semibold">
                    {movie.version || "Standard"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actor */}
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mr-3">
                <IoPersonOutline size={20} className="text-yellow-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-yellow-800 block">
                  Actors
                </span>
                <span className="text-sm text-yellow-600 font-semibold">
                  {movie.actor || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Director */}
              <div className="flex items-center p-3 w-[49%] bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mr-3">
                  <IoVideocamOutline size={20} className="text-red-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-red-800 block">
                    Director
                  </span>
                  <span className="text-sm text-red-600 font-semibold">
                    {movie.director || "N/A"}
                  </span>
                </div>
              </div>
              {/* Cinema Room */}
              <div className="flex items-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-full mr-3">
                  <IoMapOutline size={20} className="text-teal-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-teal-800 block">
                    Cinema Room
                  </span>
                  <span className="text-sm text-teal-600 font-semibold">
                    {movie.cinemaRoom || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            {/* Type */}
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mr-3">
                <IoBookmarkOutline size={20} className="text-indigo-600" />
              </div>
              <div>
                <span className="text-sm font-medium text-indigo-800 block">
                  Genres
                </span>
                <span className="text-sm text-indigo-600 font-semibold">
                  {movie.type && movie.type.length > 0
                    ? movie.type.join(", ")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content/Synopsis */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Synopsis</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {movie.content || "No synopsis available."}
          </p>
        </div>
      </div>
    </div>
  );

  // DeletePopup Component
  const DeletePopup = () => (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MdDeleteForever className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Delete Movie</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>{selectedMovie?.movieNameEn}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowDeletePopup(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="p-[20px]  flex items-center h-full justify-between"
      onClick={handleOutsideClick}
    >
      <div className="w-[70%] space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Views</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <MdMovie size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">{movies.length}</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-[14px]">Upcoming Releases</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <FaCalendarAlt size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Expired Movies</p>
              <div className="p-2 bg-sky-100 rounded-full">
                <PiChartLineDownBold size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3 w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Average Duration</p>
              <div className="p-2 bg-rose-50 rounded-full">
                <FaClock size={20} className="text-red-500" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
        </div>
        <div className="w-full py-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  value={searchMovie}
                  onChange={(e) => {
                    setPage(1);
                    setSearchMovie(e.target.value);
                  }}
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by name movie ENG or VN"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div
                role="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Movie
              </div>
            </div>
          </div>
          <div className="bg-white min-h-[340px] max-h-[340px] p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
                  <th className="py-2">#</th>
                  <th className="py-2">Name Movie (ENG)</th>
                  <th className="py-2">Name Movie (VN)</th>
                  <th className="py-2 text-center">Release Date</th>
                  <th className="py-2 pl-2">Duration</th>
                  <th className="py-2 text-center">Version</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((mov) => (
                    <tr
                      key={mov.idMovie}
                      role="button"
                      onClick={(e) => handleRowClick(mov, e)}
                      className="border-b border-slate-200 hover:bg-slate-100 text-sm"
                    >
                      <td className="py-2 pr-6">{mov.idMovie}</td>
                      {mov.movieNameEn.length > 20 ? (
                        <td className="py-2">
                          {mov.movieNameEn.slice(0, 20) + "..."}
                        </td>
                      ) : (
                        <td className="py-2">{mov.movieNameEn}</td>
                      )}
                      {mov.movieNameVn.length > 20 ? (
                        <td className="py-2">
                          {mov.movieNameVn.slice(0, 20) + "..."}
                        </td>
                      ) : (
                        <td className="py-2">{mov.movieNameVn}</td>
                      )}
                      <td className="py-2 text-center">{mov.release_date}</td>
                      <td className="py-2 text-center">{mov.duration}</td>
                      <td className="py-2 text-center">{mov.version}</td>
                      <td className="flex items-center justify-between py-2">
                        <div
                          role="button"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <IoEyeOutline size={20} />
                        </div>
                        <div
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(mov);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaRegEdit size={20} />
                        </div>
                        <div
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(mov);
                          }}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <RiDeleteBin5Line size={20} />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end space-x-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded shadow-sm ${
                  page === i + 1
                    ? "bg-[#6051F3] text-white"
                    : "bg-white hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center top-[25%] justify-center w-[28%] fixed right-[-40px]">
        <div className="flex items-center justify-center">
          <div className="bg-white p-10 py-6 rounded-[20px] shadow-sm w-full">
            {/* Header */}
            <div className="flex items-center space-x-1 justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Upcoming Releases
              </h2>
            </div>

            {/* Timeline List */}
            <div className="space-y-4">
              {upcomingMovies.map((movie, index) => (
                <div key={index} className="relative pl-6">
                  {/* Circle Marker */}
                  <div className="absolute left-0 top-0 w-2 h-2 bg-indigo-600 rounded-full"></div>
                  {/* Line Connector */}
                  {index < upcomingMovies.length - 1 && (
                    <div
                      className="absolute left-0.5 top-3 h-full w-0.5 bg-gray-300"
                      style={{ height: "calc(100% - 12px)" }}
                    ></div>
                  )}
                  {/* Content */}
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="text-sm text-gray-600">{movie.date}</div>
                    <div className="text-md font-medium text-gray-800">
                      {movie.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAddForm && (
        <MovieForm
          formData={formData}
          handleTypeChange={handleTypeChange}
          handleInputChange={handleInputChange}
          handleScheduleChange={handleScheduleChange}
          handleSave={handleSave}
          onClose={handleCloseMovieForm}
        />
      )}
      {showEditForm && (
        <MovieForm
          isEdit={true}
          formData={formData}
          handleTypeChange={handleTypeChange}
          handleInputChange={handleInputChange}
          handleScheduleChange={handleScheduleChange}
          handleSave={handleSave}
          onClose={handleCloseMovieForm}
        />
      )}
      {showDeletePopup && <DeletePopup />}
      {selectedTooltipMovie && (
        <MovieTooltip movie={selectedTooltipMovie} position={tooltipPosition} />
      )}
    </div>
  );
};

export default MovieManagement;
