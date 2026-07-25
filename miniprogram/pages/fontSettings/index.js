const app = getApp();

Page({
  data: {
    fontSizeOptions: [
      { key: 'small', size: 28, label: '小' },
      { key: 'medium', size: 34, label: '中' },
      { key: 'large', size: 40, label: '大' },
      { key: 'xlarge', size: 48, label: '特大' }
    ],
    currentSize: 'medium',
    currentFontSize: 34,
    autoSync: false
  },

  onLoad: function () {
    var savedSize = app.getFontSize();
    var sizeMap = { 28: 'small', 34: 'medium', 40: 'large', 48: 'xlarge' };
    var currentSize = sizeMap[savedSize] || 'medium';

    var autoSync = false;
    try {
      var savedAutoSync = wx.getStorageSync('autoSync');
      if (savedAutoSync !== '') {
        autoSync = savedAutoSync;
      }
    } catch (e) {
      console.error('读取自动同步设置失败', e);
    }

    this.setData({
      currentSize: currentSize,
      currentFontSize: savedSize,
      autoSync: autoSync
    });
  },

  selectSize: function (e) {
    var key = e.currentTarget.dataset.key;
    var option = this.data.fontSizeOptions.find(function (item) {
      return item.key === key;
    });

    if (option) {
      this.setData({
        currentSize: key,
        currentFontSize: option.size
      });
      app.setFontSize(option.size);
    }
  },

  onAutoSyncChange: function (e) {
    var value = e.detail.value;
    this.setData({
      autoSync: value
    });

    try {
      wx.setStorageSync('autoSync', value);
    } catch (err) {
      console.error('保存自动同步设置失败', err);
    }

    if (value) {
      wx.showToast({
        title: '已开启自动同步',
        icon: 'none'
      });
    }
  }
});
