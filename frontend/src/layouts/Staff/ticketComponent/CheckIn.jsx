import React from "react";
import QRScanner from "../component/QRScanner";
import { checkIn } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";

const CheckIn = () => {
  const handleQRResult = async (data) => {
    console.log(`Scanned QR code: ${data}`);
    try {
      await checkIn(data);
      console.log("Check-in successful!");
      toast.success("Check-in successful!");
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Check-in failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 500, width: "100%" }}>
        <QRScanner onScanSuccess={handleQRResult} />
      </div>
    </div>
  );
};

export default CheckIn;