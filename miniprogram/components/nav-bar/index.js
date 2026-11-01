Component({
  properties: {
    title: { type: String, value: '' },
    transparent: { type: Boolean, value: false },
    showBack: { type: Boolean, value: true },
    fixed: { type: Boolean, value: true }
  },
  data: { statusBarHeight: 0, rightSpace: 0 },
  lifetimes: {
    attached() {
      const info = wx.getWindowInfo();
      let capsule = null;
      try { capsule = wx.getMenuButtonBoundingClientRect(); } catch (error) { capsule = null; }
      this.setData({
        statusBarHeight: info.statusBarHeight || 0,
        rightSpace: capsule ? info.windowWidth - capsule.left + 8 : 16
      });
    }
  },
  methods: { onBack() { this.triggerEvent('back'); } }
});
