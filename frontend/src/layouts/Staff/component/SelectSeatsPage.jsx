import React, { useState } from "react";
import { Button, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import DoubleSeatNoneLight from "../../../assets/DoubleSeatNoneLight.svg";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";

const NORMAL_PRICE = 10;
const VIP_PRICE = NORMAL_PRICE * 1.5;
const COUPLE_PRICE = NORMAL_PRICE * 2;

// Danh sách ghế VIP (ô vuông đỏ trung tâm)
const vipSeats = [
    "C3", "C4", "C5", "C6",
    "D3", "D4", "D5", "D6",
    "E3", "E4", "E5", "E6",
    "F3", "F4", "F5", "F6",
];

const SelectSeatsPage = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);

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
        <div className="p-4 mx-auto w-full bg-white">
            <h1 className="text-3xl font-bold mb-4 text-[#9810FA]">Select Seats</h1>
            {/* Phim */}
            <div className="flex items-start gap-4 border-b border-gray-300 pb-4">
                <img
                    src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg"
                    alt="Poster Doraemon"
                    className="w-40 h-auto rounded shadow"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="text-[#FFF8A7] text-shadow-2xs text-shadow-amber-500 p-1 rounded-full shadow-md w-[125px] h-[30px] flex items-center justify-center mb-2"
                            style={{
                                background: "linear-gradient(90deg, #FACC15, #DDB61A, #DBBB3B, #CDB03D, #B1900C)",
                            }}>
                            <p className=" font-bold p-2 text-sm">Now Showing</p>
                        </div>
                        <Tag color="purple" style={{ border: "1px solid purple" }}>IMAX</Tag>
                    </div>
                    <h2 className="text-xl font-bold mt-2 py-4">
                        PHIM ĐIỆN ẢNH DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG TRANH
                    </h2>
                    <p className="text-sm mt-1 flex gap-4">
                        <span className="py-2"><i className="fa-solid fa-clock"></i> 10:30 AM - 12:00 PM</span>
                        <span className="py-2"><i className="fa-solid fa-location-dot"></i> Cinema Hall 3</span>
                        <span className="py-2"><i className="fa-solid fa-couch"></i> Rows: A-J</span>
                    </p>
                </div>
            </div>


            {/* Sử dụng LayoutSelectSeat */}
            <div className="flex gap-10 justify-center bg-white mt-4">
                <div>
                    <LayoutSelectSeat
                        initialSelectedSeats={selectedSeats}
                        onSeatSelect={setSelectedSeats}
                        textColor="text-[#6A57F5]"
                    />
                </div>

                {/* Thông tin ghế */}
                <div className="w-[250px] h-[500px] rounded-2xl border border-gray-300 bg-white shadow-md p-4">
                    <div className="flex flex-col gap-2">
                        <h5 className="font-bold">
                            <i className="fa-solid fa-couch"></i> Seats
                        </h5>
                        <div>
                            <div className="border-b pb-2 mb-2">
                                <div className="border-b border-black pb-2 ">
                                    <p style={{ margin: "2px 0", paddingLeft: 5 }} className="flex items-center gap-4"><PiArmchairLight
                                        style={{ color: "#6A7282", fontSize: 25 }}/>
                                        Nomal seat: ${NORMAL_PRICE}</p>
                                    <p style={{ margin: "2px 0" }} className="flex items-center gap-2.5"><PiArmchairLight
                                        style={{ color: "#6A7282", fontSize: 30, border: "1px solid red", padding: 2, borderRadius: 5 }}/>
                                        VIP seat: ${VIP_PRICE}</p>
                                    <p style={{ margin: "2px 0" }} className="flex items-center gap-3">
                                        <span className="pl-1">
                                            <img src={DoubleSeatNoneLight} alt="Couple seat" className="w-7 h-7" />
                                        </span>
                                        Couple seat: ${COUPLE_PRICE}</p>
                                </div>
                                <p style={{ margin: "2px 0" }}>
                                    Seat is selecting: <span className="text-green-600 font-bold">{selectedSeats.length}</span>
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
                </div>
            </div>


        </div>
    );
};

export default SelectSeatsPage;