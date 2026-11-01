const USE_MOCK = true;
function ok(data) { return { code: 0, data, msg: 'ok' }; }
function fail(msg, code = -1) { return { code, data: null, msg }; }
function mock(build) {
  return new Promise((resolve) => {
    const delay = 300 + Math.floor(Math.random() * 301);
    setTimeout(() => resolve(ok(typeof build === 'function' ? build() : build)), delay);
  });
}
function request(options) {
  if (USE_MOCK) return mock(null);
  return new Promise((resolve, reject) => {
    wx.request({ ...options, success: resolve, fail: reject });
  });
}

module.exports = { USE_MOCK, ok, fail, mock, request };
