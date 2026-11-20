const api = require('../../../../utils/api');
const hotKeywords = ['海关', '侨批', '老妈宫', '红色交通站'];

function highlight(value, keyword) {
  const text = String(value || '');
  const term = String(keyword || '').trim();
  if (!term) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const needle = term.toLowerCase();
  const parts = [];
  let cursor = 0;
  let index = lower.indexOf(needle, cursor);
  while (index > -1) {
    if (index > cursor) parts.push({ text: text.slice(cursor, index), hit: false });
    parts.push({ text: text.slice(index, index + term.length), hit: true });
    cursor = index + term.length;
    index = lower.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), hit: false });
  return parts.length ? parts : [{ text, hit: false }];
}

function resultItem(item, type, keyword) {
  return {
    id: item.id,
    type,
    title: item.name,
    titleParts: highlight(item.name, keyword),
    summaryParts: highlight(item.summary || item.intro || item.address || '', keyword)
  };
}

Page({
  data: { keyword: '', groups: [], history: [], hotKeywords, searched: false, loading: false, fontScale: 1 },
  onLoad(options) {
    this.setData({ fontScale: getApp().globalData.fontScale, keyword: options.keyword || '' });
    api.getSearchHistory().then((res) => this.setData({ history: res.data || [] }));
    if (options.keyword) this.search();
  },
  onUnload() { clearTimeout(this.timer); },
  back() { wx.navigateBack(); },
  input(e) {
    const keyword = e.detail.value;
    this.setData({ keyword, searched: false, groups: [] });
    clearTimeout(this.timer);
    if (keyword.trim()) this.timer = setTimeout(() => this.search(), 300);
  },
  onKeywordTap(e) { this.setData({ keyword: e.currentTarget.dataset.key }); this.search(); },
  clearHistory() {
    api.saveSearchHistory([]).then(() => this.setData({ history: [] }));
  },
  async search() {
    const keyword = this.data.keyword.trim();
    if (!keyword) return this.setData({ groups: [], searched: false, loading: false });
    this.setData({ loading: true });
    try {
      const results = await Promise.all([api.getSites({ keyword, pageSize: 20 }), api.getRoutes({ keyword })]);
      if (keyword !== this.data.keyword.trim()) return;
      const sites = results[0].data.list || [];
      const routes = results[1].data || [];
      const groups = [
        { key: 'archive', title: '史料', items: sites.map((item) => resultItem(item, 'archive', keyword)) },
        { key: 'route', title: '路线', items: routes.map((item) => resultItem(item, 'route', keyword)) },
        { key: 'site', title: '点位', items: sites.map((item) => resultItem(item, 'site', keyword)) }
      ].filter((group) => group.items.length);
      const history = [keyword].concat(this.data.history.filter((item) => item !== keyword)).slice(0, 10);
      this.setData({ groups, history, searched: true, loading: false });
      api.saveSearchHistory(history);
    } catch (error) {
      this.setData({ groups: [], searched: true, loading: false });
    }
  },
  goResult(e) {
    const data = e.currentTarget.dataset;
    if (!data.id) return wx.showToast({ title: '内容暂不可用', icon: 'none' });
    const url = data.type === 'route'
      ? '/subpackages/route/pages/route-detail/index?routeId=' + data.id
      : '/subpackages/detail/pages/site-detail/index?siteId=' + data.id;
    wx.navigateTo({ url });
  }
});
