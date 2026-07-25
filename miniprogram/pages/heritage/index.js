const { heritages, categories } = require('../../utils/data');
const db = require('../../utils/db');

Page({
  data: { categories: categories, activeCategory: 'all', list: [] },
  onLoad() {
    const app = getApp();
    const category = app.globalData.selectedCategory || 'all';
    app.globalData.selectedCategory = null;
    this.selectCategory(category);
  },
  selectCategory(category) {
    const that = this;
    this.setData({ activeCategory: category });
    db.getHeritages(category).then(function (list) {
      that.setData({ list: list && list.length ? list : (category === 'all' ? heritages : heritages.filter(item => item.category === category)) });
    });
  },
  onCategoryTap(e) { this.selectCategory(e.currentTarget.dataset.key); },
  goToDetail(e) {
    const { id, category } = e.currentTarget.dataset;
    wx.navigateTo({ url: category === 'ai' ? '/pages/aiCompare/index?id=' + id : '/pages/heritageDetail/index?id=' + id });
  },
  onPullDownRefresh() { this.selectCategory(this.data.activeCategory); wx.stopPullDownRefresh(); }
});
