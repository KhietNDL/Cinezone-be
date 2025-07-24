import React from "react";
import QRScanner from "../component/QRScanner";
import { checkIn } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";

const CheckIn = () => {
  const handleQRResult = async (data) => {
    console.log(`Mã QR đã quét được: ${data}`);
    try {
      await checkIn(data);
      console.log("Check-in thành công!");
      toast.success("Check-in thành công!");
    } catch (error) {
      console.error("Lỗi xử lý mã QR:", error);
      toast.error("Lỗi khi check-in. Vui lòng thử lại.");
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
