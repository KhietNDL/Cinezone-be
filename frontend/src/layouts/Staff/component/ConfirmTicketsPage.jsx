import { Tag } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdCash } from "react-icons/io";
import vnpay from "../../../assets/vnpay-seeklogo.png";
import momo from "../../../assets/momo-seeklogo.png";
import zalopay from '../../../assets/zalopay-seeklogo.svg'
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFilmAiFill, RiMovie2AiFill } from "react-icons/ri";
import {
  getMovieById, getUserByEmail, getUserByCCCD, getUserByPhone,
  createBookingHold, createCashPayment, checkPromotion, confirmBooking
} from "../../../services/APIForStaff/API";
import { useAuth } from "../../../context/AuthContext";
import {
  FaCalendarDays,
  FaLocationDot,
  FaCouch,
  FaUser,
  FaFire,
} from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import {
  FaMoneyBillWave,
  FaIdCard,
  FaIdBadge,
  FaPhoneAlt,
  FaExchangeAlt,
} from "react-icons/fa";

export default function ConfirmTicketsPage() {

  const [discount, setDiscount] = useState(null);
  const [memberChecked, setMemberChecked] = useState(false);
  const [member, setMember] = useState(null);
  const [isSearching, setIsSearching] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { user: staffUser } = useAuth();

  const location = useLocation();
  const {
    movie,
    day,
    version,
    time,
    room,
    selectedSeats = [],
    totalPrice = 0,
  } = location.state || {};

  const [movieInfo, setMovieInfo] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

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

  const ticket = {
    // id: "TICKET12345",
    movie: movie?.NameOfEnglish || "Unknown Movie",
    screen: version || "Unknown Version",
    date: day || "Unknown Date",
    showtime: time || "Unknown Time",
    room: room || "Unknown Room",
    seats: selectedSeats,
    price: 0,
  };

  // Tính tổng tiền gốc
  const total = selectedSeats.reduce((sum, seatNumber) => {
    const seat = location.state?.seatData?.find(s => s.seatNumber === seatNumber);
    return sum + (seat?.price || 100000); // 100000 là giá mặc định nếu không có
  }, 0);

  const validationSchema = Yup.object().shape({
    // Bỏ requirement memberId vì chúng ta dùng memberSearch để tìm kiếm
    convertToTicket: Yup.string().when([], {
      is: () => memberChecked,
      then: (schema) => schema.required("Please select convert to ticket option"),
      otherwise: (schema) => schema.notRequired(),
    }),
    promotionCode: Yup.string().when(["convertToTicket"], {
      is: (convertToTicket) => convertToTicket === "Agree",
      then: (schema) =>
        schema.test(
          "empty",
          "Promotion code must be empty when Agree",
          (val) => !val || val === ""
        ),
      otherwise: (schema) => schema,
    }),
    paymentMethod: Yup.string().required("Please select payment method"),
  });

  const handleAddPromotion = async (promotionCode, setFieldValue) => {
    try {
      if (!promotionCode || !promotionCode.trim()) {
        toast.error("Please enter the promotional code.");
        return;
      }

      const promotionResult = await checkPromotion(promotionCode);

      if (promotionResult.promotions && promotionResult.promotions.length > 0) {
        const promotion = promotionResult.promotions[0];

        // Kiểm tra thời gian hiệu lực của promotion
        const currentTime = new Date();
        const startTime = new Date(promotion.StartTime);
        const endTime = new Date(promotion.EndTime);

        if (currentTime < startTime) {
          toast.error("The promotional code is not yet valid.");
          setFieldValue("promotionCode", "");
          setDiscount(null);
          return;
        }

        if (currentTime > endTime) {
          toast.error("The promotional code has expired.");
          setFieldValue("promotionCode", "");
          setDiscount(null);
          return;
        }

        // Áp dụng discount
        const discountValue = parseFloat(promotion.DiscountValue);
        setDiscount(discountValue);
        toast.success(`Promotion code applied successfully! Discount ${discountValue}%`);
      } else {
        setDiscount(null);
        toast.error("The promotional code is not valid!");
        setFieldValue("promotionCode", "");
      }
    } catch (error) {
      console.error("Error checking promotion:", error);
      setDiscount(null);
      toast.error("There was an error when checking the promotional code.");
      setFieldValue("promotionCode", "");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });

      // Chuẩn bị dữ liệu cho API
      const userId = memberChecked && member ? member.id : staffUser.id;
      const showtimeId = location.state?.showtimeId;
      const seatIds = location.state?.selectedSeats;
      const promotionTitle = values.promotionCode && values.convertToTicket === "Disagree"
        ? values.promotionCode
        : "";

      if (!showtimeId || !seatIds || seatIds.length === 0) {
        toast.error("Missing mandatory ticket booking information");
        return;
      }

      // Tính toán số tiền cuối cùng dựa trên khuyến mãi/option thành viên
      let finalAmount = total;
      if (memberChecked && values.convertToTicket === "Disagree" && discount) {
        finalAmount = total * (1 - discount / 100);
      } else if (memberChecked && values.convertToTicket === "Agree" && member) {
        const seatsCount = seatIds.length;
        const requiredScore = seatsCount * 10000;
        if (member.score >= requiredScore) {
          finalAmount = 0;
        }
      }

      // 1. Đầu tiên tạo booking hold
      const bookingResult = await createBookingHold(
        userId,
        showtimeId,
        seatIds.map(seatNumber => {
          const seat = location.state.seatData.find(s => s.seatNumber === seatNumber);
          return seat?.seatId || seatNumber;
        }),
        [], // productIds rỗng
        promotionTitle // truyền promotionTitle vào
      );

      // 2. Nếu phương thức thanh toán là Cash thì tạo cash payment
      if (values.paymentMethod === "Cash") {
        await createCashPayment(
          bookingResult.bookingId, // từ response booking hold
          finalAmount, // số tiền đã tính toán
          `CASH-${Date.now()}` // reference duy nhất
        );
      }
      // 3. Xác nhận booking sau khi thanh toán thành công
      await confirmBooking(bookingResult.bookingId);
      setIsBookingConfirmed(true);
      toast.success("Payment by cash successful!");

      // Chuyển hướng sang trang tiếp theo
      setTimeout(() => {
        navigate("/staff/ticket-selling/ticket-infomation", {
          state: {
            ...location.state,
            bookingId: bookingResult.bookingId,
            memberInfo: memberChecked ? member : null,
            paymentMethod: values.paymentMethod,
            amountPaid: finalAmount,
            promotionTitle: promotionTitle,
            isConfirmed: values.paymentMethod === "Cash",
            discount: discount
          }
        });
      }, 1000);

    } catch (err) {
      if (err.inner) {
        err.inner.forEach((e) => toast.error(e.message));
      } else {
        toast.error(err.message || "Error processing the ticket booking");
      }
    } finally {
      setSubmitting(false);
    }
  };
  // FIXED: Enhanced member search function with better error handling
  const handleMemberSearch = async (searchValue) => {
    try {
      if (!searchValue || !searchValue.trim()) {
        setMemberChecked(false); // Reset khi input rỗng
        setMember(null);
        toast.error("Please enter member information");
        return;
      }

      setIsSearching(true);

      let response = null;
      const value = searchValue.trim();

      // Simple regex to detect email, phone, or CCCD
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isPhone = /^0\d{9,10}$/.test(value); // Vietnamese phone
      const isCCCD = /^\d{9,12}$/.test(value);   // CCCD/CMND: 9-12 digits

      if (isEmail) {
        response = await getUserByEmail(value);
      } else if (isPhone) {
        response = await getUserByPhone(value);
      } else if (isCCCD) {
        response = await getUserByCCCD(value);
      } else {
        setMemberChecked(false); // Reset khi format không hợp lệ
        setMember(null);
        toast.error("Please enter a valid Email, Phone, or Identity Card number!");
        setIsSearching(false);
        return;
      }

      let userData = null;
      if (response?.data?.user) {
        userData = response.data.user;
      } else if (response?.data?.data?.user) {
        userData = response.data.data.user;
      } else if (response?.data && typeof response.data === 'object' && response.data.UserId) {
        userData = response.data;
      } else if (response?.user) {
        userData = response.user;
      }

      if (userData && userData.UserId) {
        const memberData = {
          id: userData.UserId,
          identityCard: userData.CCCD || userData.IdentityCard || "Not updated",
          fullName: userData.FullName || userData.fullName || "Not updated",
          phone: userData.PhoneNumber || userData.phoneNumber || userData.Phone || "Not updated",
          score: userData.score || userData.Score || 0,
          email: userData.Email || userData.email || value,
        };

        setMemberChecked(true); // Set true khi tìm thấy member
        setMember(memberData);
        toast.success("Member found successfully!");
      } else {
        setMemberChecked(false); // Reset khi không tìm thấy member
        setMember(null);

        if (response?.status === 200 && !userData) {
          toast.error("No member found with this information!");
        } else if (response?.status === 404) {
          toast.error("Member not found!");
        } else {
          toast.error("Could not find member information!");
        }
      }
    } catch (error) {
      setMemberChecked(false); // Reset khi có lỗi
      setMember(null);

      if (error.response?.status === 404) {
        toast.error("Member not found!");
      } else if (error.response?.status === 400) {
        toast.error("Invalid search information!");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An error occurred while searching for member!");
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-4 mx-auto w-full ">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4 text-[#9810FA]">
        Confirm Tickets
      </h1>
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

      <Formik
        initialValues={{
          memberSearch: "",
          convertToTicket: "",
          promotionCode: "",
          paymentMethod: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          // Logic tính toán tổng tiền và điểm
          let displayFinalTotal = total;
          let displayUsedScore = 0;
          let displayUpdatedScore = member ? member.score : 0;
          let enoughScore = false;

          if (memberChecked && values.convertToTicket === "Agree" && member) {
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
          } else if (memberChecked && values.convertToTicket === "Disagree" && discount) {
            displayFinalTotal = total * (1 - discount / 100);
          }

          return (
            <Form>
              <div className="flex items-start  p-4">
                <div className="flex flex-col  w-[70%] border-r border-gray-300 p-4 ">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    <i className="fa-solid fa-ticket"></i> Ticket
                  </h3>
                  <div>
                    <div className="flex flex-col gap-2 justify-center  border-b border-gray-300 px-4 pb-4 ">
                      <div className="flex flex-col py-2">
                        <span className="w-[26%] font-semibold text-gray-800 flex gap-1 items-center">
                          <RiFilmAiFill /> Movie
                        </span>
                        <span className="text-gray-600">{ticket.movie}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-[50%]">
                          <div className="flex flex-col py-2">
                            <span className="w-[50%] font-semibold text-gray-800 flex gap-1 items-center">
                              <RiMovie2AiFill /> Screan
                            </span>
                            <span className="text-gray-600">
                              {ticket.screen}
                            </span>
                          </div>
                          <div className="flex flex-col py-2">
                            <span className="w-[50%] font-semibold text-gray-800 flex gap-1 items-center">
                              <FaCalendarDays /> Date
                            </span>
                            <span className="text-gray-600">{ticket.date}</span>
                          </div>
                          <div className="flex flex-col py-2">
                            <span className="w-[50%] font-semibold text-gray-800 flex gap-1 items-center">
                              <IoTime /> Show Time
                            </span>
                            <span className="text-gray-600">
                              {ticket.showtime}
                            </span>
                          </div>
                        </div>
                        <div className="w-[50%]">
                          <div className="flex flex-col py-2">
                            <span className="w-[50%] font-semibold text-gray-800 flex gap-1 items-center">
                              <FaLocationDot /> Room
                            </span>
                            <span className="text-gray-600">{ticket.room}</span>
                          </div>
                          <div className="flex flex-col py-2">
                            <span className="w-[50%] font-semibold text-gray-800 flex gap-1 items-center">
                              <FaCouch /> Seats
                            </span>
                            <div className="flex items-center gap-5">
                              <span className="text-gray-600">
                                {ticket.seats.join(", ")}{" "}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm text-gray-500">
                                {ticket.seats.length} ticket(s)
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col py-2">
                            <span className="w-[50%] font-semibold text-gray-800 flex gap-1 items-center">
                              <FaMoneyBillWave /> Price
                            </span>
                            <div className="text-gray-600">
                              {ticket.seats.map((seatNumber, index) => {
                                const seat = location.state?.seatData?.find(s => s.seatNumber === seatNumber);
                                const seatPrice = seat?.price;
                                return (
                                  <div key={index} className="flex justify-between">
                                    <span>{seatNumber}:</span>
                                    <span>{formatPrice(seatPrice)} VNĐ</span>
                                  </div>
                                );
                              })}

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex ">
                      <span className="w-[50%] text-xl font-bold">Total:</span>
                      <span className="text-emerald-700 text-xl font-bold">
                        {formatPrice(displayFinalTotal)} VNĐ
                        {discount && values.convertToTicket === "Disagree" && (
                          <span className="text-gray-500 text-base font-normal ml-2 line-through">
                            {formatPrice(total)} VNĐ
                          </span>
                        )}
                      </span>
                    </div>
                    {memberChecked && values.convertToTicket === "Agree" && (
                      <div className="flex flex-col border-t border-gray-300">
                        {!enoughScore && (
                          <div className="text-red-500 px-4 w-full">
                            Not enough score to convert all tickets!
                          </div>
                        )}
                        <div className="flex items-center w-full">
                          <div className="flex flex-col px-5 py-2 w-[50%]">
                            <span className="w-[50%] font-semibold text-gray-800 ">
                              Used Score
                            </span>
                            <span className="text-emerald-600 font-semibold flex gap-1 items-center">
                              <FaFire /> {displayUsedScore}
                            </span>
                          </div>

                          <div className="flex flex-col py-2 w-[50%]">
                            <span className="w-[50%] font-semibold text-gray-800 ">
                              Remaining Score
                            </span>
                            <span className="text-orange-400 font-semibold flex gap-1 items-center">
                              <FaFire /> {displayUpdatedScore}
                            </span>
                          </div>
                        </div>

                      </div>
                    )}
                    <div className="flex flex-col gap-2 justify-center items-center border border-gray-300 p-4 rounded-2xl bg-white shadow-md">
                      <h4 className="text-black text-xl font-medium mb-4">
                        Payment Method
                      </h4>
                      <div className="flex flex-col gap-3 w-full md:flex-row justify-center">
                        {[
                          {
                            value: "Cash",
                            label: "Pay with Cash",
                            icon: (
                              <IoMdCash size={36} className="mx-auto mb-2" />
                            ),
                          },
                          {
                            value: "ZaloPay",
                            label: "Pay with ZaloPay",
                            icon: (
                              <img
                                src={zalopay}
                                alt="zalopay"
                                className="w-14 h-10 object-contain mx-auto mb-2"
                              />
                            ),
                          },
                          {
                            value: "VNPay",
                            label: "Pay with VNPay",
                            icon: (
                              <img
                                src={vnpay}
                                alt="vnpay"
                                className="w-14 h-10 object-contain mx-auto mb-2"
                              />
                            ),
                          },
                          {
                            value: "Momo",
                            label: "Pay with Momo",
                            icon: (
                              <img
                                src={momo}
                                alt="momo"
                                className="w-10 h-10 object-contain mx-auto mb-2"
                              />
                            ),
                          },
                        ].map((method) => (
                          <label
                            key={method.value}
                            className={`cursor-pointer w-48 h-32 flex flex-col items-center justify-center border-5 rounded-xl transition
                                        ${values.paymentMethod === method.value ? "border-purple-600 bg-purple-50 shadow-lg"
                                : "border-gray-300 bg-white hover:border-purple-400"
                              } relative`}>
                            <Field
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              className="absolute top-2 right-2 accent-purple-600"
                            />
                            {method.icon}
                            <span className="font-semibold text-base text-gray-700 text-center">
                              {method.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center items-center p-4">
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg
                                                hover:bg-purple-400 transition duration-300 h-10 flex 
                                                items-center justify-center gap-2"
                        disabled={isSubmitting}
                      >
                        <i className="fa-solid fa-ticket"></i> Confirm Ticket(s)
                      </button>
                      <Link to="/staff/ticket-selling">
                        <button
                          type="button"
                          className="bg-white text-red-700 border
                                                    border-b-red-700 px-6 py-3 rounded-lg hover:bg-red-800
                                                    hover:text-white transition duration-300 ml-4 h-10 flex items-center
                                                    justify-center gap-2"
                        >
                          <i className="fa-solid fa-xmark"></i> Cancel
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-[40%] p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    <i className="fa-solid fa-users"></i> Member
                  </h3>
                  <div className="mt-4 flex gap-3">
                    <Field
                      type="text"
                      name="memberSearch"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none
                               bg-white focus:ring-2 focus:ring-purple-700"
                      onChange={(e) => {
                        // Reset khi người dùng xóa input
                        if (!e.target.value.trim()) {
                          setMemberChecked(false);
                          setMember(null);
                        }
                        // Cập nhật giá trị form
                        setFieldValue("memberSearch", e.target.value);
                      }}
                      placeholder="Email / Phone Number / ID Card"
                      title="Email / Phone Number / ID Card"
                    />
                    <button
                      type="button"
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-400 disabled:bg-gray-400"
                      style={{ borderLeft: "none" }}
                      disabled={isSearching}
                      onClick={() => handleMemberSearch(values.memberSearch)}
                    >
                      <i className={`fa-solid ${isSearching ? 'fa-spinner fa-spin' : 'fa-magnifying-glass'} mr-2`}></i>
                      {isSearching ? 'Searching...' : 'Check'}
                    </button>
                  </div>
                  {/* Chỉ hiển thị thông tin member khi đã check thành công */}
                  {memberChecked && member && (
                    <div>
                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex gap-1 items-start w-[50%]">
                            <FaIdBadge /> Member ID:
                          </span>
                          <span className="font-medium w-[50%]">{member.id}</span>
                        </div>
                        <div className="flex justify-between ">
                          <span className="text-gray-600 flex gap-1 items-center">
                            <FaIdCard /> Identity card:
                          </span>
                          <span className="font-medium">
                            {member.identityCard}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex gap-1 items-center">
                            <FaUser /> Full Name:
                          </span>
                          <span className="font-medium">{member.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex gap-1 items-center">
                            <FaPhoneAlt /> Phone:
                          </span>
                          <span className="font-medium">{member.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Score:</span>
                          <span className="text-teal-700 font-medium flex gap-1 items-center">
                            <FaFire /> {member.score}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <span className="w-[80%] flex items-center gap-1">
                            <FaExchangeAlt /> Convert to ticket:
                            <span className="text-red-500">*</span>
                          </span>
                          <div className="flex flex-col items-start justify-start w-[30%]">
                            <div className="form-check">
                              <label className="form-check-label">
                                <Field
                                  type="radio"
                                  className="form-check-input"
                                  name="convertToTicket"
                                  value="Agree"
                                />{" "}
                                Agree
                              </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <Field
                                  type="radio"
                                  className="form-check-input"
                                  name="convertToTicket"
                                  value="Disagree"
                                />{" "}
                                Disagree
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <Field
                            type="text"
                            name="promotionCode"
                            disabled={!memberChecked || values.convertToTicket !== "Disagree"}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none
                             focus:ring-2 focus:ring-purple-700 bg-white"
                            placeholder="Promotion code..."
                          />
                          <button
                            type="button"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-400"
                            style={{ borderLeft: "none" }}
                            disabled={values.convertToTicket === "Agree"}
                            onClick={() =>
                              handleAddPromotion(
                                values.promotionCode,
                                setFieldValue
                              )
                            }
                          >
                            Add
                          </button>
                        </div>
                        {discount && values.convertToTicket === "Disagree" && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Discount:</span>
                            <span className="text-emerald-600 text-xl font-bold">
                              {discount}%
                            </span>
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