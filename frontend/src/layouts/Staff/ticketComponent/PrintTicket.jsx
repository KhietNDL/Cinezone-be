import { Button, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaAlignLeft } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { FaTicket, FaCouch, FaLocationDot, FaMoneyBillWave } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { toast } from 'react-toastify';
import logo from '../../../assets/logoWhite.png'
import { resetBooking } from '../../../redux/features/sellingSlice';
import { useDispatch, useSelector } from 'react-redux';
import VersionCard from '../component/VersionCard';
import { getMovieById } from '../../../services/APIForStaff/API';
import BackButton from '../component/BackButton';
import { resetMember } from '../../../redux/features/memberSlice';

export default function PrintTicket() {
    const componentRef = useRef();
    const navigate = useNavigate();
    const bookingData = useSelector((state) => state.selling);
    const dispatch = useDispatch();
    const [movieInfo, setMovieInfo] = useState(null);

    const {
        selectedMovie = {},
        selectedDay: day = "",
        selectedTime: time = "",
        room = "",
        selectedVersion: version = "Standard",
        selectedSeats = [],
        totalPrice = 0,
        // memberInfo = {},
        // paymentMethod = "",
        discount = 0,
        amountPaid = totalPrice
    } = bookingData;


    // Format price function
    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN');
    };

    const handleCancel = () => {
        dispatch(resetBooking());
        dispatch(resetMember());
        navigate("/staff/ticket-selling");
    };

    useEffect(() => {
        if (!selectedMovie?.MovieId) {
            navigate("/staff/ticket-selling");
            return;
        }

        const loadMovie = async () => {
            try {
                const res = await getMovieById(selectedMovie.MovieId);
                setMovieInfo(res.data || selectedMovie);
            } catch {
                setMovieInfo(selectedMovie);
            }
        };
        loadMovie();
    }, [selectedMovie, navigate]);

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
            toast.error("Failed to generate PDF" + error.message);
        }
    };

    console.log("Data:", bookingData);

    if (!movieInfo?.NameOfEnglish) {
        return <div>Loading ticket information...</div>;
    }
    return (
        <div className='p-4 w-full flex flex-col items-center justify-center bg-white'>
            <div className="flex items-center justify-between gap-4 mb-6 w-full">
                <div className='w-[20%]'>
                    <BackButton />
                </div>
                <h1 className="mx-auto lg:mx-0 text-3xl font-bold text-[#9810FA] flex lg:items-start items-center lg:justify-start justify-center flex-col">
                    Tickets
                </h1>
                <div className='w-[20%]'></div>
            </div>

            <div className='flex flex-col items-center justify-center h-full space-y-4'>
                <div ref={componentRef}>
                    <div className='flex flex-col items-center justify-center'>
                        <div className="w-full flex flex-col justify-center items-center rounded-xl space-y-2 
                        bg-gradient-to-br from-[#FFD700] via-[#FFC300] to-[#FFB700] mt-6 mb-6">
                            <div className="relative flex h-[180px] w-[1000px] md:h-[200px] lg:h-[300px] p-5">
                                <div className='w-[63%] h-full bg-[linear-gradient(to_right,_#6366F1,_#8B5CF6,_#4F46E5)] 
                                p-4 rounded-tl-xl rounded-bl-xl'>
                                    <div className="flex items-start gap-4 border-b border-white pb-2 w-[95%] text-white">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={logo}
                                                    alt="CineZone"
                                                    className="w-[20%] h-[35px] object-cover"
                                                    style={{ filter: "brightness(0) invert(1)" }}
                                                />
                                                <div className="px-3 rounded-full shadow-md flex items-center justify-center 
                                                bg-[linear-gradient(to_right,_#FACC15,_#DDB61A,_#DBBB3B,_#CDB03D,_#B1900C)] 
                                                text-[#FFF8A7]">
                                                    <p className="font-bold p-2 text-sm leading-4"
                                                        style={{ textShadow: "0 1px 2px orange" }}>
                                                        Now Showing
                                                    </p>
                                                </div>

                                                <VersionCard
                                                    version={version}
                                                    readonly={true}
                                                    className="text-sm ring-2 ring-white text-shadow-2xs"
                                                />
                                            </div>
                                            <h2 className="text-xl font-bold mt-2 pt-2 pb-4">
                                                {movieInfo?.NameOfEnglish || "Movie Title"}
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
                                            {movieInfo?.ContentSynopsis || "Movie description not available"}
                                        </p>
                                    </div>
                                </div>
                                <div className='w-[37%] h-full bg-[linear-gradient(to_right,_#6366F1,_#8B5CF6,_#4F46E5)] rounded-tr-xl rounded-br-xl'>
                                    <div className='flex flex-col items-start justify-center h-full text-white p-4 space-y-2 w-[100%]'>
                                        <p className='flex w-full'><strong className='w-[40%]'>Screen:</strong><span>{version || "Standard"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Showtime:</strong><span>{day} - {time || "N/A"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Room:</strong><span>{room || "N/A"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Seats:</strong><span>{selectedSeats.join(', ') || "N/A"}</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Discount:</strong><span>{discount ? discount : 0}%</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Price:</strong><span>{formatPrice(totalPrice)} VNĐ</span></p>
                                        <p className='flex w-full'><strong className='w-[40%]'>Total Amount:</strong><span>{formatPrice(amountPaid)} VNĐ</span></p>
                                    </div>
                                </div>

                                <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] 
                                lg:h-[50px] rounded-full bg-white top-[-20px] md:top-[-30px] md:right-[10%] 
                                lg:right-[35%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>

                                <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] lg:w-[50px] 
                                lg:h-[50px] rounded-full bg-white bottom-[-20px] md:bottom-[-30px] lg:right-[35%]
                                 md:right-[10%] right-[20%] transform translate-x-1/2 md:translate-x-0"></div>

                                <div className="absolute h-[90%] top-[5%] border-dashed border-white border-2 
                                md:right-[45px] right-[70px] lg:right-[10%] xl:right-[37.5%]"></div>
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
                        <Button
                            style={{
                                backgroundColor: 'white', color: 'red', border: '1px solid red',
                                padding: '10px 20px', borderRadius: '5px'
                            }}
                            onClick={handleCancel}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}