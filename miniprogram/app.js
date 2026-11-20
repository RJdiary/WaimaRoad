const storage = require('./utils/storage');

App({
  globalData: {
    token: '', isLogin: false, userInfo: null, fontScale: 1, preferences: null,
    statusBarHeight: 0, navBarHeight: 0, navTotalHeight: 0, safeAreaBottom: 0, windowWidth: 375, capsule: null
  },
  onLaunch() {
    this.initWindowMetrics();
    this.restoreAuth();
    this.restoreFontScale();
    this.restorePreferences();
    this.checkSdkVersion();
  },
  initWindowMetrics() {
    const info = wx.getWindowInfo();
    const windowWidth = info.windowWidth || 375;
    const statusBarHeight = info.statusBarHeight || 20;
    const navBarHeight = Math.round(88 / 750 * windowWidth);
    let capsule = null;
    try {
      capsule = wx.getMenuButtonBoundingClientRect();
    } catch (error) {
      capsule = null;
    }
    Object.assign(this.globalData, {
      statusBarHeight,
      navBarHeight,
      navTotalHeight: statusBarHeight + navBarHeight,
      safeAreaBottom: info.safeArea ? Math.max(0, info.screenHeight - info.safeArea.bottom) : 0,
      windowWidth,
      capsule
    });
  },
  restoreAuth() {
    const token = storage.get(storage.KEYS.TOKEN, '');
    const userInfo = storage.get(storage.KEYS.USER, null);
    Object.assign(this.globalData, { token, userInfo, isLogin: Boolean(token) });
  },
  restoreFontScale() {
    const scale = Number(storage.get(storage.KEYS.FONT_SCALE, 1));
    this.globalData.fontScale = Number.isFinite(scale) && scale >= 0.9 && scale <= 1.3 ? scale : 1;
  },
  restorePreferences() {
    this.globalData.preferences = storage.get(storage.KEYS.PREFERENCES, null);
  },
  setFontScale(scale) {
    const value = Math.min(1.3, Math.max(0.9, Number(scale) || 1));
    const stepped = Math.round(value / 0.05) * 0.05;
    const nextScale = Number(stepped.toFixed(2));
    this.globalData.fontScale = nextScale;
    storage.set(storage.KEYS.FONT_SCALE, nextScale);
    this.applyFontScale();
    return nextScale;
  },
  applyFontScale() {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    if (current && current.setData) current.setData({ fontScale: this.globalData.fontScale, pageStyle: this.getPageStyle() });
  },
  checkSdkVersion() {
    const version = (wx.getAppBaseInfo && wx.getAppBaseInfo().SDKVersion) || '0.0.0';
    const compare = (a, b) => { const left = a.split('.').map(Number); const right = b.split('.').map(Number); for (let i = 0; i < 3; i += 1) { if ((left[i] || 0) !== (right[i] || 0)) return (left[i] || 0) - (right[i] || 0); } return 0; };
    if (compare(version, '3.0.0') < 0) wx.showModal({ title: '建议升级微信', content: '当前微信版本较低，部分功能可能无法正常使用。', showCancel: false });
  },
  getPageStyle() {
    return '--fs:' + this.globalData.fontScale + ';';
  },
  logout() {
    storage.remove(storage.KEYS.TOKEN);
    storage.remove(storage.KEYS.USER);
    Object.assign(this.globalData, { token: '', userInfo: null, isLogin: false });
  }
});
