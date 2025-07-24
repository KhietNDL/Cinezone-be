import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
// import "html5-qrcode/html5-qrcode.min.css";
import { Button, Typography } from "antd";

const { Title } = Typography;

const QRScanner = ({ onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);

    const startScanner = () => {
        setIsScanning(true);
    };

    useEffect(() => {
        if (!isScanning || scannerRef.current) return;

        const scanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        });

        scanner.render(
            (decodedText) => {
                console.log("Mã QR:", decodedText);
                if (onScanSuccess) onScanSuccess(decodedText);
            },
            (error) => {
                console.warn("Scan error:", error);
            }
        );

        scannerRef.current = scanner;

        return () => {
            scanner.clear().catch((err) => console.error("Clear error:", err));
            scannerRef.current = null;
        };
    }, [isScanning, onScanSuccess]);

    return (
        <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ marginBottom: 20 }}>
                Quét mã QR để Check-in
            </Title>

            {!isScanning && (
                <Button type="primary" size="large" onClick={startScanner}>
                    Bắt đầu quét mã QR
                </Button>
            )}

            <div id="qr-reader" style={{ width: "100%", marginTop: 20 }}></div>
        </div>
    );
};

export default QRScanner;
