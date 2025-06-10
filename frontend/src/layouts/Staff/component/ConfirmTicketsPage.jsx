import { Tag } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ConfirmTicketsPage() {
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [convertToTicket, setConvertToTicket] = useState('Agree');
    const [memberChecked, setMemberChecked] = useState(false);
    const [promotionCode, setPromotionCode] = useState('');
    const [discount, setDiscount] = useState(null);

    const ticket = {
        id: 'TICKET12345',
        movie: 'PHIM ĐIỆN ẢNH DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG TRANH',
        screen: 'IMAX',
        showtime: '10:30 AM - 12:00 PM',
        room: 'Cinema Hall 3',
        seats: ['A1', 'A2', 'A3', 'A4'],
        price: 10.00
    };

    // Tính tổng tiền gốc
    const total = ticket.price * ticket.seats.length;

    // Tính tổng tiền sau khi giảm giá
    let finalTotal = total;
    if (discount) {
        // discount dạng '50%' => lấy số 50
        const percent = parseFloat(discount.replace('%', ''));
        if (!isNaN(percent)) {
            finalTotal = total * (1 - percent / 100);
        }
    }

    // Hàm xử lý khi nhấn Add promotion
    const handleAddPromotion = () => {
        // Ví dụ: nếu mã là 'GIAM50' thì giảm 50%, bạn có thể thay đổi logic này
        if (promotionCode.trim().toUpperCase() === 'GIAM50') {
            setDiscount('50%');
        } else if (promotionCode.trim().toUpperCase() === 'GIAM20') {
            setDiscount('20%');
        } else {
            setDiscount(null);
            alert('Promotion code is invalid!');
        }
    };

    return (
        <div className="p-4 mx-auto w-full">
            <h1 className="text-3xl font-bold mb-4 text-fuchsia-700">Confirm Tickets</h1>
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

            <div>
                <div className='flex items-start  p-4'>
                    <div className="flex flex-col gap-4 w-[60%] border-r border-gray-300 p-4 ">
                        <div className='text-xl font-bold'><i className="fa-solid fa-ticket"></i> Ticket</div>
                        <div>
                            <div className='flex flex-col gap-2 justify-center  border-b border-gray-300 p-4 '>
                                <p className='flex gap-10'><strong className='w-[20%]'>ID Ticket:</strong> <span>{ticket.id}</span></p>
                                <p className='flex gap-10'><strong className='w-[28%]'>Movie:</strong> <span>{ticket.movie}</span></p>
                                <p className='flex gap-10'><strong className='w-[20%]'>Screan:</strong> <span>{ticket.screen}</span></p>
                                <p className='flex gap-10'><strong className='w-[20%]'>Showtime:</strong> <span>{ticket.showtime}</span></p>
                                <p className='flex gap-10'><strong className='w-[20%]'>Room:</strong> <span>{ticket.room}</span></p>
                                <p className='flex gap-10'><strong className='w-[20%]'>Seats:</strong> <span>{ticket.seats.join(', ')}</span></p>
                                <p className='flex gap-10'><strong className='w-[20%]'>Price:</strong> <span>${ticket.price} / seat</span></p>
                            </div>
                            <p className='p-5 flex gap-10'>
                                <strong className='w-[20%] text-xl font-bold'>Total:</strong>
                                <span className='text-emerald-700 text-xl font-bold'>
                                    ${finalTotal.toFixed(2)}
                                    {discount && (
                                        <span className="text-gray-500 text-base font-normal ml-2 line-through">
                                            ${total.toFixed(2)}
                                        </span>
                                    )}
                                </span>
                            </p>
                            <div className="flex flex-col gap-2 justify-center items-center border border-gray-300 p-4 rounded-2xl bg-white shadow-md">
                                <h5> Payment Method:</h5>
                                <div className="flex gap-10">
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="paymentMethod"
                                                value="Cash"
                                                checked={paymentMethod === 'Cash'}
                                                onChange={() => setPaymentMethod('Cash')}
                                            /> Cash
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="paymentMethod"
                                                value="VNPay"
                                                checked={paymentMethod === 'VNPay'}
                                                onChange={() => setPaymentMethod('VNPay')}
                                            /> VNPay
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="paymentMethod"
                                                value="Momo"
                                                checked={paymentMethod === 'Momo'}
                                                onChange={() => setPaymentMethod('Momo')}
                                            /> Momo
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center items-center p-4">
                                <Link to="/staff/ticket-selling/ticket-infomation">
                                    <button
                                        type="button"
                                        className="bg-purple-600 text-white px-6 py-3 rounded-lg
                             hover:bg-purple-800 transition duration-300 h-10 flex 
                             items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-ticket"></i> Confirm Ticket(s)
                                    </button>
                                </Link>
                                <Link to="/staff/ticket-selling">
                                    <button type='button' className='bg-white text-red-700 border
                          border-b-red-700 px-6 py-3 rounded-lg hover:bg-red-800
                           hover:text-white transition duration-300 ml-4 h-10 flex items-center
                            justify-center gap-2'>
                                        <i className="fa-solid fa-xmark"></i> Cancel
                                    </button>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-[40%] p-4">
                        <div className='text-xl font-bold'>
                            <i className="fa-solid fa-users"></i> Member
                        </div>
                        <div className="mt-4 flex gap-3">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
                                placeholder="Member ID or Identity Card Number"
                            />
                            <button
                                type="button"
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-800"
                                style={{ borderLeft: "none" }}
                                onClick={() => setMemberChecked(true)}
                            >
                                <i className="fa-solid fa-magnifying-glass mr-2"></i>
                                Check
                            </button>
                        </div>
                        {memberChecked && (
                            <div>
                                <div className="p-4 mt-2 flex flex-col gap-3">
                                    <p className="mt-2 flex"><strong className='w-[40%]'>Member ID:</strong> <span>123456789</span></p>
                                    <p className='flex'><strong className='w-[40%]'>Identity card:</strong> 123123</p>
                                    <p className='flex'><strong className='w-[40%]'>Full Name:</strong> John Doe</p>
                                    <p className='flex'><strong className='w-[40%]'>Phone:</strong> 0123456789</p>
                                    <p className='flex'><strong className='w-[40%]'>Score:</strong> <span className='text-teal-700'>20.500</span></p>
                                    <div className="mt-4 flex gap-3">
                                        <strong className='w-[40%]'>Convert to ticket:</strong>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="convertToTicket"
                                                    value="Agree"
                                                    checked={convertToTicket === 'Agree'}
                                                    onChange={() => setConvertToTicket('Agree')} /> Agree
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="convertToTicket"
                                                    value="Disagree"
                                                    checked={convertToTicket === 'Disagree'}
                                                    onChange={() => setConvertToTicket('Disagree')} /> Disagree
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <input
                                            type="text"
                                            value={promotionCode}
                                            onChange={e => setPromotionCode(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
                                            placeholder="Promotion code..."
                                        />
                                        <button
                                            type="button"
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-800"
                                            style={{ borderLeft: "none" }}
                                            onClick={() => setDiscount('50%')}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {discount && <p className='flex'><strong className='w-[40%]'>Discount:</strong> <span className='text-emerald-600 text-xl font-bold'>{discount}</span></p>}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}
