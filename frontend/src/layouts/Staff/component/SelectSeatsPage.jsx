import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Tag, Spin, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { getMovieById, getSeatsByShowtimeId } from "../../../services/APIForStaff/API";

const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
};

const SelectSeatsPage = () => {
    const navigate = useNavigate();
    const [movieInfo, setMovieInfo] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatData, setSeatData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBookingData = () => {
            const savedData = localStorage.getItem('currentBooking');
            if (!savedData) {
                message.error("No booking data found");
                navigate("/staff/ticket-selling");
                return;
            }

            try {
                const parsedData = JSON.parse(savedData);
                setBookingData(parsedData);
            } catch (err) {
                message.error("Invalid booking data");
                navigate("/staff/ticket-selling");
            }
        };

        loadBookingData();
    }, [navigate]);

    useEffect(() => {
        if (!bookingData) return;

        const fetchData = async () => {
            try {
                // Get movie info
                const movieRes = await getMovieById(bookingData.movie.MovieId);
                setMovieInfo(movieRes.data || bookingData.movie);

                // Get seats data
                const seatsRes = await getSeatsByShowtimeId(bookingData.showtimeId);
                setSeatData(seatsRes.seats || []);

                // Load any previously selected seats from localStorage
                const savedSeats = localStorage.getItem('selectedSeats');
                if (savedSeats) {
                    const parsedSeats = JSON.parse(savedSeats);
                    // Filter out seats that are no longer available
                    const availableSeats = new Set(
                        seatsRes.seats
                            .filter(seat => seat.status !== "taken")
                            .map(seat => seat.seatNumber)
                    );
                    setSelectedSeats(parsedSeats.filter(seat => availableSeats.has(seat)));
                }
            } catch (err) {
                setError("Failed to load seat data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookingData]);

    const handleSeatSelect = (selection) => {
        const newSelectedSeats = Array.from(selection.seats.map(s => s.seatNumber));
        setSelectedSeats(newSelectedSeats);
        localStorage.setItem('selectedSeats', JSON.stringify(newSelectedSeats));
    };

    const handleCancel = () => {
        localStorage.removeItem('currentBooking');
        localStorage.removeItem('current_member');
        localStorage.removeItem('selectedSeats');
        navigate("/staff/ticket-selling");
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            message.warning("Please select at least one seat");
            return;
        }

        // Calculate total price
        const totalPrice = selectedSeats.reduce((total, seatNumber) => {
            const seat = seatData.find(s => s.seatNumber === seatNumber);
            return total + (seat ? seat.price : 0);
        }, 0);

        // Update booking data in localStorage
        const updatedBooking = {
            ...bookingData,
            selectedSeats,
            seatData: seatData.filter(seat => selectedSeats.includes(seat.seatNumber)),
            totalPrice
        };

        localStorage.setItem('currentBooking', JSON.stringify(updatedBooking));
        navigate("/staff/ticket-selling/confirm-ticket");
    };

    // Calculate seat information
    const totalSeats = seatData.length;
    const lockedSeats = seatData.filter(seat => seat.status === "taken").length;
    const selectableSeats = totalSeats - lockedSeats;
    const selectedCount = selectedSeats.length;

    // Function to calculate total price from selected seats
    const getTotalPrice = () => {
        return selectedSeats.reduce((total, seatNumber) => {
            const seat = seatData.find(s => s.seatNumber === seatNumber);
            return total + (seat ? seat.price : 0);
        }, 0);
    };

    if (!movieInfo || !bookingData) {
        return <div className="text-center my-8"><Spin size="large" /></div>;
    }

    if (error) {
        return <div className="text-center my-8 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 mx-auto w-full bg-white">
            <h1 className="text-3xl font-bold mb-4 text-[#9810FA]">Select Seats</h1>

            {/* Movie information section */}
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
                        <div className="py-0.5 px-4 border-2 border-purple-700 bg-purple-300 rounded-lg text-purple-700 font-semibold"
                            title={bookingData.version}>
                            {bookingData.version}
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mt-2 py-4">
                        {movieInfo.NameOfEnglish} <span className="text-xl">{"("}{movieInfo.NameOfVietnamese}{")"}</span>
                    </h2>
                    <p className="text-sm mt-1 flex gap-4">
                        <span className="py-2"><i className="fa-solid fa-clock"></i> {bookingData.time}</span>
                        <span className="py-2"><i className="fa-solid fa-location-dot"></i> {bookingData.room}</span>
                        <span className="py-2"><i className="fa-solid fa-couch"></i> Row: A-J</span>
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-8"><Spin size="large" /></div>
            ) : (
                <div className="flex gap-10 justify-center bg-white mt-4">
                    <div className="w-[70%] flex justify-center">
                        <LayoutSelectSeat
                            seatDataFromAPI={seatData}
                            initialSelectedSeats={selectedSeats}
                            onSeatSelect={handleSeatSelect}
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
                            className="w-full"
                        />
                    </div>

                    {/* Seat information */}
                    <div className="w-[30%] h-[50%] rounded-2xl border border-gray-300 bg-white shadow-md p-4">
                        <div className="flex flex-col gap-2">
                            <h5 className="font-bold">
                                <i className="fa-solid fa-couch"></i> Seat Information
                            </h5>
                            <div>
                                <div className="border-b">
                                    <p className="flex items-center justify-between my-2">
                                        Total seats: <span className="text-[#8A2BE2] font-bold">{totalSeats}</span>
                                    </p>
                                    <p className="flex items-center justify-between my-2">
                                        Available seats: <span className="text-blue-500 font-bold">{selectableSeats}</span>
                                    </p>
                                    <p className="flex items-center justify-between my-2">
                                        Sold seats: <span className="text-red-600 font-bold">{lockedSeats}</span>
                                    </p>
                                    <p className="flex items-center justify-between my-2">
                                        Selected seats: <span className="text-green-600 font-bold">{selectedCount}</span>
                                    </p>
                                </div>
                                <p className="flex items-center justify-between my-2">
                                    Total price:{" "}
                                    <span className="text-green-600 font-bold">
                                        {formatPrice(getTotalPrice())} VND
                                    </span>
                                </p>
                            </div>

                            {/* Selected seats list */}
                            {selectedCount > 0 && (
                                <div className="mt-4">
                                    <h6 className="font-semibold mb-2">Selected seats:</h6>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.map(seatNumber => {
                                            const seat = seatData.find(s => s.seatNumber === seatNumber);
                                            return (
                                                <Tag key={seatNumber} color="purple">
                                                    {seatNumber} - {formatPrice(seat?.price || 0)} VND
                                                </Tag>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex justify-center gap-2 py-5">
                                <Button
                                    style={{ backgroundColor: "#8A2BE2" }}
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={handleContinue}
                                    disabled={selectedCount === 0}
                                >
                                    Continue
                                </Button>

                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectSeatsPage;