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
    return nextScale;
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
