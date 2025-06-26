module.exports = {
    BOOKING_STATUS: {
        PENDING: 1,      // Đã tạo booking nhưng chưa thanh toán
        PAID: 2,         // Đã thanh toán
        COMPLETED: 3,    // Đã sử dụng dịch vụ
        CANCELLED: 4,    // Đã hủy
    },

    PAYMENT_STATUS: {
        PENDING: 1,
        COMPLETED: 2,
        FAILED: 3,
        CANCELLED: 4
    }
};