import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { Button, Typography, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const QRScanner = ({ onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState(null);
    const scannerRef = useRef(null);

    const getCameraList = async () => {
        try {
            const devices = await Html5Qrcode.getCameras();
            setCameras(devices);
            if (devices.length > 0) setSelectedCameraId(devices[0].id);
        } catch (err) {
            console.error("Unable to get cameras:", err);
        }
    };

    const startScanner = async () => {
        if (!selectedCameraId) {
            message.error("Please select a camera before scanning.");
            return;
        }

        setIsScanning(true);
        const html5QrCode = new Html5Qrcode("qr-reader");

        await html5QrCode.start(
            { deviceId: { exact: selectedCameraId } },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                console.log("QR Code:", decodedText);
                if (onScanSuccess) onScanSuccess(decodedText);
            },
            (error) => {
                console.warn("Scan error:", error);
            }
        );

        scannerRef.current = html5QrCode;
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const handleImageUpload = async (file) => {
        const html5QrCode = new Html5Qrcode("qr-reader");
        try {
            const result = await html5QrCode.scanFile(file, true);
            console.log("QR Code from image:", result);
            if (onScanSuccess) onScanSuccess(result);
        } catch (err) {
            message.error("QR code not found in the image.");
            console.error("Image scan error:", err);
        }
        return false; // Prevent Ant Design from uploading the image to server
    };

    useEffect(() => {
        getCameraList();
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <div style={{ textAlign: "center" }}>
            <Title level={3}>Scan QR Code to Check-in</Title>

            <div style={{ marginBottom: 16 }}>
                <Select
                    placeholder="Select a camera"
                    style={{ width: 300 }}
                    onChange={setSelectedCameraId}
                    value={selectedCameraId}
                    disabled={isScanning}
                >
                    {cameras.map((cam) => (
                        <Option key={cam.id} value={cam.id}>
                            {cam.label}
                        </Option>
                    ))}
                </Select>
            </div>

            <div>
                {!isScanning ? (
                    <Button type="primary" onClick={startScanner}>
                        Start scanning with camera
                    </Button>
                ) : (
                    <Button type="default" danger onClick={stopScanner}>
                        Stop scanning
                    </Button>
                )}
            </div>

            <div style={{ margin: "20px 0" }}>
                <Upload
                    beforeUpload={handleImageUpload}
                    accept="image/*"
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Upload image with QR code</Button>
                </Upload>
            </div>

            <div id="qr-reader" style={{ width: "100%", minHeight: 300 }}></div>
        </div>
    );
};

export default QRScanner;
