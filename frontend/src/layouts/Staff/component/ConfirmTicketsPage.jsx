import { Tag } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdCash } from "react-icons/io";
import vnpay from '../../../assets/vnpay-seeklogo.png'
import momo from "../../../assets/momo-seeklogo.png";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SiTicktick } from "react-icons/si";
import { RiFilmAiFill, RiMovie2AiFill } from "react-icons/ri";
import { FaCalendarDays, FaLocationDot, FaCouch, FaUser, FaFire} from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { FaMoneyBillWave, FaIdCard, FaIdBadge, FaPhoneAlt, FaExchangeAlt} from "react-icons/fa";


export default function ConfirmTicketsPage() {
    const [discount, setDiscount] = useState(null);
    const [memberChecked, setMemberChecked] = useState(false);

    const ticket = {
        id: 'TICKET12345',
        movie: 'PHIM ĐIỆN ẢNH DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG TRANH',
        screen: 'IMAX',
        date: '16/06/2025',
        showtime: '10:30 AM - 12:00 PM',
        room: 'Cinema Hall 3',
        seats: ['A1', 'A2', 'A3', 'A4'],
        price: 10.00
    };

    const member = {
        id: '123456789',
        identityCard: '123123',
        fullName: 'John Doe',
        phone: '0123456789',
        score: 40500
    }

    // Tính tổng tiền gốc
    const total = ticket.price * ticket.seats.length;

    const validationSchema = Yup.object().shape({
        memberId: Yup.string()
            .matches(/^\d+$/, 'You must enter a valid Member ID/Identity Card')
            .required('Member ID/Identity Card is required'),
        convertToTicket: Yup.string().required('Please select convert to ticket option'),
        promotionCode: Yup.string().when('convertToTicket', {
            is: 'Agree',
            then: (schema) => schema.test('empty', 'Promotion code must be empty when Agree', val => !val || val === ''),
            otherwise: (schema) => schema,
        }),
        paymentMethod: Yup.string().required('Please select payment method'),
    });

    const handleAddPromotion = (promotionCode, setFieldValue) => {
        if (promotionCode.trim().toUpperCase() === 'GIAM50') {
            setDiscount(50);
            toast.success('Applied 50% discount code successfully!');
        } else if (promotionCode.trim().toUpperCase() === 'GIAM20') {
            setDiscount(20);
            toast.success('Applied 20% discount code successfully!');
        } else {
            setDiscount(null);
            toast.error('Promotion code is invalid!');
            setFieldValue('promotionCode', '');
        }
    };

    const handleSubmit = (values, { setSubmitting }) => {
        validationSchema
            .validate(values, { abortEarly: false })
            .then(() => {
                toast.success('Submit success!');
                setSubmitting(false);
            })
            .catch((err) => {
                if (err.inner) {
                    err.inner.forEach(e => toast.error(e.message));
                } else {
                    toast.error(err.message);
                }
                setSubmitting(false);
            });
    };

    return (
        <div className="p-4 mx-auto w-full ">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4 text-[#9810FA]">Confirm Tickets</h1>
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
                    <p className="text-sm mt-1 flex gap-4 ">
                        <span className="py-2"><i className="fa-solid fa-clock"></i> 10:30 AM - 12:00 PM</span>
                        <span className="py-2"><i className="fa-solid fa-location-dot"></i> Cinema Hall 3</span>
                        <span className="py-2"><i className="fa-solid fa-couch"></i> Rows: A-H</span>
                    </p>
                </div>
            </div>

            <Formik
                initialValues={{
                    memberId: '',
                    convertToTicket: '',
                    promotionCode: '',
                    paymentMethod: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => {
                    // Logic tính toán tổng tiền và điểm
                    let displayFinalTotal = total;
                    let displayUsedScore = 0;
                    let displayUpdatedScore = member.score;
                    let enoughScore = false;

                    if (memberChecked && values.convertToTicket === 'Agree') {
                        const seatsCount = ticket.seats.length;
                        const requiredScore = seatsCount * 10000;
                        if (member.score >= requiredScore) {
                            displayFinalTotal = 0;
                            displayUsedScore = requiredScore;
                            displayUpdatedScore = member.score - requiredScore;
                            enoughScore = true;
                        } else {
                            displayFinalTotal = total;
                            displayUsedScore = 0;
                            displayUpdatedScore = member.score;
                            enoughScore = false;
                        }
                    } else if (memberChecked && values.convertToTicket === 'Disagree' && discount) {
                        displayFinalTotal = total * (1 - discount / 100);
                    }

                    return (
                        <Form>
                            <div className='flex items-start  p-4'>
                                <div className="flex flex-col  w-[60%] border-r border-gray-300 p-4 ">
                                    <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'><i className="fa-solid fa-ticket"></i> Ticket</h3>
                                    <div>
                                        <div className='flex flex-col gap-2 justify-center  border-b border-gray-300 px-4 pb-4 '>
                                            {/* <p className='flex flex-col py-2'><p className='w-[50%] font-semibold text-gray-800 '>ID Ticket:</p> <span className='text-gray-600'>{ticket.id}</span></p> */}
                                            <div className='flex flex-col py-2'>
                                                <span className='w-[26%] font-semibold text-gray-800 flex gap-1 items-center'><RiFilmAiFill /> Movie</span>
                                                <span className='text-gray-600'>{ticket.movie}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className='w-[50%]'>
                                                    <div className='flex flex-col py-2'>
                                                        <span className='w-[50%] font-semibold text-gray-800 flex gap-1 items-center'><RiMovie2AiFill /> Screan</span>
                                                        <span className='text-gray-600'>{ticket.screen}</span>
                                                    </div>
                                                    <div className='flex flex-col py-2'>
                                                        <span className='w-[50%] font-semibold text-gray-800 flex gap-1 items-center'><FaCalendarDays /> Date</span>
                                                        <span className='text-gray-600'>{ticket.date}</span>
                                                    </div>
                                                    <div className='flex flex-col py-2'>
                                                        <span className='w-[50%] font-semibold text-gray-800 flex gap-1 items-center'><IoTime /> Show Time</span>
                                                        <span className='text-gray-600'>{ticket.showtime}</span>
                                                    </div>
                                                </div>
                                                <div className='w-[50%]'>
                                                    <div className='flex flex-col py-2'>
                                                        <span className='w-[50%] font-semibold text-gray-800 flex gap-1 items-center'><FaLocationDot /> Room</span>
                                                        <span className='text-gray-600'>{ticket.room}</span>
                                                    </div>
                                                    <div className='flex flex-col py-2'>
                                                        <span className='w-[50%] font-semibold text-gray-800 flex gap-1 items-center'><FaCouch  /> Seats</span>
                                                        <div className='flex items-center gap-5'>
                                                            <span className='text-gray-600'>{ticket.seats.join(', ')} </span>
                                                            <span className='text-gray-500'>•</span>
                                                            <span className="text-sm text-gray-500">{ticket.seats.length} ticket(s)</span></div>
                                                    </div>
                                                    <div className='flex flex-col py-2'>
                                                        <span className='w-[50%] font-semibold text-gray-800 flex gap-1 items-center'><FaMoneyBillWave /> Price</span>
                                                        <span className='text-gray-600'>${ticket.price} / seat</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='p-5 flex '>
                                            <span className='w-[50%] text-xl font-bold'>Total:</span>
                                            <span className='text-emerald-700 text-xl font-bold'>
                                                ${displayFinalTotal.toFixed(2)}
                                                {discount && values.convertToTicket === 'Disagree' && (
                                                    <span className="text-gray-500 text-base font-normal ml-2 line-through">
                                                        ${total.toFixed(2)}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        {memberChecked && values.convertToTicket === 'Agree' && (
                                            <div className='flex'>
                                                <div className='flex flex-col px-5 py-2 w-[50%]'>
                                                    <span className='w-[50%] font-semibold text-gray-800 '>Used Score</span>
                                                    <span className='text-emerald-600'>{displayUsedScore}</span>
                                                </div>
                                                <div className='flex flex-col py-2 w-[50%]'>
                                                    <span className='w-[50%] font-semibold text-gray-800 '>Remaining Score</span>
                                                    <span className='text-emerald-600'>{displayUpdatedScore}</span>
                                                </div>
                                                {!enoughScore && (
                                                    <div className="text-red-500">Not enough score to convert all tickets!</div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-2 justify-center items-center border border-gray-300 p-4 rounded-2xl bg-white shadow-md">
                                            <h4 className='text-black text-xl font-medium mb-4'>Payment Method</h4>
                                            <div className="flex gap-6">
                                                {[
                                                    {
                                                        value: "Cash",
                                                        label: "Pay with Cash",
                                                        icon: <IoMdCash size={36} className="mx-auto mb-2" />,
                                                    },
                                                    {
                                                        value: "VNPay",
                                                        label: "Pay with VNPay",
                                                        icon: <img src={vnpay} alt="vnpay" className="w-14 h-10 object-contain mx-auto mb-2" />,
                                                    },
                                                    {
                                                        value: "Momo",
                                                        label: "Pay with Momo",
                                                        icon: <img src={momo} alt="momo" className="w-10 h-10 object-contain mx-auto mb-2" />,
                                                    },
                                                ].map((method) => (
                                                    <label key={method.value} className={`cursor-pointer w-48 h-32 flex flex-col items-center justify-center border-5 rounded-xl transition
                                                                   ${values.paymentMethod === method.value ? "border-purple-600 bg-purple-50 shadow-lg"
                                                                                                           : "border-gray-300 bg-white hover:border-purple-400"} relative`}>
                                                        <Field
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value={method.value}
                                                            className="absolute top-2 right-2 accent-purple-600"
                                                        />
                                                        {method.icon}
                                                        <span className="font-semibold text-base text-gray-700 text-center">{method.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center p-4">
                                            <Link to="/staff/ticket-selling/ticket-infomation">
                                                <button
                                                    type="submit"
                                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg
                                                    hover:bg-purple-800 transition duration-300 h-10 flex 
                                                    items-center justify-center gap-2"
                                                    disabled={isSubmitting}
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
                                    <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>
                                        <i className="fa-solid fa-users"></i> Member
                                    </h3>
                                    <div className="mt-4 flex gap-3">
                                        <Field
                                            type="text"
                                            name="memberId"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
                                            placeholder="Member ID or Identity Card Number"
                                        />
                                        <button
                                            type="button"
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-800"
                                            style={{ borderLeft: "none" }}
                                            onClick={async () => {
                                                try {
                                                    await validationSchema.fields.memberId.validate(values.memberId);
                                                    // Giả lập kiểm tra memberId tồn tại
                                                    if (values.memberId === member.id) {
                                                        setMemberChecked(true);
                                                        toast.success("Member found!");
                                                    } else {
                                                        setMemberChecked(false);
                                                        toast.error("Member not found!");
                                                    }
                                                } catch (err) {
                                                    setMemberChecked(false);
                                                    toast.error(err.message);
                                                }
                                            }}
                                        >
                                            <i className="fa-solid fa-magnifying-glass mr-2"></i>
                                            Check
                                        </button>
                                    </div>
                                    {/* Chỉ hiển thị thông tin member khi đã check thành công */}
                                    {memberChecked && (
                                        <div>
                                            <div className="p-4 flex flex-col gap-3">
                                                <div className="flex justify-between">
                                                    <span className='text-gray-600 flex gap-1 items-center'><FaIdBadge /> Member ID:</span>
                                                    <span className='font-medium'>{member.id}</span>
                                                </div>
                                                <div className='flex justify-between '>
                                                    <span className='text-gray-600 flex gap-1 items-center'><FaIdCard /> Identity card:</span>
                                                    <span className='font-medium'>{member.identityCard}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-600 flex gap-1 items-center'><FaUser /> Full Name:</span>
                                                    <span className='font-medium'>{member.fullName}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-600 flex gap-1 items-center'><FaPhoneAlt /> Phone:</span>
                                                    <span className='font-medium'>{member.phone}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-600'>Score:</span>
                                                    <span className='text-teal-700 font-medium flex gap-1 items-center'><FaFire /> {member.score}</span>
                                                </div>
                                                <div className="mt-4 flex justify-between">
                                                    <span className='w-[40%] flex items-center gap-1'><FaExchangeAlt /> Convert to ticket:<span className='text-red-500'>*</span></span>
                                                    <div className="form-check">
                                                        <label className="form-check-label">
                                                            <Field
                                                                type="radio"
                                                                className="form-check-input"
                                                                name="convertToTicket"
                                                                value="Agree"
                                                            /> Agree
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <label className="form-check-label">
                                                            <Field
                                                                type="radio"
                                                                className="form-check-input"
                                                                name="convertToTicket"
                                                                value="Disagree"
                                                            /> Disagree
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex gap-3">
                                                    <Field
                                                        type="text"
                                                        name="promotionCode"
                                                        disabled={values.convertToTicket === 'Agree'}
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
                                                        placeholder="Promotion code..."
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-800"
                                                        style={{ borderLeft: "none" }}
                                                        disabled={values.convertToTicket === 'Agree'}
                                                        onClick={() => handleAddPromotion(values.promotionCode, setFieldValue)}
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                {discount && values.convertToTicket === 'Disagree' && (
                                                    <div className='flex justify-between'>
                                                        <span className='text-gray-600'>Discount:</span>
                                                        <span className='text-emerald-600 text-xl font-bold'>{discount}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}