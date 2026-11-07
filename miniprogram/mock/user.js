const mockAccount = { account: 'baibianwaimatu', password: '123456' };
const mockUser = { id: 'u_001', nickname: '埠影行者', avatar: '', phone: '13800001234', bio: '沿外马路慢慢走，边看边记。', createdAt: '2026-09-01' };
const mockWechatUser = { id: 'u_wx_001', nickname: '埠影新客', avatar: '', bio: '', phone: '', createdAt: '2026-11-02' };
const mockCheckins = [
  { id: 'checkin_001', siteId: 'site_001', siteName: '潮海关旧址', cover: '', time: '2026-11-02T14:32:00', lat: 23.3520, lng: 116.6785, distance: 18, count: 2 },
  { id: 'checkin_002', siteId: 'site_005', siteName: '侨批文物馆', cover: '', time: '2026-11-01T10:18:00', lat: 23.3535, lng: 116.6804, distance: 26, count: 1 },
  { id: 'checkin_003', siteId: 'site_007', siteName: '老妈宫与戏台', cover: '', time: '2026-10-01T09:20:00', lat: 23.3552, lng: 116.6815, distance: 32, count: 1 },
  { id: 'checkin_004', siteId: 'site_010', siteName: '大埔会馆', cover: '', time: '2026-09-28T15:42:00', lat: 23.3556, lng: 116.6793, distance: 20, count: 1 },
  { id: 'checkin_005', siteId: 'site_012', siteName: '桂园', cover: '', time: '2026-09-14T11:08:00', lat: 23.3562, lng: 116.6802, distance: 40, count: 1 },
  { id: 'checkin_006', siteId: 'site_001', siteName: '潮海关旧址', cover: '', time: '2026-08-18T16:10:00', lat: 23.3520, lng: 116.6785, distance: 22, count: 1 }
];
const mockFavorites = [
  { id: 'fav_001', type: 'site', targetId: 'site_001', createdAt: '2026-10-20' }, { id: 'fav_002', type: 'site', targetId: 'site_005', createdAt: '2026-10-18' },
  { id: 'fav_003', type: 'site', targetId: 'site_007', createdAt: '2026-10-12' }, { id: 'fav_004', type: 'site', targetId: 'site_010', createdAt: '2026-10-03' },
  { id: 'fav_005', type: 'route', targetId: 'route_01', createdAt: '2026-09-20' }, { id: 'fav_006', type: 'route', targetId: 'route_04', createdAt: '2026-09-08' }
];
const mockPreferences = { themes: ['kaibu', 'qiaoxiang'], recommendBias: 3, notify: { checkin: true, route: true, system: true }, showLost: true, mapLayer: 'sites' };
const mockMessages = [
  { id: 'msg_001', type: 'system', title: '路线推荐已更新', summary: '开埠外交线等你从潮海关旧址出发。', time: '2026-11-02T09:00:00', read: false, link: '/subpackages/route/pages/route-detail/index?routeId=route_01' },
  { id: 'msg_002', type: 'interact', title: '收藏内容有新史料', summary: '潮海关旧址补充了一张老照片。', time: '2026-11-01T16:30:00', read: false, link: '/subpackages/detail/pages/site-detail/index?siteId=site_001' },
  { id: 'msg_003', type: 'system', title: '打卡小提醒', summary: '附近的侨批文物馆可继续探索。', time: '2026-10-30T10:20:00', read: true, link: '' },
  { id: 'msg_004', type: 'interact', title: '新的路线收藏', summary: '红色革命线已加入你的收藏。', time: '2026-10-26T12:00:00', read: true, link: '/subpackages/user/pages/favorites/index' },
  { id: 'msg_005', type: 'system', title: '隐私设置提示', summary: '你可以随时调整足迹展示方式。', time: '2026-10-21T09:15:00', read: true, link: '/subpackages/user/pages/privacy/index' },
  { id: 'msg_006', type: 'interact', title: '老城漫游记录', summary: '你已累计留下 6 次打卡记录。', time: '2026-10-18T18:00:00', read: true, link: '/subpackages/user/pages/checkins/index' }
];
module.exports = { mockAccount, mockUser, mockWechatUser, mockCheckins, mockFavorites, mockPreferences, mockMessages };
