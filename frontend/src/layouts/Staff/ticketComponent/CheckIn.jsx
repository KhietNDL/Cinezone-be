import React from "react";
import QRScanner from "../component/QRScanner";
import { checkIn, getBookingById } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";

const CheckIn = () => {
  const handleQRResult = async (data) => {
    console.log(`Scanned QR code: ${data}`);
    try {
      const booking = await getBookingById(data);

      if (!booking) {
        toast.error("Booking not found.");
        return;
      }

      if (booking.Status === 2) {
        await checkIn(data);
        const updated = await getBookingById(data); // kiểm tra lại từ server
        if (updated?.Status === 3) {
          toast.success("Check-in successful!");
        } else {
          toast.error("Check-in failed. Please try again.");
        }
        return;
      }
      else if (booking.Status === 3) {
        toast.warning("This booking has already been checked in.");
        return;
      } else {
        toast.error("This booking can not check-in.");
        return;
      }

    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Check-in failed. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col p-[20px]">
      <div className="flex lg:flex-row flex-col justify-between items-center">
        <div className="w-[20%]"></div>
        <div className=" mb-6 lg:mx-0 text-3xl font-bold text-[#9810FA]">Check-in</div>
        <div className="w-[20%]"></div>
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mx-auto border border-gray-300">
        <QRScanner onScanSuccess={handleQRResult} />
      </div>
    </div>
  );
};

export default CheckIn;