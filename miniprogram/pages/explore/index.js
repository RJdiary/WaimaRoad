const api = require('../../utils/api');
const storage = require('../../utils/storage');
const location = require('../../utils/location');
const format = require('../../utils/format');

const markerPath = (category) => '/assets/markers/' + category + '.png';
Page({
  data: {
    pageStyle: '', statusBarHeight: 0, collapsed: false, searchFixed: false,
    mapCenter: { latitude: 23.3546, longitude: 116.6819 }, markers: [], controls: [], mapLoading: true,
    selectedSite: null, locationTipVisible: false, locationDenied: false, mapFullscreen: false,
    entryCards: [
      { title: '开埠外交', subtitle: '从海关与洋行读懂开埠', url: '/subpackages/detail/pages/topic/index?theme=kaibu', colors: ['card-a', 'card-b', 'card-c'], active: 0 },
      { title: '红色革命', subtitle: '追寻东征与抗战记忆', url: '/subpackages/detail/pages/topic/index?theme=hongse', colors: ['card-b', 'card-c', 'card-a'], active: 0 },
      { title: 'AI复原影像', subtitle: '看到已消失的点位', url: '/subpackages/detail/pages/ai-restore/index?siteId=site_001', colors: ['card-c', 'card-a', 'card-b'], active: 0 },
      { title: 'Citywalk路线', subtitle: '边走边读老城', tab: true, colors: ['card-a', 'card-c', 'card-b'], active: 0 }
    ]
  },
  onLoad() {
    const app = getApp();
    this.markerMap = {};
    this.lastMarkerTap = 0;
    this.setData({ statusBarHeight: app.globalData.statusBarHeight, locationTipVisible: !storage.get(storage.KEYS.LOCATION_TIP, '') });
    this.loadSites();
  },
  onReady() { this.mapCtx = wx.createMapContext('exploreMap', this); },
  onShow() {
    this.setData({ pageStyle: getApp().getPageStyle(), statusBarHeight: getApp().globalData.statusBarHeight });
    const tabBar = typeof this.getTabBar === 'function' && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 0 });
  },
  makeMarkers(sites) {
    this.markerMap = {};
    return sites.map((site, index) => {
      const id = index + 1;
      this.markerMap[id] = site;
      return { id, latitude: site.location.lat, longitude: site.location.lng, iconPath: markerPath(site.category), width: 28, height: 36, zIndex: 1, callout: { content: site.name, color: '#333333', fontSize: 11, borderRadius: 4, bgColor: '#FFFFFF', padding: 4, display: 'ALWAYS' } };
    });
  },
  loadSites() {
    this.setData({ mapLoading: true });
    return api.getSites({ page: 1, pageSize: 12 }).then((res) => {
      if (res.code !== 0) throw new Error(res.msg);
      this.setData({ markers: this.makeMarkers(res.data.list), mapLoading: false, selectedSite: null });
    }).catch((error) => { this.setData({ mapLoading: false }); wx.showToast({ title: error.message || '加载失败，请稍后重试', icon: 'none' }); });
  },
  onMarkerTap(event) {
    this.lastMarkerTap = Date.now();
    const markerId = event.detail.markerId;
    const site = this.markerMap[markerId];
    if (!site) return;
    const selectedId = this.data.selectedSite && this.data.selectedSite.markerId;
    const markers = this.data.markers.map((marker) => ({ ...marker, width: marker.id === markerId && selectedId !== markerId ? 34 : 28, height: marker.id === markerId && selectedId !== markerId ? 43 : 36, zIndex: marker.id === markerId && selectedId !== markerId ? 2 : 1 }));
    this.setData({ markers, selectedSite: selectedId === markerId ? null : { ...site, markerId, distanceText: site.distanceText || '定位后显示距离' } });
  },
  onMapTap() { if (Date.now() - this.lastMarkerTap > 100) this.closePoi(); },
  closePoi() {
    const markers = this.data.markers.map((marker) => ({ ...marker, width: 28, height: 36, zIndex: 1 }));
    this.setData({ selectedSite: null, markers });
  },
  onLocate() {
    location.requestLocation().then((position) => {
      Object.keys(this.markerMap).forEach((id) => {
        const site = this.markerMap[id];
        site.distanceText = format.formatDistance(location.getDistance(position.latitude, position.longitude, site.location.lat, site.location.lng));
      });
      const selected = this.data.selectedSite;
      if (selected) this.setData({ selectedSite: { ...this.markerMap[selected.markerId], markerId: selected.markerId, distanceText: this.markerMap[selected.markerId].distanceText } });
      this.setData({ locationDenied: false });
      if (this.mapCtx) this.mapCtx.moveToLocation();
    }).catch(() => this.setData({ locationDenied: true }));
  },
  onAllowLocation() { storage.set(storage.KEYS.LOCATION_TIP, 'shown'); this.setData({ locationTipVisible: false }); this.onLocate(); },
  onBrowseFirst() { storage.set(storage.KEYS.LOCATION_TIP, 'shown'); this.setData({ locationTipVisible: false }); },
  onOpenSetting() { location.openSetting().then(() => this.onLocate()); },
  onLayerTip() { wx.showToast({ title: '路线与足迹图层即将开放', icon: 'none' }); },
  onFullscreen() { this.setData({ mapFullscreen: true }); },
  onExitFullscreen() { this.setData({ mapFullscreen: false }); },
  onSearch() { wx.navigateTo({ url: '/subpackages/user/pages/search/index?from=explore' }); },
  onPoiAction(event) { const action = event.currentTarget.dataset.action; const id = this.data.selectedSite.id; const suffix = action === 'detail' ? '' : '&action=' + action; wx.navigateTo({ url: '/subpackages/detail/pages/site-detail/index?siteId=' + id + suffix }); },
  onEntryChange(event) { const index = event.currentTarget.dataset.index; const cards = this.data.entryCards.slice(); cards[index].active = event.detail.current; this.setData({ entryCards: cards }); },
  onEntryTap(event) { const card = this.data.entryCards[event.currentTarget.dataset.index]; if (card.tab) wx.switchTab({ url: '/pages/walk/index' }); else wx.navigateTo({ url: card.url }); },
  onPageScroll(event) { const top = event.scrollTop; const next = this.data.collapsed ? top >= 60 : top >= 80; if (next !== this.data.collapsed) this.setData({ collapsed: next, searchFixed: next }); },
  onPullDownRefresh() { this.loadSites().finally(() => wx.stopPullDownRefresh()); },
  onShareAppMessage() { return { title: '埠影寻踪｜在汕头老城，边走边读百年', path: '/pages/explore/index' }; }
});
