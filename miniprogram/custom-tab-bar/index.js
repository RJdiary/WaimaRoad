Component({
  data: {
    selected: 0,
    list: [
      { path: '/pages/explore/index', text: '探索', name: 'explore' },
      { path: '/pages/archive/index', text: '史料', name: 'archive' },
      { path: '/pages/walk/index', text: '走街', name: 'walk' },
      { path: '/pages/profile/index', text: '我的', name: 'profile' }
    ]
  },
  methods: {
    onTap(e) {
      const { index, path } = e.currentTarget.dataset;
      this.setData({ selected: index });
      wx.switchTab({ url: path });
    }
  }
});
