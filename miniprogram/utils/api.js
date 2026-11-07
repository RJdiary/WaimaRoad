const USE_MOCK = true;
const { sites } = require('../mock/sites');
const { routes } = require('../mock/routes');
const { mockAccount, mockUser, mockWechatUser, mockCheckins, mockFavorites, mockMessages } = require('../mock/user');
const storage = require('./storage');
const PAGE_SIZE = 10;
let messageRecords = mockMessages.slice();
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
    return { list: list.slice(start, start + pageSize).map((site) => hydrateSite(site, sites.indexOf(site))), total, hasMore: start + pageSize < total };
  });
}

function getSite(id) {
  if (!USE_MOCK) return request({ url: '/sites/' + id, method: 'GET' });
  return mock(() => sites.find((site) => site.id === id) || null);
}

function hydrateSite(site, index) {
  if (!site) return null;
  const disappeared = index % 2 === 1;
  return Object.assign({}, site, {
    era: site.era || (index % 3 === 0 ? '1920 年代' : index % 3 === 1 ? '1930 年代' : '1940 年代'),
    structure: site.structure || '砖木结构', originalUse: site.originalUse || '公共建筑',
    currentStatus: site.currentStatus || (disappeared ? '已消失' : '现存'),
    openTime: site.openTime || '周二至周日 09:00—17:00',
    description: site.description || site.summary,
    images: site.images && site.images.length ? site.images : [site.cover],
    oldPhotos: site.oldPhotos && site.oldPhotos.length ? site.oldPhotos : [{ url: '', year: '约 ' + (1920 + index * 3), source: '馆藏资料' }],
    aiRestored: site.aiRestored || '', audio: site.audio || { url: '', duration: 0 }
  });
}
function allSites() { return sites.map(hydrateSite); }
function getSiteDetail(id) { if (!USE_MOCK) return request({ url: '/sites/' + id, method: 'GET' }); return mock(() => hydrateSite(sites.find((site) => site.id === id), sites.findIndex((site) => site.id === id))); }
function getRoutes() { if (!USE_MOCK) return request({ url: '/routes', method: 'GET' }); return mock(() => routes.slice().sort((a, b) => a.order - b.order)); }
function getRouteDetail(id) { if (!USE_MOCK) return request({ url: '/routes/' + id, method: 'GET' }); return mock(() => routes.find((route) => route.id === id) || null); }
function seeded(key, source) { const value = storage.get(key, null); if (value === null) { storage.set(key, source.slice ? source.slice() : source); return source.slice ? source.slice() : source; } return value; }
function getMyFavorites() { return mock(() => seeded(storage.KEYS.FAVORITES, mockFavorites)); }
function getMyCheckins() { return mock(() => seeded(storage.KEYS.CHECKINS, mockCheckins)); }
function addFavorite(targetId, type) { return mock(() => { const list = storage.get(storage.KEYS.FAVORITES, []); if (!list.some((item) => item.targetId === targetId && item.type === type)) storage.set(storage.KEYS.FAVORITES, list.concat({ id: 'fav_' + Date.now(), type, targetId, createdAt: Date.now() })); return { favorited: true }; }); }
function removeFavorite(targetId, type) { return mock(() => { const list = storage.get(storage.KEYS.FAVORITES, []); storage.set(storage.KEYS.FAVORITES, list.filter((item) => !(item.targetId === targetId && item.type === type))); return { favorited: false }; }); }
function createCheckin(payload) { return mock(() => { const list = storage.get(storage.KEYS.CHECKINS, []); const today = new Date().toISOString().slice(0, 10); const old = list.find((item) => item.siteId === payload.siteId && String(item.time).slice(0, 10) === today); if (old) return { duplicated: true, count: old.count, record: old }; const count = list.filter((item) => item.siteId === payload.siteId).length + 1; const record = Object.assign({ id: 'checkin_' + Date.now(), time: new Date().toISOString(), count }, payload); storage.set(storage.KEYS.CHECKINS, [record].concat(list)); return { duplicated: false, count, record }; }); }
function reportSiteView(siteId) { return mock(() => { const log = storage.get(storage.KEYS.VIEW_LOG, {}); const today = new Date().toISOString().slice(0, 10); if (log[siteId] === today) return { reported: false }; log[siteId] = today; storage.set(storage.KEYS.VIEW_LOG, log); return { reported: true }; }); }
function restoreSite() { return mock(() => ({ progress: 100 })); }
function post(url, data = {}) { if (url === '/auth/login') return mock(() => data.account === mockAccount.account && data.password === mockAccount.password ? { token: 'mock_token_001', userInfo: mockUser } : { invalid: true }); if (url === '/auth/register') return mock(() => data.phone === mockUser.phone ? { registered: true } : { token: 'mock_token_' + Date.now(), userInfo: Object.assign({}, mockUser, { nickname: data.nickname, phone: data.phone }) }); if (url === '/auth/wechat') return mock(() => ({ token: 'mock_wx_token', userInfo: mockWechatUser })); return mock(() => ({})); }
function get(url, data) { if (url === '/messages') return getMessages(); if (url === '/me') return mock(() => storage.get(storage.KEYS.USER, mockUser)); if (url === '/sites') return getSites(data); return mock(() => null); }
function patch(url, data = {}) { if (url === '/me') return mock(() => data); if (url.indexOf('/messages/') === 0) return mock(() => { messageRecords = messageRecords.map((item) => item.id === url.split('/').pop() ? Object.assign({}, item, data) : item); return true; }); return mock(() => true); }
function del(url) { const matched = url.match(/^\/(sites|routes)\/([^/]+)\/favorite$/); return matched ? removeFavorite(matched[2], matched[1] === 'sites' ? 'site' : 'route') : mock(() => true); }
function getMessages() { return mock(() => messageRecords.slice().sort((a, b) => new Date(b.time) - new Date(a.time))); }

module.exports = { USE_MOCK, ok, fail, mock, request, get, post, patch, delete: del, getSites, getSite, getSiteDetail, getRoutes, getRouteDetail, getMyFavorites, getMyCheckins, getMessages, addFavorite, removeFavorite, createCheckin, reportSiteView, restoreSite, allSites };
