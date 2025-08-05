import React, { useState } from "react";
import QRScanner from "../component/QRScanner";
import { checkIn, getBookingById } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdQrCodeScanner } from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";
import { Button } from "antd";

const CheckIn = () => {
  const [isScanned, setIsScanned] = useState(false);

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
        const updated = await getBookingById(data);
        if (updated?.Status === 3) {
          toast.success("Check-in successful!");
          setIsScanned(true); // ✅ Quét xong
        } else {
          toast.error("Check-in failed. Please try again.");
        }
        return;
      } else if (booking.Status === 3) {
        toast.warning("This booking has already been checked in.");
        setIsScanned(true);
        return;
      } else {
        toast.error("This booking cannot be checked in.");
        setIsScanned(true);
        return;
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Check-in failed. Please try again.");
      setIsScanned(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaTicketAlt className="text-white text-lg sm:text-xl" />
            </div>
            <div className="text-center">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Ticket Check-in
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Scan QR code to check-in customers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <MdQrCodeScanner className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  QR Code Scanner
                </h2>
                <p className="text-sm text-gray-500">
                  Position the QR code within the scanner frame
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="max-w-md w-full">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  {!isScanned ? (
                    <QRScanner onScanSuccess={handleQRResult} />
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-green-700 font-semibold">
                        ✅ QR code processed.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => window.location.reload()}
                      >
                        Scan next ticket
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    📱 How to use:
                  </h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Hold the QR code steady within the camera frame</li>
                    <li>• Ensure good lighting for accurate scanning</li>
                    <li>• The system will automatically process valid tickets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;