import React, { useState } from "react";
import { Button, Card, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { PiCouchDuotone } from "react-icons/pi";


const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];

const totalSeats = 64;
const soldSeats = ["A1", "A2", "A3", "B4", "C5", "D6", "E7", "F8", "G1", "H2"];
const selectedSeatsMock = ["A5", "A6", "B5", "C6", "D5"];
const coupleSeats = [
    ["H1", "H2"],
    ["H3", "H4"],
    ["H5", "H6"],
    ["H7", "H8"],
];

// Danh sách ghế VIP (ô vuông đỏ trung tâm)
const vipSeats = [
    "C3", "C4", "C5", "C6",
    "D3", "D4", "D5", "D6",
    "E3", "E4", "E5", "E6",
    "F3", "F4", "F5", "F6",
];

const NORMAL_PRICE = 10;
const VIP_PRICE = NORMAL_PRICE * 1.5;
const COUPLE_PRICE = NORMAL_PRICE * 2;

// Icon ghế đôi mới
const CoupleSeatIcon = ({ size = 48, color = "#a3a3a3" }) => (
    <PiCouchDuotone size={size} color={color} />
);

const SelectSeatsPage = () => {
    const [selectedSeats, setSelectedSeats] = useState(selectedSeatsMock);

    const isSold = (seatId) => soldSeats.includes(seatId);
    const isSelected = (seatId) => selectedSeats.includes(seatId);

    // Lấy cặp ghế đôi nếu seatId thuộc cặp
    const getCoupleSeat = (seatId) => {
        for (const couple of coupleSeats) {
            if (couple.includes(seatId)) return couple;
        }
        return null;
    };

    // Đảm bảo chỉ render 1 lần cho mỗi cặp ghế đôi
    const isFirstInCouple = (seatId) => {
        const couple = getCoupleSeat(seatId);
        return couple ? couple[0] === seatId : false;
    };

    // Toggle ghế, nếu là ghế đôi thì chọn/bỏ chọn cả cặp
    const toggleSeat = (seatId) => {
        if (isSold(seatId)) return;
        const couple = getCoupleSeat(seatId);
        if (couple) {
            const isSelectedAll = couple.every((id) => selectedSeats.includes(id));
            setSelectedSeats((prev) =>
                isSelectedAll
                    ? prev.filter((seat) => !couple.includes(seat))
                    : [...prev, ...couple.filter((id) => !prev.includes(id))]
            );
        } else {
            setSelectedSeats((prev) =>
                prev.includes(seatId)
                    ? prev.filter((seat) => seat !== seatId)
                    : [...prev, seatId]
            );
        }
    };

    // Xác định màu cho ghế
    const getSeatColor = (sold, selected) => {
        if (sold) return "#6b7280"; // gray-500
        if (selected) return "#22c55e"; // green-400
        return "#a3a3a3"; // gray-400
    };

    // Tính toán vị trí và kích thước ô vuông đỏ bao quanh 16 ghế VIP
  
    const vipBoxStyle = {
        position: "absolute",
        top: 160, 
        left: 154, 
        width: 244, 
        height: 210, 
        border: "2px solid red",
        borderRadius: 12,
        pointerEvents: "none",
        zIndex: 2,
    };

    // Hàm tính tổng tiền
    const getTotalPrice = () => {
        let total = 0;
        const countedCouple = new Set();

        selectedSeats.forEach((seatId) => {
            // Ghế couple
            const couple = getCoupleSeat(seatId);
            if (couple) {
                // Đảm bảo chỉ tính 1 lần cho mỗi cặp
                if (!countedCouple.has(couple[0]) && !countedCouple.has(couple[1])) {
                    total += COUPLE_PRICE;
                    countedCouple.add(couple[0]);
                    countedCouple.add(couple[1]);
                }
            }
            // Ghế VIP
            else if (vipSeats.includes(seatId)) {
                total += VIP_PRICE;
            }
            // Ghế thường
            else {
                total += NORMAL_PRICE;
            }
        });

        return total;
    };

    return (
        <div className="p-4 mx-auto w-full">
            <h1 className="text-3xl font-bold mb-4 text-fuchsia-700">Select Seats</h1>
            {/* Phim */}
            <div className="flex items-start gap-4 border-b border-gray-300 pb-4">
                <img
                    src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg"
                    alt="Poster Doraemon"
                    className="w-40 h-auto rounded shadow"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="text-[#FFF8A7] p-1 rounded-full shadow-md w-[125px] h-[30px] flex items-center justify-center mb-2"
                            style={{
                                background: "linear-gradient(90deg, #FACC15, #DDB61A, #DBBB3B, #CDB03D, #B1900C)",
                            }}>
                            <p className=" font-bold p-2 text-sm">Now Showing</p>
                        </div>
                        <Tag color="purple" style={{ border: "1px solid purple" }}>IMAX</Tag>
                    </div>
                    <h2 className="text-xl font-bold mt-2 p-4">
                        PHIM ĐIỆN ẢNH DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG TRANH
                    </h2>
                    <p className="text-sm mt-1 ">
                        <span className="p-2"><i className="fa-solid fa-clock"></i> 10:30 AM - 12:00 PM</span>
                        <span className="p-2"><i className="fa-solid fa-location-dot"></i> Cinema Hall 3</span>
                        <span className="p-2"><i className="fa-solid fa-couch"></i> Rows: A-H</span>
                    </p>
                </div>
            </div>
            {/* Mang hinh */}
            <div className="flex flex-col items-center  p-4">
                <div className="w-[40%] h-3 rounded-t-full bg-gradient-to-r from-indigo-600 to-indigo-300"></div>
                <span className="text-indigo-600 font-bold text-xl mt-2 tracking-widest">SCREEN</span>
            </div>

            {/* Ghe */}
            <div className="pl-70 flex gap-15 justify-center">
                <div
                    className="grid grid-cols-10 gap-2 mr-10 border border-gray-300 p-4 rounded-2xl bg-white shadow-md"
                    style={{ position: "relative" }}
                >
                    {/* Ô vuông đỏ bao quanh 16 ghế VIP */}
                    <div style={vipBoxStyle}></div>
                    {/* Cột tiêu đề (1–8) */}
                    <div></div>
                    {cols.map((col, index) => (
                        <React.Fragment key={col}>
                            {index === 4 && <div />}
                            <div className="text-blue-600 font-bold text-center">{col}</div>
                        </React.Fragment>
                    ))}

                    {/* Hàng ghế A–H */}
                    {rows.map((row) => (
                        <React.Fragment key={row}>
                            <div className="font-bold text-blue-600 flex items-center justify-center">
                                {row}
                            </div>
                            {cols.map((col, index) => {
                                const seatId = `${row}${col}`;
                                const sold = isSold(seatId);
                                const selected = isSelected(seatId);
                                const couple = getCoupleSeat(seatId);
                                if (couple && !isFirstInCouple(seatId)) return null;

                                return (
                                    <React.Fragment key={seatId}>
                                        {index === 4 && <div />}
                                        <div
                                            className={`
                                                ${couple ? "col-span-2" : ""}
                                                flex items-center justify-center rounded cursor-pointer
                                                ${sold
                                                    ? "cursor-not-allowed"
                                                    : "hover:opacity-80"
                                                }
                                            `}
                                            style={{
                                                gridColumn: couple ? `span 2 / span 2` : undefined,
                                                minWidth: couple ? 60 : 40,
                                                minHeight: 40,
                                                zIndex: 3,
                                                background: "transparent",
                                            }}
                                            onClick={() => {
                                                if (!sold) toggleSeat(seatId);
                                            }}
                                        >
                                            {couple ? (
                                                <CoupleSeatIcon color={getSeatColor(sold, selected)} />
                                            ) : (
                                                <i
                                                    className="fa-solid fa-couch"
                                                    style={{
                                                        fontSize: 28,
                                                        color: getSeatColor(sold, selected),
                                                    }}
                                                ></i>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                {/* Thông tin ghế */}
                <>
                    <card className="w-[250px] h-[500px] rounded-2xl border border-gray-300 bg-white shadow-md p-4">

                        <div className="flex flex-col gap-2">
                            <h5 className="font-bold">
                                <i className="fa-solid fa-couch"></i> Seats
                            </h5>
                            <div>
                                <div className="border-b pb-2 mb-2">
                                    <div className="border-b border-black pb-2 ">
                                        <p style={{ margin: "2px 0" }} className="flex items-center gap-5"><i className="fa-solid fa-couch" 
                                        style={{ color: "#a3a3a3", fontSize: 15}}></i>
                                        Nomal seat: ${NORMAL_PRICE}</p>
                                        <p style={{ margin: "2px 0" }} className="flex items-center gap-2"><i className="fa-solid fa-couch" 
                                        style={{ color: "#a3a3a3", fontSize: 15, border: "1px solid red", padding: 5, borderRadius: 5 }}></i>
                                        VIP seat: ${VIP_PRICE}</p>
                                        <p style={{ margin: "2px 0" }} className="flex items-center gap-3"> <CoupleSeatIcon size={25} color="#a3a3a3" /> Couple seat: ${COUPLE_PRICE}</p>
                                    </div>
                                    <p style={{ margin: "2px 0" }}>
                                        Seat can choose: <b>{totalSeats - soldSeats.length - selectedSeats.length}</b>
                                    </p>
                                    <p style={{ margin: "2px 0" }}>
                                        Seat is sold: <span className="text-red-500 font-bold">{soldSeats.length}</span>
                                    </p>
                                    <p style={{ margin: "2px 0" }}>
                                        Seat is selecting: <span className="text-green-600 font-bold">{selectedSeats.length}</span>
                                    </p>
                                    <p style={{ margin: "2px 0" }}>
                                        All seat: <b>{totalSeats}</b>
                                    </p>
                                </div>
                                <p style={{ margin: "2px 0" }}>
                                    Total Price Seats:{" "}
                                    <span className="text-green-600 font-bold">
                                        ${getTotalPrice()}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-4 flex justify-end gap-2 pt-30 pl-50.5">
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
                    </card>
                </>
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-4 text-sm justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-5 flex items-center">
                        <i className="fa-solid fa-couch" style={{ color: "#a3a3a3", fontSize: 20 }}></i>
                    </div> Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-5 flex items-center">
                        <i className="fa-solid fa-couch" style={{ color: "#22c55e", fontSize: 20 }}></i>
                    </div> Selected
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-5 flex items-center">
                        <i className="fa-solid fa-couch" style={{ color: "#6b7280", fontSize: 20 }}></i>
                    </div> Sold
                </div>
                
            </div>
        </div>
    );
};

export default SelectSeatsPage;