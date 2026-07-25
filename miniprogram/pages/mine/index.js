const app = getApp();

Page({
  data: {
    userInfo: null,
    tempAvatarUrl: '',
    tempNickname: '',
    stats: {
      checkins: 12,
      favorites: 8,
      routes: 3
    }
  },

  onShow: function () {
    var userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo: userInfo });
    }
  },

  onChooseAvatar: function (e) {
    var avatarUrl = e.detail.avatarUrl;
    this.setData({ tempAvatarUrl: avatarUrl });
    this.tryAutoLogin();
  },

  onNicknameInput: function (e) {
    this.setData({ tempNickname: e.detail.value });
  },

  onNicknameBlur: function (e) {
    if (e.detail.value) {
      this.setData({ tempNickname: e.detail.value });
    }
    this.tryAutoLogin();
  },

  tryAutoLogin: function () {
    var avatar = this.data.tempAvatarUrl;
    var nickname = this.data.tempNickname;
    if (avatar && nickname && nickname.trim()) {
      var userInfo = {
        avatarUrl: avatar,
        nickName: nickname.trim()
      };
      app.setUserInfo(userInfo);
      this.setData({
        userInfo: userInfo,
        tempAvatarUrl: '',
        tempNickname: ''
      });
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
    }
  },

  onLogout: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          app.setUserInfo(null);
          wx.removeStorageSync('userInfo');
          that.setData({ userInfo: null });
          wx.showToast({
            title: '已退出登录',
            icon: 'none'
          });
        }
      }
    });
  },

  goToMyCheckins: function () {
    wx.navigateTo({
      url: '/pages/myCheckins/index'
    });
  },

  goToMyFavorites: function () {
    wx.navigateTo({
      url: '/pages/myFavorites/index'
    });
  },

  goToPreferenceSettings: function () {
    wx.navigateTo({
      url: '/pages/preferenceSettings/index'
    });
  },

  goToFontSettings: function () {
    wx.navigateTo({
      url: '/pages/fontSettings/index'
    });
  },

  goToPrivacySettings: function () {
    wx.navigateTo({
      url: '/pages/privacySettings/index'
    });
  }
});
