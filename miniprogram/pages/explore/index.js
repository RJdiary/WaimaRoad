Page({
  data: { pageStyle: '' },
  onShow() {
    this.setData({ pageStyle: getApp().getPageStyle() });
    if (typeof this.getTabBar === 'function' && this.getTabBar()) this.getTabBar().setData({ selected: 0 });
  }
});
