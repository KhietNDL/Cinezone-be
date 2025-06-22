// Helper để chuẩn hóa ngày về dạng YYYY-MM-DD
function normalizeDate(dateInput) {
    if (!dateInput) return null;
    if (typeof dateInput === 'string') {
        // Nếu là dạng YYYY-MM-DD hoặc YYYY-MM-DD HH:mm:ss
        return dateInput.slice(0, 10);
    }
    if (dateInput instanceof Date) {
        // Lấy ngày theo local time, không dùng toISOString
        const y = dateInput.getFullYear();
        const m = String(dateInput.getMonth() + 1).padStart(2, '0');
        const d = String(dateInput.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return null;
}

module.exports = { normalizeDate };