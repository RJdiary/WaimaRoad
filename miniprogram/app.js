App({
  onLaunch: function () {
    this.globalData = {
      env: "cloud1-d2g877qzy64802271",
      userInfo: null,
      fontSize: 30,
      favorites: [],
      checkins: []
    };

    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true
      });
    }

    try {
      var userInfo = wx.getStorageSync("userInfo");
      if (userInfo) {
        this.globalData.userInfo = userInfo;
      }
    } catch (e) {
      console.error("读取用户信息失败", e);
    }

    try {
      var fontSize = wx.getStorageSync("fontSize");
      if (fontSize) {
        this.globalData.fontSize = fontSize;
      }
    } catch (e) {
      console.error("读取字体设置失败", e);
    }
  },

  getUserInfo: function () {
    return this.globalData.userInfo;
  },

  setUserInfo: function (userInfo) {
    this.globalData.userInfo = userInfo;
    try {
      wx.setStorageSync("userInfo", userInfo);
    } catch (e) {
      console.error("保存用户信息失败", e);
    }
  },

  getFontSize: function () {
    return this.globalData.fontSize;
  },

  setFontSize: function (fontSize) {
    this.globalData.fontSize = fontSize;
    try {
      wx.setStorageSync("fontSize", fontSize);
    } catch (e) {
      console.error("保存字体设置失败", e);
    }
  }
});
