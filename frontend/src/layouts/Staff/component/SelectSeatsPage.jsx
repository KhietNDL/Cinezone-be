import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button, Tag, Spin } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";
import { getMovieById, getSeatsByShowtimeId } from "../../../services/APIForStaff/API";


const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
};

const SelectSeatsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movie, day, version, time, room, showtimeId } = location.state || {};

    const [movieInfo, setMovieInfo] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatData, setSeatData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const seatPrices = seatData.reduce((prices, seat) => {
        prices[seat.seatNumber] = seat.price;
        return prices;
    }, {});

    useEffect(() => {
        if (!movie || !showtimeId) {
            navigate("/staff/ticket-selling");
            return;
        }

        const fetchData = async () => {
            try {
                // Lấy thông tin phim
                const movieRes = await getMovieById(movie.MovieId);
                setMovieInfo(movieRes.data || movie);

                // Lấy danh sách ghế từ API
                const seatsRes = await getSeatsByShowtimeId(showtimeId);
                setSeatData(seatsRes.seats || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load seat data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movie, showtimeId, navigate]);

    if (!movieInfo) {
        return <div className="text-center my-8"><Spin size="large" /></div>;
    }

    if (error) {
        return <div className="text-center my-8 text-red-500">{error}</div>;
    }

    // Tính toán các thông số về ghế từ dữ liệu API
    const totalSeats = seatData.length;
    const lockedSeats = seatData.filter(seat => seat.status === "taken").length;
    const selectableSeats = totalSeats - lockedSeats;
    const selectedCount = selectedSeats.length;

    // Hàm tính tổng tiền từ ghế đã chọn
    const getTotalPrice = () => {
        return selectedSeats.reduce((total, seatNumber) => {
            const seat = seatData.find(s => s.seatNumber === seatNumber);
            return total + (seat ? seat.price : 0);
        }, 0);
    };

    // Tạo danh sách ghế đã đặt (taken) từ API
    const takenSeats = new Set(
        seatData
            .filter(seat => seat.status === "taken")
            .map(seat => seat.seatNumber)
    );

    return (
        <div className="p-4 mx-auto w-full bg-white">
            <h1 className="text-3xl font-bold mb-4 text-[#9810FA]">Select Seats</h1>

            {/* Phần thông tin phim (giữ nguyên) */}
            <div className="flex items-start gap-4 border-b border-gray-300 pb-4">
                <img
                    src={movieInfo.PosterImage}
                    alt={movieInfo.NameOfEnglish || ""}
                    className="w-40 h-auto rounded-xl shadow"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="text-[#FFF8A7] text-shadow-2xs text-shadow-amber-500 -1 rounded-full shadow-md w-[125px] h-[30px] flex items-center justify-center"
                            style={{
                                background: "linear-gradient(90deg, #FACC15, #DDB61A, #DBBB3B, #CDB03D, #B1900C)",
                            }}>
                            <p className="font-bold p-2 text-sm">Now Showing</p>
                        </div>
                        <div className="py-0.5 px-4 border-2 border-purple-700 bg-purple-300 rounded-lg text-purple-700 font-semibold" title={version}>{version}</div>
                    </div>
                    <h2 className="text-3xl font-bold mt-2 py-4">
                        {movieInfo.NameOfEnglish} <span className="text-xl">{"("}{movieInfo.NameOfVietnamese}{")"}</span>
                    </h2>
                    <p className="text-sm mt-1 flex gap-4">
                        <span className="py-2"><i className="fa-solid fa-clock"></i> {time}</span>
                        <span className="py-2"><i className="fa-solid fa-location-dot"></i> {room}</span>
                        <span className="py-2"><i className="fa-solid fa-couch"></i> Rows: A-J</span>
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-8"><Spin size="large" /></div>
            ) : (
                <div className="flex gap-10 justify-center bg-white mt-4">
                    <div className="w-[70%]">
                        <LayoutSelectSeat
                            seatDataFromAPI={seatData}
                            initialSelectedSeats={selectedSeats}
                            onSeatSelect={(selection) => setSelectedSeats(Array.from(selection.seats.map(s => s.seatNumber)))}
                            textColor="text-[#6A57F5]"
                            width={30}
                            height={30}
                            widthDouble={42}
                            heightDouble={24}
                            seatColors={{
                                available: "text-gray-500",
                                selected: "text-[#5341DB]",
                                taken: "text-[#6A7282]",
                                vip: "text-yellow-500",
                                normal: "text-gray-700",
                                couple: "text-pink-500",

                            }}
                        />
                    </div>

                    {/* Thông tin ghế */}
                    <div className="w-[30%] h-[500px] rounded-2xl border border-gray-300 bg-white shadow-md p-4">
                        <div className="flex flex-col gap-2">
                            <h5 className="font-bold">
                                <i className="fa-solid fa-couch"></i> Seats
                            </h5>
                            <div>
                                <div className="border-b">
                                    <p className="flex items-center justify-between my-2">
                                        Total seats: <span className="text-[#8A2BE2] font-bold">{totalSeats}</span>
                                    </p>
                                    <p className="flex items-center justify-between my-2">
                                        Seat available: <span className="text-blue-500 font-bold">{selectableSeats}</span>
                                    </p>
                                    <p className="flex items-center justify-between my-2">
                                        Seat sold: <span className="text-red-600 font-bold">{lockedSeats}</span>
                                    </p>
                                    <p className="flex items-center justify-between my-2">
                                        Seat is selecting: <span className="text-green-600 font-bold">{selectedCount}</span>
                                    </p>
                                </div>
                                <p className="flex items-center justify-between my-2">
                                    Total Price Seats:{" "}
                                    <span className="text-green-600 font-bold">
                                        {formatPrice(getTotalPrice())} VNĐ
                                    </span>
                                </p>
                            </div>

                            <div className="mt-4 flex justify-center gap-2 pt-30">
                                <Link
                                    to="/staff/ticket-selling/confirm-ticket"
                                    state={{
                                        movie: movieInfo,
                                        day,
                                        version,
                                        time,
                                        room,
                                        showtimeId,
                                        selectedSeats,
                                        totalPrice: getTotalPrice(),
                                        seatData: seatData.filter(seat => selectedSeats.includes(seat.seatNumber)),
                                        seatPrices: seatPrices 
                                    }}
                                >
                                    <Button
                                        style={{ backgroundColor: "#8A2BE2" }}
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        disabled={selectedCount === 0}
                                    >
                                        Continue
                                    </Button>
                                </Link>

                                <Link to="/staff/ticket-selling">
                                    <Button danger icon={<CloseOutlined />}>
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectSeatsPage;