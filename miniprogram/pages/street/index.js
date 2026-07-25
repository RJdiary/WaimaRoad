Page({
  data: {
    routes: [
      {
        id: 'red-memory',
        name: '🔥 红色记忆路线',
        theme: '红色文化',
        themeColor: 'red',
        pointCount: 5,
        duration: 2.5,
        distance: 3.2,
        points: [1, 2, 3, 4, 5],
        startBtnText: '开始走街'
      },
      {
        id: 'architecture-art',
        name: '🏛 建筑艺术路线',
        theme: '建筑文化',
        themeColor: 'gold',
        pointCount: 6,
        duration: 3,
        distance: 4.1,
        points: [1, 2, 3, 4, 5, 6],
        startBtnText: '开始走街'
      },
      {
        id: 'religion-culture',
        name: '⛩ 宗教文化路线',
        theme: '宗教文化',
        themeColor: 'green',
        pointCount: 4,
        duration: 2,
        distance: 2.5,
        points: [1, 2, 3, 4],
        startBtnText: '开始走街'
      }
    ]
  },

  goToStreetMap: function (e) {
    const routeId = e.currentTarget.dataset.routeId;
    wx.navigateTo({
      url: '/pages/streetMap/index?routeId=' + routeId
    });
  },

  onPullDownRefresh: function () {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
