const api = require('../../utils/api');
const filters = [{ key: 'all', name: '全部' }, { key: 'kaibu', name: '开埠外交' }, { key: 'qiaoxiang', name: '侨乡商贸' }, { key: 'wenjiao', name: '文教宗教' }, { key: 'hongse', name: '红色革命' }];
Page({
  data: { pageStyle: '', statusBarHeight: 0, filters, category: 'all', list: [], page: 1, hasMore: true, loading: true, error: false },
  onLoad() { this.requestSeq = 0; this.setData({ statusBarHeight: getApp().globalData.statusBarHeight }); this.loadList(true); },
  onShow() { this.setData({ pageStyle: getApp().getPageStyle(), statusBarHeight: getApp().globalData.statusBarHeight }); const tabBar = typeof this.getTabBar === 'function' && this.getTabBar(); if (tabBar) tabBar.setData({ selected: 1 }); },
  loadList(reset) {
    const page = reset ? 1 : this.data.page + 1;
    const requestSeq = ++this.requestSeq;
    this.setData({ loading: true, error: false });
    return api.getSites({ category: this.data.category, page, pageSize: 10 }).then((res) => {
      if (requestSeq !== this.requestSeq) return;
      if (res.code !== 0) throw new Error(res.msg);
      this.setData({ list: reset ? res.data.list : this.data.list.concat(res.data.list), page, hasMore: res.data.hasMore, loading: false });
    }).catch((error) => { if (requestSeq === this.requestSeq) { this.setData({ loading: false, error: true }); wx.showToast({ title: error.message || '加载失败，请稍后重试', icon: 'none' }); } });
  },
  onFilterChange(event) { const category = event.detail.key; if (category === this.data.category) return; this.setData({ category, list: [], page: 1, hasMore: true }); wx.pageScrollTo({ scrollTop: 0, duration: 200 }); this.loadList(true); },
  onReachBottom() { if (this.data.hasMore && !this.data.loading && !this.data.error) this.loadList(false); },
  onPullDownRefresh() { this.loadList(true).finally(() => wx.stopPullDownRefresh()); },
  onRetry() { this.loadList(this.data.list.length === 0); },
  onShowAll() { this.onFilterChange({ detail: { key: 'all' } }); },
  onCardSelect(event) { wx.navigateTo({ url: '/subpackages/detail/pages/site-detail/index?siteId=' + event.detail.id }); },
  onSearch() { wx.navigateTo({ url: '/subpackages/user/pages/search/index?from=archive' }); },
  onShareAppMessage() { return { title: '埠影寻踪｜在汕头老城，边走边读百年', path: '/pages/explore/index' }; }
});
