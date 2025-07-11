const nodemailer = require("nodemailer");
const QRCode = require('qrcode');

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

class BookingEmailService {
  static async sendBookingConfirmationEmail(
    userData,
    bookingData,
    showtimeData,
    movieData,
    seatsData
  ) {
    try {
      const { FullName, Email } = userData;
      const { BookingId, TotalAmount, BookingDate, Status } = bookingData;
      const { Day, Time, Duration } = showtimeData;
      const { NameOfVietnamese, NameOfEnglish } = movieData;

      // Tạo QR code từ BookingId (dạng buffer)
      const qrBuffer = await QRCode.toBuffer(BookingId);

      const mailOptions = {
        from: process.env.EMAIL_USER || "your-email@gmail.com",
        to: Email,
        subject: "Xác nhận đặt vé thành công - Cinema Booking",
        html: `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CineZone - Đặt vé thành công</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', Arial, sans-serif;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            min-height: 100vh;
            padding: 20px;
            color: #ffffff;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
        }
        
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
            pointer-events: none;
        }
        
        .header {
            background: linear-gradient(135deg, #5A47E5 0%, #c53030 50%, #9b2c2c 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: rotate 15s linear infinite;
        }
        
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .header h1 {
            font-size: 2.8rem;
            font-weight: 800;
            margin-bottom: 10px;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
            position: relative;
            z-index: 1;
            letter-spacing: -1px;
        }
        
        .header h2 {
            font-size: 1.4rem;
            font-weight: 500;
            opacity: 0.95;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
            position: relative;
        }
        
        .success-badge {
            background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 35px;
            text-align: center;
            font-size: 1.2rem;
            font-weight: 600;
            box-shadow: 0 15px 30px rgba(56, 161, 105, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
        }
        
        .success-badge::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shine 3s infinite;
        }
        
        @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .section {
            margin-bottom: 35px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #5A47E5;
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, #5A47E5, #c53030);
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-table tr {
            transition: background-color 0.3s ease;
        }
        
        .info-table tr:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .info-table td {
            padding: 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            vertical-align: top;
        }
        
        .info-table tr:last-child td {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: #cbd5e0;
            width: 35%;
            font-size: 0.95rem;
        }
        
        .info-value {
            color: #ffffff;
            font-weight: 500;
            font-size: 0.95rem;
        }
        
        .total-amount {
            color: #38a169 !important;
            font-weight: 700 !important;
            font-size: 1.2rem !important;
            text-shadow: 0 0 10px rgba(56, 161, 105, 0.5);
        }
        
        .seats-container {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .seat-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .seat-item:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        
        .seat-item:last-child {
            margin-bottom: 0;
        }
        
        .seat-number {
            font-weight: 600;
            color: #ffffff;
            background: linear-gradient(135deg, #5A47E5, #c53030);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            box-shadow: 0 4px 10px rgba(229, 62, 62, 0.3);
        }
        
        .seat-price {
            font-weight: 600;
            color: #38a169;
            font-size: 1.1rem;
            text-shadow: 0 0 10px rgba(56, 161, 105, 0.3);
            margin-left: auto;
            margin-top:5px;
        }
        
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 25px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .qr-code {
            width: 140px;
            height: 140px;
            background: linear-gradient(135deg, #2d3748, #1a202c);
            border-radius: 15px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            color: #cbd5e0;
            font-weight: 600;
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .qr-text {
            color: #cbd5e0;
            font-size: 0.95rem;
            margin-top: 10px;
        }
        
        .instructions {
            background: rgba(255, 255, 255, 0.05);
            padding: 25px;
            border-radius: 15px;
            border-left: 4px solid #5A47E5;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .instructions h4 {
            color: #ffffff;
            margin-bottom: 18px;
            font-size: 1.3rem;
            font-weight: 700;
        }
        
        .instructions ul {
            list-style: none;
            padding: 0;
        }
        
        .instructions li {
            color: #cbd5e0;
            margin-bottom: 12px;
            padding-left: 30px;
            position: relative;
            font-weight: 500;
            line-height: 1.6;
        }
        
        .instructions li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #38a169;
            font-weight: bold;
            font-size: 1.2rem;
            text-shadow: 0 0 8px rgba(56, 161, 105, 0.5);
        }
        
        .footer {
            text-align: center;
            padding: 35px 30px;
            background: rgba(0, 0, 0, 0.3);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer p {
            color: #a0aec0;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 10px;
        }
        
        .footer .brand {
            color: #ffffff;
            font-weight: 700;
            font-size: 1.1rem;
            margin-top: 15px;
        }
        
        .booking-id {
            background: linear-gradient(135deg, #5A47E5, #c53030);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1.1rem;
            display: inline-block;
            box-shadow: 0 5px 15px rgba(229, 62, 62, 0.3);
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .movie-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #ffffff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
        
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2.2rem;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .section {
                padding: 20px;
            }
            
            .seat-item {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .cinema-logo {
                top: 15px;
                right: 20px;
                width: 50px;
                height: 50px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CineZone</h1>
            <h2>Đặt vé thành công!</h2>
        </div>
        
        <div class="content">
            <div class="success-badge">
                🎉 Cảm ơn bạn đã đặt vé thành công tại CineZone! 🎉
            </div>
            
            <div class="section">
                <h3 class="section-title">🎫 Thông tin đặt vé</h3>
                <table class="info-table">
                    <tr>
                        <td class="info-label">Mã đặt vé:</td>
                        <td class="info-value">
                            <span class="booking-id">${BookingId}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="info-label">Tên phim:</td>
                        <td class="info-value">
                            <span class="movie-title">${NameOfVietnamese}</span><br>
                            <span style="color: #a0aec0; font-size: 0.9rem;">(${NameOfEnglish})</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="info-label">Ngày chiếu:</td>
                        <td class="info-value">${new Date(
                          Day
                        ).toLocaleDateString("vi-VN")}</td>
                    </tr>
                    <tr>
                        <td class="info-label">Giờ chiếu:</td>
                        <td class="info-value">${Time}</td>
                    </tr>
                    <tr>
                        <td class="info-label">Thời lượng:</td>
                        <td class="info-value">${Duration} phút</td>
                    </tr>
                    <tr>
                        <td class="info-label">Tổng tiền:</td>
                        <td class="info-value total-amount">${new Intl.NumberFormat(
                          "vi-VN",
                          { style: "currency", currency: "VND" }
                        ).format(TotalAmount)}</td>
                    </tr>
                </table>
            </div>
            
            <div class="section">
                <h3 class="section-title">👤 Thông tin khách hàng</h3>
                <table class="info-table">
                    <tr>
                        <td class="info-label">Họ tên:</td>
                        <td class="info-value">${FullName}</td>
                    </tr>
                    <tr>
                        <td class="info-label">Email:</td>
                        <td class="info-value">${Email}</td>
                    </tr>
                    <tr>
                        <td class="info-label">Ngày đặt vé:</td>
                        <td class="info-value">${new Date(
                          BookingDate
                        ).toLocaleDateString("vi-VN")}</td>
                    </tr>
                </table>
            </div>
            
            <div class="section">
                <h3 class="section-title">🪑 Chi tiết ghế ngồi</h3>
                <div class="seats-container">
                    ${seatsData
                      .map(
                        (seat) => `
                        <div class="seat-item">
                            <span class="seat-number">Ghế ${
                              seat.SeatNumber
                            }</span>
                            <span class="seat-price">${new Intl.NumberFormat(
                              "vi-VN",
                              { style: "currency", currency: "VND" }
                            ).format(seat.Price)}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            
            <div class="qr-section">
                <div class="qr-code">
                    <img src="cid:qrimage" alt="QR Code" style="width: 140px; height: 140px; border-radius: 15px; background: #fff;" />
                </div>
                <div class="qr-text">Quét mã QR này tại rạp để nhận vé</div>
            </div>
            
            <div class="section">
                <div class="instructions">
                    <h4>📋 Hướng dẫn quan trọng</h4>
                    <ul>
                        <li>Vui lòng có mặt tại rạp trước giờ chiếu ít nhất 15 phút</li>
                        <li>Mang theo giấy tờ tùy thân để xác minh danh tính</li>
                        <li>Xuất trình mã QR hoặc mã đặt vé tại quầy vé</li>
                        <li>Vé không thể hoàn lại hoặc thay đổi sau khi đặt</li>
                        <li>Vui lòng tắt điện thoại và thiết bị điện tử trong rạp</li>
                        <li>Đến sớm để mua combo bắp rang bơ và nước uống</li>
                        <li>Tuân thủ các quy định an toàn của rạp chiếu phim</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Cảm ơn bạn đã lựa chọn CineZone - Nơi hội tụ những bộ phim tuyệt vời!</p>
            <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ hotline hỗ trợ khách hàng 24/7</p>
            <p class="brand">🎬 CineZone - Trải nghiệm điện ảnh đẳng cấp</p>
        </div>
    </div>
</body>
</html>
        `,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrBuffer,
            cid: 'qrimage' // same as in the img src above
          }
        ]
      };
      const result = await transporter.sendMail(mailOptions);
      console.log("Gửi mail thành công:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Lỗi gửi mail:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = BookingEmailService;
