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

      switch (booking.Status) {
        case 2: // Chưa check-in
          await checkIn(data);
          console.log("Check-in successful!");
          toast.success("Check-in successful!");
          break;
        case 3: // Đã check-in
          toast.info("This booking has already been checked in.");
          break;
        default:
          toast.warning("This booking cannot be checked in.");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Check-in failed. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col p-[20px]">
      <div className="mx-auto text-center mb-6 lg:mx-0 text-3xl font-bold text-[#9810FA]">Check-in</div>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mx-auto border border-gray-300">
        <QRScanner onScanSuccess={handleQRResult} />
      </div>
    </div>
  );
};

export default CheckIn;