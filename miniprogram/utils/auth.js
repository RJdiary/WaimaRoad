const storage = require('./storage');
function app() { try { return getApp(); } catch (error) { return null; } }
function getToken() { return storage.get(storage.KEYS.TOKEN, ''); }
function getUser() { const user = storage.get(storage.KEYS.USER, null); const instance = app(); if (instance && user) instance.globalData.userInfo = user; return user; }
function isLoggedIn() { return Boolean(getToken() && getUser()); }
function login(session) { const token = session.token || ''; const userInfo = session.user || session.userInfo || null; storage.set(storage.KEYS.TOKEN, token); storage.set(storage.KEYS.USER, userInfo); const instance = app(); if (instance) Object.assign(instance.globalData, { token, userInfo, isLogin: Boolean(token) }); }
function updateUser(patch) { const user = Object.assign({}, getUser() || {}, patch); storage.set(storage.KEYS.USER, user); const instance = app(); if (instance) instance.globalData.userInfo = user; return user; }
function logout() { const instance = app(); if (instance && instance.logout) instance.logout(); else { storage.remove(storage.KEYS.TOKEN); storage.remove(storage.KEYS.USER); } }
function buildRedirect() { const pages = getCurrentPages(); const page = pages[pages.length - 1]; const query = page && page.options ? Object.keys(page.options).map((key) => key + '=' + encodeURIComponent(page.options[key])).join('&') : ''; return '/' + (page ? page.route : 'pages/profile/index') + (query ? '?' + query : ''); }
function requireLogin(options = {}) { if (isLoggedIn()) return true; const target = options.redirect || buildRedirect(); storage.set(storage.KEYS.REDIRECT, encodeURIComponent(target)); wx.navigateTo({ url: '/pages/login/index' }); return false; }
function goLogin(redirect) { if (isLoggedIn()) return true; const target = redirect || buildRedirect(); storage.set(storage.KEYS.REDIRECT, encodeURIComponent(target)); wx.navigateTo({ url: '/pages/login/index' }); return false; }
function consumeRedirect() { const encoded = storage.get(storage.KEYS.REDIRECT, ''); storage.remove(storage.KEYS.REDIRECT); if (!encoded) return null; try { return decodeURIComponent(encoded); } catch (error) { return encoded; } }
function redirectAfterLogin() { const target = consumeRedirect(); if (!target) return wx.switchTab({ url: '/pages/profile/index' }); const pages = getCurrentPages(); const previous = pages[pages.length - 2]; const path = target.split('?')[0].replace(/^\//, ''); if (previous && previous.route === path) return wx.navigateBack(); return wx.reLaunch({ url: target }); }
module.exports = { getToken, getUser, isLoggedIn, login, updateUser, logout, buildRedirect, requireLogin, goLogin, consumeRedirect, redirectAfterLogin, isLogin: isLoggedIn, saveLogin: (token, userInfo) => login({ token, userInfo }), clearLogin: logout };
