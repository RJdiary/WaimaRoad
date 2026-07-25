const { routes } = require('../../utils/data');
const db = require('../../utils/db');
Page({
  data: { routes: routes },
  onLoad() { db.getRoutes().then(list => this.setData({ routes: list && list.length ? list : routes })); },
  goToStreetMap(e) { wx.navigateTo({ url: '/pages/streetMap/index?routeId=' + e.currentTarget.dataset.routeId }); },
  onPullDownRefresh() { wx.stopPullDownRefresh(); }
});
