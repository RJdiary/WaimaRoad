const storage = require('./storage');

function getToken() { return storage.get(storage.KEYS.TOKEN, ''); }
function isLogin() { return Boolean(getToken()); }
function saveLogin(token, userInfo) {
  storage.set(storage.KEYS.TOKEN, token);
  storage.set(storage.KEYS.USER, userInfo);
  Object.assign(getApp().globalData, { token, userInfo, isLogin: Boolean(token) });
}
function clearLogin() { getApp().logout(); }
function saveRedirect(redirect) { storage.set(storage.KEYS.REDIRECT, redirect); }
function takeRedirect() {
  const redirect = storage.get(storage.KEYS.REDIRECT, '');
  storage.remove(storage.KEYS.REDIRECT);
  return redirect;
}
function goLogin(redirect) {
  if (redirect) saveRedirect(redirect);
  wx.navigateTo({ url: '/pages/login/index?redirect=' + encodeURIComponent(redirect || '') });
}

module.exports = { getToken, isLogin, saveLogin, clearLogin, saveRedirect, takeRedirect, goLogin };
