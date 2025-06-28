import { Button, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaAlignLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaTicket, FaCouch, FaLocationDot, FaMoneyBillWave } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { toast } from 'react-toastify';
import logo from '../../../assets/logoWhite.png'

export default function PrintTicket() {
    const componentRef = useRef();
    const [bookingData, setBookingData] = useState(null);

    const {
        movie = {},
        day = "",
        time = "",
        room = "",
        version = "Standard",
        selectedSeats = [],
        totalPrice = 0,
        memberInfo = {},
        paymentMethod = "",
        discount = 0,
        amountPaid = totalPrice
    } = bookingData || {};


    // Format price function
    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN');
    };


    useEffect(() => {
        const dataResult = async () => {
            try {
                const savedData = localStorage.getItem('currentBooking');
                if (!savedData) throw new Error("Ticket information not found");

                const parsedData = JSON.parse(savedData);
                if (!parsedData.bookingId) throw new Error("Invalid ticket data");

                setBookingData(parsedData);
                console.log(parsedData);
                toast.success("Data loaded successfully!");
            } catch (error) {
                toast.error(error.message);
            }
        };
        dataResult();
    }, []);



    const handleExportPdf = async () => {
        if (!componentRef.current) return;

        try {
            const input = componentRef.current;
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save("ticket.pdf");
        } catch (error) {
            toast.error("Failed to generate PDF");
        }
    };

    if (!bookingData) {
        return <div>Loading ticket information...</div>;
    }

    return (
        <div className='p-4 mx-auto w-full'>
            <h1 className="text-3xl font-bold mb-4 text-fuchsia-700">Tickets</h1>
            <div className='flex flex-col items-center justify-center h-full space-y-4'>
                <div ref={componentRef}>
                    <div className='flex flex-col items-center justify-center'>
                        <div className="w-full flex flex-col justify-center items-center rounded-xl space-y-2 bg-[linear-gradient(to_right,_#6366F1,_#8B5CF6,_#4F46E5)] mt-6 mb-6">
                            <div className="relative flex h-[180px] w-[1000px] md:h-[200px] lg:h-[300px] p-5">
                                <div className='w-[63%] h-full'>
                                    <div className="flex items-start gap-4 border-b border-white pb-2 w-[95%] text-white">
                                        {/* <img
                                            src={movie.PosterImage}
                                            alt={`Poster ${movie?.NameOfEnglish}`}
                                            className="w-25 h-auto rounded shadow"
                                        /> */}
                                        <div className="flex-1">

                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={logo}
                                                    alt="CineZone"
                                                    className="w-[20%] h-[35px] object-cover" 
                                                    style={{ filter: "brightness(0) invert(1)" }} 
                                                />
                                                <div
                                                    className=" p-1 rounded-full shadow-md w-[110px] h-[25px] flex items-center justify-center"
                                                    style={{
                                                        background: "linear-gradient(90deg, #FACC15, #DDB61A, #DBBB3B, #CDB03D, #B1900C)",
                                                        color: "#FFF8A7"
                                                    }}
                                                >
                                                    <p className="font-bold p-2 text-xs"
                                                        style={{
                                                            fontSize: "0.75rem",
                                                            lineHeight: "1rem",
                                                            textShadow: "0 1px 2px Orange"
                                                        }}>Now Showing</p>
                                                </div>
                                                <div className="bg-white text-xs px-2 py-1 rounded-sm "
                                                    style={{ color: "#86198F", border: "1px solid #86198F" }}>{version || "Standard"}
                                                </div>
                                            </div>
                                            <h2 className="text-xl font-bold mt-2 pt-2 pb-4">
                                                {movie?.NameOfEnglish || "Movie Title"}
                                            </h2>
                                            <p className="text-xs flex gap-3">
                                                <span className="py-2"><i className="fa-solid fa-clock"></i> {day} - {time || "N/A"}</span>
                                                <span className="py-2"><i className="fa-solid fa-location-dot"></i> {room || "N/A"}</span>
                                                <span className="py-2"><i className="fa-solid fa-couch"></i> Seats: {selectedSeats.join(', ') || "N/A"}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className='text-white'>
                                        <h5 className='flex items-center gap-2 mt-2 text-sm font-bold'>
                                            <FaAlignLeft /> Synopsis:
                                        </h5>
                                        <p className='p-2 text-sm'>
                                            {movie?.Description || "Movie description not available"}
                                        </p>
                                    </div>
                                </div>
                                <div className='w-[37%] h-full'>
                                    <div className='flex flex-col items-start justify-center h-full text-white p-4 space-y-2 w-[100%]'>
                                        {/* <p className='flex w-full'><strong className='w-[40%]'>ID Ticket:</strong><span>{bookingId || "N/A"}</span></p> */}
                                        <p className='flex w-full'><strong className='w-[40%]'>Screen:</strong><span>{version || "Standard"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Showtime:</strong><span>{day} - {time || "N/A"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Room:</strong><span>{room || "N/A"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Seats:</strong><span>{selectedSeats.join(', ') || "N/A"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Discount:</strong><span>{discount ? discount : 0}%</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Price:</strong><span>{formatPrice(totalPrice)} VNĐ</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Total Amount:</strong><span>{formatPrice(amountPaid)} VNĐ</span></p>
                                    </div>
                                </div>

                                {/* Decorative circles and dashed line */}
                                <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-white top-[-20px] md:top-[-30px] md:right-[10%] lg:right-[35%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>
                                <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] lg:h-[50px] rounded-full bg-white bottom-[-20px] md:bottom-[-30px] lg:right-[35%] md:right-[10%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>
                                <div className="absolute h-[90%] top-[5%] border-dashed border-white border-2 md:right-[45px] right-[70px] lg:right-[10%] xl:right-[37.5%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6 flex gap-4'>
                    <Button
                        onClick={handleExportPdf}
                        style={{ backgroundColor: '#7254EF', color: 'white', padding: '10px 20px', borderRadius: '5px' }}
                    >
                        <i className="fa-solid fa-print "></i> Print Ticket
                    </Button>
                    <Link to="/staff/ticket-selling">
                        <Button style={{ backgroundColor: 'white', color: 'red', border: '1px solid red', padding: '10px 20px', borderRadius: '5px' }}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}