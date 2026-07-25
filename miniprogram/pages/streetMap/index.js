const { routes, points } = require('../../utils/data');
const db = require('../../utils/db');
const fallbackRoute = routes[0];

Page({
  data: { route: fallbackRoute, points: [], markers: [], progress: 0, visitedCount: 0, showPopup: false, currentPoint: null, latitude: 23.3575, longitude: 116.6950, scale: 15 },
  onLoad(options) {
    const route = routes.find(item => item.id === options.routeId) || fallbackRoute;
    const routePoints = points.filter(item => item.routeId === route.id);
    this.setRoute(route, routePoints);
    db.getPointsByRouteId(route.id).then(function (cloudPoints) {
      if (cloudPoints && cloudPoints.length) this.setRoute(route, cloudPoints);
    }.bind(this));
  },
  setRoute(route, routePoints) {
    const visitedCount = routePoints.filter(item => item.status === 'visited').length;
    const markers = routePoints.map(item => ({ id: item.id, latitude: item.lat, longitude: item.lng, width: 30, height: 30, callout: { content: item.name, color: '#2D2418', fontSize: 11, borderRadius: 8, bgColor: '#ffffff', padding: 5, display: 'BYCLICK' } }));
    this.setData({ route, points: routePoints, markers, visitedCount, progress: Math.round(visitedCount / Math.max(routePoints.length, 1) * 100) });
  },
  onBack() { wx.navigateBack(); },
  onMarkerTap(e) { this.openPopup(this.data.points.find(item => item.id === e.detail.markerId)); },
  onPointTap(e) { this.openPopup(this.data.points.find(item => item.id === e.currentTarget.dataset.pointId)); },
  openPopup(point) { if (point) this.setData({ currentPoint: point, showPopup: true }); },
  closePopup() { this.setData({ showPopup: false }); },
  checkin() {
    const current = this.data.currentPoint; if (!current || current.status === 'visited') return;
    const routePoints = this.data.points.map(item => Object.assign({}, item, { status: item.id === current.id ? 'visited' : item.status }));
    this.setRoute(this.data.route, routePoints); this.setData({ currentPoint: Object.assign({}, current, { status: 'visited' }) }); wx.showToast({ title: '打卡成功', icon: 'success' });
  },
  goToHeritage() { const point = this.data.currentPoint; if (point && point.heritageId) wx.navigateTo({ url: '/pages/heritageDetail/index?id=' + point.heritageId }); else wx.showToast({ title: '该点位史料整理中', icon: 'none' }); },
  goToExplore() { wx.switchTab({ url: '/pages/explore/index' }); },
  onPlayVideo() { wx.showToast({ title: 'AI辅助复原影像待接入', icon: 'none' }); },
  onPlayAudio() { wx.showToast({ title: '导览音频待接入', icon: 'none' }); }
});
