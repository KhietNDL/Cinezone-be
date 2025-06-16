import { Tag } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdCash } from "react-icons/io";
import vnpay from "../../../assets/vnpay-seeklogo.png";
import momo from "../../../assets/momo-seeklogo.png";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ConfirmTicketsPage() {
  const [discount, setDiscount] = useState(null);
  const [memberChecked, setMemberChecked] = useState(false);

  const ticket = {
    id: "TICKET12345",
    movie:
      "PHIM ĐIỆN ẢNH DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG TRANH",
    screen: "IMAX",
    showtime: "10:30 AM - 12:00 PM",
    room: "Cinema Hall 3",
    seats: ["A1", "A2", "A3", "A4"],
    price: 10.0,
  };

  const member = {
    id: "123456789",
    identityCard: "123123",
    fullName: "John Doe",
    phone: "0123456789",
    score: 40500,
  };

  // Tính tổng tiền gốc
  const total = ticket.price * ticket.seats.length;

  const validationSchema = Yup.object().shape({
    memberId: Yup.string()
      .matches(/^\d+$/, "You must enter a valid Member ID/Identity Card")
      .required("Member ID/Identity Card is required"),
    convertToTicket: Yup.string().required(
      "Please select convert to ticket option"
    ),
    promotionCode: Yup.string().when("convertToTicket", {
      is: "Agree",
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

  const handleAddPromotion = (promotionCode, setFieldValue) => {
    if (promotionCode.trim().toUpperCase() === "GIAM50") {
      setDiscount(50);
      toast.success("Applied 50% discount code successfully!");
    } else if (promotionCode.trim().toUpperCase() === "GIAM20") {
      setDiscount(20);
      toast.success("Applied 20% discount code successfully!");
    } else {
      setDiscount(null);
      toast.error("Promotion code is invalid!");
      setFieldValue("promotionCode", "");
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    validationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        toast.success("Submit success!");
        setSubmitting(false);
      })
      .catch((err) => {
        if (err.inner) {
          err.inner.forEach((e) => toast.error(e.message));
        } else {
          toast.error(err.message);
        }
        setSubmitting(false);
      });
  };

  return (
    <div className="p-4 mx-auto w-full">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4 text-fuchsia-700">
        Confirm Tickets
      </h1>
      <div className="flex items-start gap-4 border-b border-gray-300 pb-4">
        <img
          src="https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg"
          alt="Poster Doraemon"
          className="w-40 h-auto rounded shadow"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="text-[#FFF8A7] p-1 rounded-full shadow-md w-[125px] h-[30px] flex items-center justify-center mb-2"
              style={{
                background:
                  "linear-gradient(90deg, #FACC15, #DDB61A, #DBBB3B, #CDB03D, #B1900C)",
              }}
            >
              <p className=" font-bold p-2 text-sm">Now Showing</p>
            </div>
            <Tag color="purple" style={{ border: "1px solid purple" }}>
              IMAX
            </Tag>
          </div>
          <h2 className="text-xl font-bold mt-2 p-4">
            PHIM ĐIỆN ẢNH DORAEMON: NOBITA VÀ CUỘC PHIÊU LƯU VÀO THẾ GIỚI TRONG
            TRANH
          </h2>
          <p className="text-sm mt-1 ">
            <span className="p-2">
              <i className="fa-solid fa-clock"></i> 10:30 AM - 12:00 PM
            </span>
            <span className="p-2">
              <i className="fa-solid fa-location-dot"></i> Cinema Hall 3
            </span>
            <span className="p-2">
              <i className="fa-solid fa-couch"></i> Rows: A-H
            </span>
          </p>
        </div>
      </div>

      <Formik
        initialValues={{
          memberId: "",
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
          let displayUpdatedScore = member.score;
          let enoughScore = false;

          if (memberChecked && values.convertToTicket === "Agree") {
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
          } else if (
            memberChecked &&
            values.convertToTicket === "Disagree" &&
            discount
          ) {
            displayFinalTotal = total * (1 - discount / 100);
          }

          return (
            <Form>
              <div className="flex items-start  p-4">
                <div className="flex flex-col gap-4 w-[60%] border-r border-gray-300 p-4 ">
                  <div className="text-xl font-bold">
                    <i className="fa-solid fa-ticket"></i> Ticket
                  </div>
                  <div>
                    <div className="flex flex-col gap-2 justify-center  border-b border-gray-300 p-4 ">
                      <p className="flex gap-10">
                        <strong className="w-[20%]">ID Ticket:</strong>{" "}
                        <span>{ticket.id}</span>
                      </p>
                      <p className="flex gap-10">
                        <strong className="w-[26%]">Movie:</strong>{" "}
                        <span>{ticket.movie}</span>
                      </p>
                      <p className="flex gap-10">
                        <strong className="w-[20%]">Screan:</strong>{" "}
                        <span>{ticket.screen}</span>
                      </p>
                      <p className="flex gap-10">
                        <strong className="w-[20%]">Showtime:</strong>{" "}
                        <span>{ticket.showtime}</span>
                      </p>
                      <p className="flex gap-10">
                        <strong className="w-[20%]">Room:</strong>{" "}
                        <span>{ticket.room}</span>
                      </p>
                      <p className="flex gap-10">
                        <strong className="w-[20%]">Seats:</strong>{" "}
                        <span>{ticket.seats.join(", ")}</span>
                      </p>
                      <p className="flex gap-10">
                        <strong className="w-[20%]">Price:</strong>{" "}
                        <span>${ticket.price} / seat</span>
                      </p>
                    </div>
                    <p className="p-5 flex gap-10">
                      <strong className="w-[20%] text-xl font-bold">
                        Total:
                      </strong>
                      <span className="text-emerald-700 text-xl font-bold">
                        ${displayFinalTotal.toFixed(2)}
                        {discount && values.convertToTicket === "Disagree" && (
                          <span className="text-gray-500 text-base font-normal ml-2 line-through">
                            ${total.toFixed(2)}
                          </span>
                        )}
                      </span>
                    </p>
                    {memberChecked && values.convertToTicket === "Agree" && (
                      <>
                        <p className="flex gap-10">
                          <strong className="w-[20%]">Used Score:</strong>
                          <span className="text-emerald-600">
                            {displayUsedScore}
                          </span>
                        </p>
                        <p className="flex gap-10">
                          <strong className="w-[20%]">Remaining Score:</strong>
                          <span className="text-emerald-600">
                            {displayUpdatedScore}
                          </span>
                        </p>
                        {!enoughScore && (
                          <p className="text-red-500">
                            Not enough score to convert all tickets!
                          </p>
                        )}
                      </>
                    )}
                    <div className="flex flex-col gap-2 justify-center items-center border border-gray-300 p-4 rounded-2xl bg-white shadow-md">
                      <h5> Payment Method:</h5>
                      <div className="flex gap-10">
                        <div className="form-check ">
                          <label className="form-check-label flex items-center gap-2">
                            <Field
                              type="radio"
                              className="form-check-input"
                              name="paymentMethod"
                              value="Cash"
                            />
                            <IoMdCash /> Cash
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <Field
                              type="radio"
                              className="form-check-input pt-2"
                              name="paymentMethod"
                              value="VNPay"
                            />
                            <img
                              className="w-[60px] pt-1"
                              alt="vnpay"
                              src={vnpay}
                            />
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center gap-2">
                            <Field
                              type="radio"
                              className="form-check-input"
                              name="paymentMethod"
                              value="Momo"
                            />
                            <img className="w-[30px]" alt="momo" src={momo} />
                          </label>
                        </div>
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
                          <i className="fa-solid fa-ticket"></i> Confirm
                          Ticket(s)
                        </button>
                      </Link>
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
                  <div className="text-xl font-bold">
                    <i className="fa-solid fa-users"></i> Member
                  </div>
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
                          await validationSchema.fields.memberId.validate(
                            values.memberId
                          );
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
                      <div className="p-4 mt-2 flex flex-col gap-3">
                        <p className="mt-2 flex">
                          <strong className="w-[40%]">Member ID:</strong>{" "}
                          <span>{member.id}</span>
                        </p>
                        <p className="flex">
                          <strong className="w-[40%]">Identity card:</strong>{" "}
                          {member.identityCard}
                        </p>
                        <p className="flex">
                          <strong className="w-[40%]">Full Name:</strong>{" "}
                          {member.fullName}
                        </p>
                        <p className="flex">
                          <strong className="w-[40%]">Phone:</strong>{" "}
                          {member.phone}
                        </p>
                        <p className="flex">
                          <strong className="w-[40%]">Score:</strong>{" "}
                          <span className="text-teal-700">{member.score}</span>
                        </p>
                        <div className="mt-4 flex gap-3">
                          <strong className="w-[40%] flex gap-1">
                            Convert to ticket:
                            <span className="text-red-500">*</span>
                          </strong>
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
                        <div className="mt-4 flex gap-3">
                          <Field
                            type="text"
                            name="promotionCode"
                            disabled={values.convertToTicket === "Agree"}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
                            placeholder="Promotion code..."
                          />
                          <button
                            type="button"
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-800"
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
                          <p className="flex">
                            <strong className="w-[40%]">Discount:</strong>{" "}
                            <span className="text-emerald-600 text-xl font-bold">
                              {discount}%
                            </span>
                          </p>
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
