function padZero(value) { return String(value).padStart(2, '0'); }
function stripZero(value) { return value.toFixed(1).replace(/\.0$/, ''); }
function formatCount(value) {
  const count = Number(value) || 0;
  if (count >= 10000) return stripZero(count / 10000) + 'w';
  if (count >= 1000) return stripZero(count / 1000) + 'k';
  return String(count);
}
function formatDistance(value) {
  const distance = Number(value) || 0;
  return distance < 1000 ? Math.round(distance) + 'm' : (distance / 1000).toFixed(1) + 'km';
}
function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.getFullYear() + '-' + padZero(date.getMonth() + 1) + '-' + padZero(date.getDate()) + ' ' + padZero(date.getHours()) + ':' + padZero(date.getMinutes());
}

module.exports = { formatCount, formatDistance, formatTime, padZero };
