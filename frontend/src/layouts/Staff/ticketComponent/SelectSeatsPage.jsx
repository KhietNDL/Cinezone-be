import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Tag, Spin, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { getMovieById, getSeatsByShowtimeId } from "../../../services/APIForStaff/API";
import { useDispatch, useSelector } from 'react-redux';
import {
    setSelectedSeats,
    setSeatData,
    setTotalPrice,
    setCompleteBooking,
    resetBooking
} from '../../../redux/features/sellingSlice';

import { resetMember } from '../../../redux/features/memberSlice';
import VersionCard from "../component/VersionCard";

const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
};

const SelectSeatsPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bookingData = useSelector((state) => state.selling);
    const seatData = bookingData.seatData || [];
    const selectedSeats = bookingData.selectedSeats || [];
    const [movieInfo, setMovieInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    // Sử dụng ref để track xem đã fetch data chưa
    const hasFetchedData = useRef(false);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsMobile(window.innerWidth <= 640);
    //     };

    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    // FIX: Tách riêng các dependencies và chỉ fetch khi cần thiết
    useEffect(() => {
        // Kiểm tra điều kiện cần thiết trước khi fetch
        if (!bookingData?.selectedMovie?.MovieId || !bookingData?.showtimeId) {
            message.error("No booking data found");
            navigate("/staff/ticket-selling");
            return;
        }

        // Nếu đã fetch rồi thì không fetch nữa
        if (hasFetchedData.current) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching data...'); // Debug log

                // Get movie info
                const movieRes = await getMovieById(bookingData.selectedMovie.MovieId);
                setMovieInfo(movieRes.data || bookingData.selectedMovie);

                // Get seats data
                const seatsRes = await getSeatsByShowtimeId(bookingData.showtimeId);
                dispatch(setSeatData(seatsRes.seats || []));

                // Đánh dấu đã fetch xong
                hasFetchedData.current = true;

            } catch (err) {
                setError("Failed to load seat data");
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [
        // FIX: Chỉ dependency những giá trị thực sự cần thiết
        bookingData?.selectedMovie?.MovieId,
        bookingData?.showtimeId,
        navigate,
        dispatch
    ]);

    // FIX: Reset flag khi component unmount hoặc booking data thay đổi hoàn toàn
    useEffect(() => {
        return () => {
            hasFetchedData.current = false;
        };
    }, [bookingData?.selectedMovie?.MovieId, bookingData?.showtimeId]);

    const handleSeatSelect = useCallback((selection) => {
        const newSelectedSeats = Array.from(selection.seats.map(s => s.seatNumber));
        dispatch(setSelectedSeats(newSelectedSeats));
    }, [dispatch]);

    const handleCancel = useCallback(() => {
        dispatch(resetBooking());
        dispatch(resetMember());
        navigate("/staff/ticket-selling");
    }, [dispatch, navigate]);

    const handleContinue = useCallback(() => {
        if (selectedSeats.length === 0) {
            message.warning("Please select at least one seat");
            return;
        }

        // Calculate total price
        const totalPrice = selectedSeats.reduce((total, seatNumber) => {
            const seat = seatData.find(s => s.seatNumber === seatNumber);
            return total + (seat ? seat.price : 0);
        }, 0);

        dispatch(setTotalPrice(totalPrice));
        navigate("/staff/ticket-selling/confirm-ticket");
    }, [selectedSeats, seatData, dispatch, navigate]);

    // FIX: Memoize các calculation để tránh re-render không cần thiết
    const seatStats = React.useMemo(() => {
        const totalSeats = seatData.length;
        const lockedSeats = seatData.filter(seat => seat.status === "taken").length;
        const selectableSeats = totalSeats - lockedSeats;
        const selectedCount = selectedSeats.length;

        const totalPrice = selectedSeats.reduce((total, seatNumber) => {
            const seat = seatData.find(s => s.seatNumber === seatNumber);
            return total + (seat ? seat.price : 0);
        }, 0);

        return {
            totalSeats,
            lockedSeats,
            selectableSeats,
            selectedCount,
            totalPrice
        };
    }, [seatData, selectedSeats]);

    // Early returns for different states
    if (loading) {
        return <div className="text-center my-8"><Spin size="large" /></div>;
    }

    if (error) {
        return <div className="text-center my-8 text-red-500">{error}</div>;
    }

    if (!movieInfo || !bookingData) {
        return <div className="text-center my-8"><Spin size="large" /></div>;
    }

    return (
        <div className="p-4 mx-auto w-full bg-[#fafbfc]">
            <h1 className="text-3xl font-bold mb-4 text-[#9810FA] justify-between items-center flex flex-col sm:flex-row">
                Select Seats
            </h1>

            {/* Movie information section */}
            <div className="flex items-center sm:items-start gap-4 border-b border-gray-300 pb-4 flex-col sm:flex-row">
                <img
                    src={movieInfo.PosterImage}
                    alt={movieInfo.NameOfEnglish || ""}
                    className="w-40 h-auto rounded-xl shadow"
                />
                <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-2 rounded-full shadow-md  flex items-center justify-center 
                                        bg-[linear-gradient(to_right,_#FACC15,_#DDB61A,_#DBBB3B,_#CDB03D,_#B1900C)] text-[#FFF8A7]">
                            <p className="font-bold text-sm leading-4 text-[#FFF8A7] [text-shadow:_0_1px_2px_orange]">
                                Now Showing
                            </p>
                        </div>
                        {bookingData.selectedVersion && (
                            <VersionCard
                                version={bookingData.selectedVersion}
                                readonly={true}
                                className="text-sm"
                            />
                        )}
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-2 mt-2 py-4">
                        <h2 className="text-3xl font-bold">
                            {movieInfo.NameOfEnglish}
                        </h2>
                        {movieInfo.NameOfVietnamese && (
                            <p className="text-xl font-semibold">({movieInfo.NameOfVietnamese})</p>
                        )}
                    </div>
                    <p className="text-sm mt-1 flex gap-4">
                        {bookingData.selectedTime && (
                            <span className="py-2">
                                <i className="fa-solid fa-clock"></i> {bookingData.selectedTime}
                            </span>
                        )}
                        {bookingData.room && (
                            <span className="py-2">
                                <i className="fa-solid fa-location-dot"></i> {bookingData.room}
                            </span>
                        )}
                        <span className="py-2">
                            <i className="fa-solid fa-couch"></i> Row: A-J
                        </span>
                    </p>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col lg:flex-row gap-10 justify-center bg-white mt-4">
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[750px] overflow-x-auto">
                        <div className="min-w-[300px] mx-auto">
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
                                    holding: "text-green-800",
                                    vip: "text-yellow-500",
                                    normal: "text-gray-700",
                                    couple: "text-pink-500",
                                }}
                                showInfo={false}
                                className="w-full px-2"
                            />
                        </div>
                    </div>
                </div>


                {/* Seat information */}
                <div className="w-full lg:w-[30%] h-[50%] rounded-2xl border border-gray-300 bg-white shadow-md p-4">
                    <div className="flex flex-col gap-2">
                        <h5 className="font-bold">
                            <i className="fa-solid fa-couch"></i> Seat Information
                        </h5>
                        <div>
                            <div className="border-b">
                                <p className="flex items-center justify-between my-2">
                                    Total seats: <span className="text-[#8A2BE2] font-bold">{seatStats.totalSeats}</span>
                                </p>
                                <p className="flex items-center justify-between my-2">
                                    Available seats: <span className="text-blue-500 font-bold">{seatStats.selectableSeats}</span>
                                </p>
                                <p className="flex items-center justify-between my-2">
                                    Sold seats: <span className="text-red-600 font-bold">{seatStats.lockedSeats}</span>
                                </p>
                                <p className="flex items-center justify-between my-2">
                                    Selected seats: <span className="text-green-600 font-bold">{seatStats.selectedCount}</span>
                                </p>
                            </div>
                            <p className="flex items-center justify-between my-2">
                                Total price:{" "}
                                <span className="text-green-600 font-bold">
                                    {formatPrice(seatStats.totalPrice)} VNĐ
                                </span>
                            </p>
                        </div>

                        {/* Selected seats list */}
                        {seatStats.selectedCount > 0 && (
                            <div className="mt-4">
                                <h6 className="font-semibold mb-2">Selected seats:</h6>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map(seatNumber => {
                                        const seat = seatData.find(s => s.seatNumber === seatNumber);
                                        return (
                                            <Tag key={seatNumber} color="purple">
                                                {seatNumber} - {formatPrice(seat?.price || 0)} VNĐ
                                            </Tag>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="mt-4 flex justify-center gap-2 py-5">
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={handleContinue}
                                disabled={seatStats.selectedCount === 0}
                                className="font-semibold px-4 py-2"
                            >
                                Continue
                            </Button>

                            <Button
                                danger
                                type="default"
                                icon={<CloseOutlined />}
                                onClick={handleCancel}
                                className="font-semibold px-4 py-2"
                            >
                                Cancel
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSeatsPage;