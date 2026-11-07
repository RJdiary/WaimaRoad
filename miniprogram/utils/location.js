const storage = require('./storage');
function privacyAuthorize() { return new Promise((resolve) => { if (!wx.requirePrivacyAuthorize) return resolve(true); wx.requirePrivacyAuthorize({ success: () => resolve(true), fail: () => resolve(false) }); }); }
function requestLocation() { return privacyAuthorize().then((allowed) => { if (!allowed) return Promise.reject(new Error('privacy denied')); return new Promise((resolve, reject) => wx.getLocation({ type: 'gcj02', success: resolve, fail: reject })); }); }
function getDistance(lat1, lng1, lat2, lng2) { const rad = Math.PI / 180; const dLat = (lat2 - lat1) * rad; const dLng = (lng2 - lng1) * rad; const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2; return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); }
function validateCheckinLocation(location, site) { if (!location || Number(location.accuracy) > 100) return { valid: false, reason: 'weak-signal', message: '信号较弱，请稍后重试' }; const distance = getDistance(location.latitude, location.longitude, site.location.lat, site.location.lng); if (distance > 200) return { valid: false, reason: 'too-far', distance, message: '距离点位过远' }; return { valid: true, distance, arrived: distance <= 50 }; }
function shouldShowLocationTip() { return !storage.get(storage.KEYS.LOCATION_TIP, false); }
function acknowledgeLocationTip() { storage.set(storage.KEYS.LOCATION_TIP, true); }
function openSetting() { return new Promise((resolve, reject) => wx.openSetting({ success: resolve, fail: reject })); }
module.exports = { privacyAuthorize, requestLocation, getDistance, validateCheckinLocation, shouldShowLocationTip, acknowledgeLocationTip, openSetting };
