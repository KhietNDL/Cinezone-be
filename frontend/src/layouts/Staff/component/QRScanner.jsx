import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
    //   (decodedText, decodedResult) => {
         (decodedText) => {
        console.log("Mã QR:", decodedText);
        if (onScanSuccess) {
          onScanSuccess(decodedText);
        }
      },
      (error) => {
        console.error("Scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Lỗi khi dọn dẹp scanner:", error);
      });
    };
  }, [onScanSuccess]);

  return (
    <div>
      <h3>Quét mã QR</h3>
      <div id="qr-reader" style={{ width: "100%" }}></div>
    </div>
  );
};

export default QRScanner;
