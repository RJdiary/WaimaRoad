const app = getApp();

Page({
  data: {
    categories: [
      { key: 'building', name: '🏛 建筑', checked: false },
      { key: 'red', name: '⭐ 红色', checked: false },
      { key: 'religion', name: '⛩ 宗教', checked: false },
      { key: 'ai', name: '✨ AI修复', checked: false },
      { key: 'folk', name: '🏯 古民居', checked: false },
      { key: 'custom', name: '🎭 民俗', checked: false },
      { key: 'food', name: '🍜 美食', checked: false }
    ]
  },

  onLoad: function () {
    try {
      var savedPrefs = wx.getStorageSync('preferences');
      if (savedPrefs && savedPrefs.length > 0) {
        var categories = this.data.categories.map(function (item) {
          item.checked = savedPrefs.indexOf(item.key) !== -1;
          return item;
        });
        this.setData({ categories: categories });
      }
    } catch (e) {
      console.error('读取喜好设置失败', e);
    }
  },

  onCategoryTap: function (e) {
    var key = e.currentTarget.dataset.key;
    var categories = this.data.categories.map(function (item) {
      if (item.key === key) {
        item.checked = !item.checked;
      }
      return item;
    });
    this.setData({ categories: categories });
  },

  onSave: function () {
    var checkedKeys = this.data.categories
      .filter(function (item) { return item.checked; })
      .map(function (item) { return item.key; });

    try {
      wx.setStorageSync('preferences', checkedKeys);
    } catch (e) {
      console.error('保存喜好设置到本地失败', e);
    }

    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          action: 'savePreferences',
          preferences: checkedKeys
        }
      }).catch(function (err) {
        console.error('保存喜好设置到云数据库失败', err);
      });
    }

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    setTimeout(function () {
      wx.navigateBack();
    }, 1500);
  }
});
