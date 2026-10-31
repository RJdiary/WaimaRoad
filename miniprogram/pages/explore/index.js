const { categories } = require('../../utils/data');
Page({
  data: {
    currentTime: '',
    categories: categories.filter(item => item.key !== 'all' && item.key !== 'ai'),
    mapLatitude: 23.3575, mapLongitude: 116.6950, mapScale: 15,
    mapMarkers: [
      { id: 1, latitude: 23.3546, longitude: 116.6884, iconPath: '/images/icons/home-active.png', width: 30, height: 30, label: { content: '潮海关旧址', color: '#2F2A28', fontSize: 11, borderRadius: 6, bgColor: '#FFFFFF', padding: 5 } },
      { id: 2, latitude: 23.3575, longitude: 116.6948, iconPath: '/images/icons/business-active.png', width: 30, height: 30, label: { content: '东征军旧址', color: '#8B2635', fontSize: 11, borderRadius: 6, bgColor: '#FFF7F2', padding: 5 } },
      { id: 3, latitude: 23.3552, longitude: 116.6960, iconPath: '/images/icons/goods-active.png', width: 30, height: 30, label: { content: '老妈宫与戏台', color: '#2F2A28', fontSize: 11, borderRadius: 6, bgColor: '#FFFFFF', padding: 5 } },
      { id: 4, latitude: 23.3590, longitude: 116.6934, iconPath: '/images/icons/examples-active.png', width: 30, height: 30, label: { content: '侨批文物馆', color: '#2F2A28', fontSize: 11, borderRadius: 6, bgColor: '#FFFFFF', padding: 5 } }
    ]
  },
  onLoad() { this.setCurrentTime(); },
  setCurrentTime() { const now = new Date(); this.setData({ currentTime: '今天 ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ' · 外马路等你来读' }); },
  goToHeritage(e) { getApp().globalData.selectedCategory = e.currentTarget.dataset.category; wx.switchTab({ url: '/pages/heritage/index' }); },
  goToStreet() { wx.switchTab({ url: '/pages/street/index' }); },
  goToAiCompare() { wx.navigateTo({ url: '/pages/aiCompare/index?id=9' }); },
  onMapMarkerTap(e) {
    const categoryMap = { 1: 'diplomacy', 2: 'red', 3: 'culture', 4: 'commerce' };
    this.goToHeritage({ currentTarget: { dataset: { category: categoryMap[e.detail.markerId] || 'diplomacy' } } });
  }
});
