const USE_MOCK = true;
const { sites } = require('../mock/sites');
const PAGE_SIZE = 10;
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

function getSites({ category = 'all', keyword = '', page = 1, pageSize = PAGE_SIZE } = {}) {
  if (!USE_MOCK) return request({ url: '/sites', method: 'GET', data: { category, keyword, page, pageSize } });
  return mock(() => {
    let list = sites.slice();
    if (category && category !== 'all') list = list.filter((site) => site.category === category);
    const kw = String(keyword || '').trim();
    if (kw) list = list.filter((site) => (site.name + site.alias + site.summary).indexOf(kw) > -1);
    const total = list.length;
    const start = (page - 1) * pageSize;
    return { list: list.slice(start, start + pageSize), total, hasMore: start + pageSize < total };
  });
}

function getSite(id) {
  if (!USE_MOCK) return request({ url: '/sites/' + id, method: 'GET' });
  return mock(() => sites.find((site) => site.id === id) || null);
}

const getSiteDetail = getSite;

module.exports = { USE_MOCK, ok, fail, mock, request, getSites, getSite, getSiteDetail };
