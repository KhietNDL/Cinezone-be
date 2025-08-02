// utils/date.js

// Format JS Date object hoặc chuỗi date về dạng MySQL DATETIME: 'YYYY-MM-DD HH:mm:ss'
function formatDateTime(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// Format JS Date object hoặc chuỗi date về dạng 'YYYY-MM-DD HH:mm:ss' (dùng khi trả ra ngoài)
function formatDateTimeString(date) {
  if (!date) return null;
  const d = new Date(date);
  return (
    d.getFullYear() +
    '-' + String(d.getMonth() + 1).padStart(2, '0') +
    '-' + String(d.getDate()).padStart(2, '0') +
    ' ' + String(d.getHours()).padStart(2, '0') +
    ':' + String(d.getMinutes()).padStart(2, '0') +
    ':' + String(d.getSeconds()).padStart(2, '0')
  );
}

module.exports = {
  formatDateTime,
  formatDateTimeString,
};