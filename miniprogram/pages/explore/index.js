Page({
  data: {
    currentTime: '',
    categories: [
      { id: 'building', name: '建筑', emoji: '🏛' },
      { id: 'red', name: '红色', emoji: '⭐' },
      { id: 'religion', name: '宗教', emoji: '⛩' }
    ],
    quickLinks: [
      { id: 'heritage-building', category: 'building', emoji: '🏛', title: '建筑遗存', desc: '探寻百年历史建筑之美' },
      { id: 'heritage-red', category: 'red', emoji: '⭐', title: '红色记忆', desc: '传承革命精神与红色文化' },
      { id: 'ai-compare', emoji: '🖼', title: 'AI修复影像', desc: '让历史影像重焕新生' },
      { id: 'street', emoji: '🧭', title: '主题走街', desc: '规划专属文化探索路线' }
    ]
  },

  onLoad: function () {
    this.setCurrentTime();
  },

  setCurrentTime: function () {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes().toString().padStart(2, '0');
    let period = '上午';
    let displayHour = hour;

    if (hour >= 0 && hour < 6) {
      period = '凌晨';
    } else if (hour >= 6 && hour < 12) {
      period = '上午';
    } else if (hour === 12) {
      period = '中午';
    } else if (hour > 12 && hour < 18) {
      period = '下午';
      displayHour = hour - 12;
    } else {
      period = '晚上';
      displayHour = hour - 12;
    }

    const timeStr = `今天${period}${displayHour}:${minute}`;
    this.setData({
      currentTime: timeStr
    });
  },

  goToHeritage: function (e) {
    const category = e.currentTarget.dataset.category;
    const app = getApp();
    app.globalData.selectedCategory = category;
    wx.switchTab({
      url: '/pages/heritage/index'
    });
  },

  goToStreet: function () {
    wx.switchTab({
      url: '/pages/street/index'
    });
  },

  goToAiCompare: function () {
    wx.navigateTo({
      url: '/pages/aiCompare/index'
    });
  }
});
