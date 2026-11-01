const KEYS = {
  TOKEN: 'byxz_token',
  USER: 'byxz_user',
  REDIRECT: 'byxz_redirect',
  FONT_SCALE: 'byxz_font_scale',
  FONT_FOLLOW_SYSTEM: 'byxz_font_follow_system',
  PREFERENCES: 'byxz_preferences',
  PRIVACY: 'byxz_privacy',
  SEARCH_HISTORY: 'byxz_search_history',
  FAVORITES: 'byxz_favorites',
  CHECKINS: 'byxz_checkins',
  VIEW_LOG: 'byxz_view_log',
  WALK_PROGRESS: 'byxz_walk_progress',
  SUBSCRIBE: 'byxz_subscribe',
  LOCATION_TIP: 'byxz_locationTip'
};

function get(key, defaultValue) {
  try {
    const value = wx.getStorageSync(key);
    return value === '' || value === undefined ? defaultValue : value;
  } catch (error) {
    console.warn('storage get failed', key, error);
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (error) {
    console.warn('storage set failed', key, error);
    return false;
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (error) {
    console.warn('storage remove failed', key, error);
    return false;
  }
}

module.exports = { KEYS, get, set, remove };
