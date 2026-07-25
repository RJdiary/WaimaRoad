const app = getApp();

const TEMPLATE_IDS = {
  newHeritage: '',
  streetActivity: '',
  achievement: 'eaZCg6Wr7GwYZB9yNI36edxfCaOhUq2r_Pxp6tK0a3s'
};

Page({
  data: {
    userInfo: null,
    notifyEnabled: false,
    locationEnabled: false,
    subscriptions: {
      newHeritage: false,
      streetActivity: false,
      achievement: false
    }
  },

  onLoad: function () {
    var userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo: userInfo });
    }

    try {
      var savedSubs = wx.getStorageSync('subscriptions');
      if (savedSubs) {
        this.setData({ subscriptions: savedSubs });
      }
    } catch (e) {
      console.error('读取订阅设置失败', e);
    }

    this.checkAuthSettings();
  },

  checkAuthSettings: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        that.setData({
          notifyEnabled: res.authSetting['scope.subscribeMessage'] || false,
          locationEnabled: res.authSetting['scope.userLocation'] || false
        });
      }
    });
  },

  onEditProfile: function () {
    wx.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    });
  },

  goAuthSetting: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type === 'notify' || type === 'location') {
      wx.openSetting({
        success: (res) => {
          this.checkAuthSettings();
        }
      });
    }
  },

  onSubscriptionChange: function (e) {
    var type = e.currentTarget.dataset.type;
    var checked = e.detail.value;
    var that = this;

    if (checked) {
      var templateId = TEMPLATE_IDS[type];
      if (!templateId) {
        var subscriptions = Object.assign({}, this.data.subscriptions);
        subscriptions[type] = true;
        this.setData({ subscriptions: subscriptions });
        try {
          wx.setStorageSync('subscriptions', subscriptions);
        } catch (err) {
          console.error('保存订阅设置失败', err);
        }
        wx.showToast({
          title: '订阅已开启',
          icon: 'none'
        });
        return;
      }

      wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success: function (res) {
          if (res[templateId] === 'accept') {
            var subscriptions = Object.assign({}, that.data.subscriptions);
            subscriptions[type] = true;
            that.setData({ subscriptions: subscriptions });
            try {
              wx.setStorageSync('subscriptions', subscriptions);
            } catch (err) {
              console.error('保存订阅设置失败', err);
            }
          } else {
            var subscriptions = Object.assign({}, that.data.subscriptions);
            subscriptions[type] = false;
            that.setData({ subscriptions: subscriptions });
            wx.showToast({
              title: '您拒绝了订阅',
              icon: 'none'
            });
          }
        },
        fail: function (err) {
          console.error('订阅消息失败', err);
          var subscriptions = Object.assign({}, that.data.subscriptions);
          subscriptions[type] = false;
          that.setData({ subscriptions: subscriptions });
        }
      });
    } else {
      var subscriptions = Object.assign({}, this.data.subscriptions);
      subscriptions[type] = false;
      this.setData({ subscriptions: subscriptions });
      try {
        wx.setStorageSync('subscriptions', subscriptions);
      } catch (err) {
        console.error('保存订阅设置失败', err);
      }
    }
  }
});
