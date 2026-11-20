const auth = require('../../../../utils/auth');
const api = require('../../../../utils/api');

function loadAll(page, records) {
  return api.getMyCheckins({ page, pageSize: 10 }).then((res) => {
    const next = records.concat(res.data.list || []);
    return res.data.hasMore ? loadAll(page + 1, next) : next;
  });
}

function buildMarkers(records) {
  const seen = {};
  return records.filter((item) => {
    if (seen[item.siteId]) return false;
    seen[item.siteId] = true;
    return Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng));
  }).map((item, index) => ({
    id: index + 1,
    siteId: item.siteId,
    latitude: Number(item.lat),
    longitude: Number(item.lng),
    iconPath: '/assets/markers/kaibu.png',
    width: 32,
    height: 40,
    callout: { content: '✓ ' + item.siteName, display: 'BYCLICK', padding: 6, borderRadius: 6, color: '#333333', bgColor: '#FFFFFF' }
  }));
}

Page({
  data: { list: [], markers: [], loading: true, failed: false, view: 'list', latitude: 23.352, longitude: 116.68, fontScale: 1 },
  onLoad(options) {
    if (!auth.requireLogin()) return;
    this.setData({ fontScale: getApp().globalData.fontScale, view: options.view === 'map' ? 'map' : 'list' });
    this.load();
  },
  load() {
    this.setData({ loading: true, failed: false });
    loadAll(1, []).then((list) => {
      const markers = buildMarkers(list);
      const first = markers[0];
      this.setData({
        list,
        markers,
        latitude: first ? first.latitude : 23.352,
        longitude: first ? first.longitude : 116.68,
        loading: false
      });
    }).catch(() => this.setData({ loading: false, failed: true }));
  },
  toggleView() { this.setData({ view: this.data.view === 'list' ? 'map' : 'list' }); },
  back() { wx.navigateBack(); },
  explore() { wx.switchTab({ url: '/pages/explore/index' }); },
  go(e) { wx.navigateTo({ url: '/subpackages/detail/pages/site-detail/index?siteId=' + e.currentTarget.dataset.id }); },
  markerTap(e) {
    const marker = this.data.markers.find((item) => item.id === e.detail.markerId);
    if (marker) this.go({ currentTarget: { dataset: { id: marker.siteId } } });
  }
});
