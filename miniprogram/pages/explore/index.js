const { categories } = require('../../utils/data');
Page({
  data: { currentTime: '', categories: categories.filter(item => item.key !== 'all' && item.key !== 'ai') },
  onLoad() { this.setCurrentTime(); },
  setCurrentTime() { const now = new Date(); this.setData({ currentTime: '今天 ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ' · 外马路等你来读' }); },
  goToHeritage(e) { getApp().globalData.selectedCategory = e.currentTarget.dataset.category; wx.switchTab({ url: '/pages/heritage/index' }); },
  goToStreet() { wx.switchTab({ url: '/pages/street/index' }); },
  goToAiCompare() { wx.navigateTo({ url: '/pages/aiCompare/index?id=9' }); }
});
