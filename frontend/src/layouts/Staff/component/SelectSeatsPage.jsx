import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import DoubleSeatNoneLight from "../../../assets/DoubleSeatNoneLight.svg";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";
import { getMovieById } from "../../../services/APIForStaff/API";

const NORMAL_PRICE = 100000;
// const VIP_PRICE = NORMAL_PRICE * 1.5;
const COUPLE_PRICE = NORMAL_PRICE * 2;

const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
};

// // Danh sách ghế VIP (ô vuông đỏ trung tâm)
// const vipSeats = [
//     "C3", "C4", "C5", "C6",
//     "D3", "D4", "D5", "D6",
//     "E3", "E4", "E5", "E6",
//     "F3", "F4", "F5", "F6",
// ];

const seatLayout = [
    { row: "A", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "B", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "C", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "D", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "E", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "F", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "G", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "H", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "I", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { row: "J", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
];
const takenSeats = new Set([
    "J2", "J3", "H5", "H6", "H12", "H13", "G2", "G3", "G4", "G13", "G14", "G15", "G16",
    "F1", "F2", "F3", "F15", "F16", "E1", "E2", "E3", "C1", "C2", "C3", "C4", "C5", "C6",
    "B5", "B6", "B7", "B8", "B9", "A3", "A4", "A5", "A6", "A7", "A8", "A9"
]);



const SelectSeatsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movie, day, version, time, room } = location.state || {};

    const [movieInfo, setMovieInfo] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        if (!movie) {
            // Nếu không có thông tin phim, quay lại trang trước
            navigate("/staff/ticket-selling");
            return;
        }
        // Nếu đã có đủ thông tin phim, có thể lấy chi tiết từ API (nếu cần)
        const fetchMovie = async () => {
            try {
                const res = await getMovieById(movie.MovieId);
                setMovieInfo(res.data || movie); // fallback nếu API lỗi
            } catch {
                setMovieInfo(movie);
            }
        };
        fetchMovie();
    }, [movie, navigate]);

    if (!movieInfo) {
        return <div>Loading movie info...</div>;
    }

    // Tính tổng số ghế
    const totalSeats = seatLayout.reduce((sum, row) => sum + row.seats.length, 0);
    // Số ghế không được chọn
    const lockedSeats = takenSeats.size;
    // Số ghế có thể chọn
    const selectableSeats = totalSeats - lockedSeats;
    // Số ghế đã chọn
    const selectedCount = selectedSeats.length;

    // Hàm tính tổng tiền
    const getTotalPrice = () => {
        let total = 0;
        const countedCouple = new Set();

        selectedSeats.forEach((seatId) => {
            // Ghế đôi: J row
            if (seatId.startsWith("J")) {
                if (!countedCouple.has(seatId)) {
                    total += COUPLE_PRICE;
                    countedCouple.add(seatId);
                }
            }
            // // Ghế VIP
            // else if (vipSeats.includes(seatId)) {
            //     total += VIP_PRICE;
            // }
            // Ghế thường
            else {
                total += NORMAL_PRICE;
            }
        });

        return total;
    };

    return (
        <div className="p-4 mx-auto w-full bg-white">
            <h1 className="text-3xl font-bold mb-4 text-[#9810FA]">Select Seats</h1>
            {/* Phim */}
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


            {/* Sử dụng LayoutSelectSeat */}
            <div className="flex gap-10 justify-center bg-white mt-4">
                <div className="w-[70%]">
                    <LayoutSelectSeat
                        initialSelectedSeats={selectedSeats}
                        onSeatSelect={setSelectedSeats}
                        textColor="text-[#6A57F5]"
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
                                <div className="border-b border-black pb-2 ">
                                    <p className="pl-1 my-2 flex items-center justify-between">
                                        <span className="flex items-center gap-2"><PiArmchairLight
                                            style={{ color: "#6A7282", fontSize: 25 }} />
                                            Nomal seat:</span>
                                        <span>{formatPrice(NORMAL_PRICE)} VNĐ</span></p>
                                    {/* <p style={{ margin: "2px 0" }} className="flex items-center gap-2.5"><PiArmchairLight
                                        style={{ color: "#6A7282", fontSize: 30, border: "1px solid red", padding: 2, borderRadius: 5 }}/>
                                        VIP seat: ${VIP_PRICE}</p> */}
                                    <p className="my-2 flex items-center justify-between">
                                        <span className="flex items-center gap-1 pl-1">
                                            <img src={DoubleSeatNoneLight} alt="Couple seat" className="w-7 h-7" />
                                            <p>Couple seat:</p>
                                        </span>
                                        <span>{formatPrice(COUPLE_PRICE)} VNĐ</span>
                                    </p>
                                </div>
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
                            <Link to="/staff/ticket-selling/confirm-ticket">
                                <Button
                                    style={{ backgroundColor: "#8A2BE2" }}
                                    type="primary"
                                    icon={<CheckOutlined />}
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
        </div>
    );
};

export default SelectSeatsPage;