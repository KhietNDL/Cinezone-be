import React, { useState } from "react";
import { Button, Card, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";


const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const cols = [1, 2, 3, 4, 5, 6, 7, 8];

const totalSeats = 64;
const soldSeats = ["A1", "A2", "A3", "B4", "C5", "D6", "E7", "F8", "G1", "H2"];
const selectedSeatsMock = ["A5", "A6", "B5", "C6", "D5"];

const SelectSeatsPage = () => {
    const [selectedSeats, setSelectedSeats] = useState(selectedSeatsMock);

    const isSold = (seatId) => soldSeats.includes(seatId);
    const isSelected = (seatId) => selectedSeats.includes(seatId);

    const toggleSeat = (seatId) => {
        if (isSold(seatId)) return;
        setSelectedSeats((prev) =>
            prev.includes(seatId)
                ? prev.filter((seat) => seat !== seatId)
                : [...prev, seatId]
        );
    };

    return (
        <div className="p-4 mx-auto w-full">
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
            <div className="flex flex-col items-center mb-4 p-4">
                <div className="w-[40%] h-3 rounded-t-full bg-gradient-to-r from-indigo-600 to-indigo-300"></div>
                <span className="text-indigo-600 font-bold text-xl mt-2 tracking-widest">SCREEN</span>
            </div>

            {/* Ghe */}

            <div className="pl-70  flex gap-15 justify-center ">

                <div className="grid grid-cols-9 gap-2 mr-10 border border-gray-700 p-4 ">
                    {/* Column Labels (1–8) */}
                    <div></div> {/* Empty top-left corner */}
                    {cols.map((col) => (
                        <div key={col} className="text-blue-600 font-bold text-center ">{col}</div>
                    ))}
                    {rows.map((row) => (
                        <React.Fragment key={row}>
                            {/* Row Label (A–H) */}
                            <div className="font-bold text-blue-600 flex items-center justify-center">
                                {row}
                            </div>

                            {cols.map((col) => {
                                const seatId = `${row}${col}`;
                                const sold = isSold(seatId);
                                const selected = isSelected(seatId);

                                return (
                                    <div
                                        key={seatId}
                                        className={`
              w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded cursor-pointer text-3xl
              ${sold ? "text-gray-700 cursor-not-allowed" : selected ? "text-green-400" : "text-gray-400 hover:text-blue-400"}
            
            `}
                                        onClick={() => {
                                            if (!sold) toggleSeat(seatId);
                                        }}
                                    >
                                        <i className="fa-solid fa-couch"></i>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
                {/* Info Box */}
                <Card style={{  border: "1px solid lightgray" }} title={<div className="font-bold"><i className="fa-solid fa-couch"></i> Seats</div>} className="w-60">
                    <div className="flex flex-col gap-2">
                        <div >
                            <div className="border-b pb-2 mb-2">
                                <p>Seat can choose: <b>{totalSeats - soldSeats.length - selectedSeats.length}</b></p>
                                <p>Seat is sold: <span className="text-red-500 font-bold">{soldSeats.length}</span></p>
                                <p>Seat is selecting: <span className="text-green-600 font-bold">{selectedSeats.length}</span></p>
                                <p>All seat: <b>{totalSeats}</b></p>
                            </div>

                            <p>Total Price Seats: <span className="text-green-600 font-bold">${selectedSeats.length * 10}</span></p>
                        </div>

                        <div className="mt-4 flex justify-end gap-2 pt-50 pl-50.5">
                            <Button style={{ backgroundColor: "#4F46E5" }} type="primary" icon={<CheckOutlined />}>Continue</Button>
                            <Button danger icon={<CloseOutlined />}>Cancel</Button>
                        </div>
                    </div>
                </Card>

            </div>



            {/* Legend */}
            <div className="mt-4 flex gap-4 text-sm justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-300 rounded" /> Available
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-400 rounded" /> Selected
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-500 rounded" /> Sold
                </div>
            </div>
        </div>
    );
};

export default SelectSeatsPage;
