Page({
  data: {
    list: [],
    isEmpty: true,
    mockData: [
      {
        id: 1,
        pointId: 1,
        pointName: '解放阁',
        category: 'red',
        categoryName: '红色',
        emoji: '⭐',
        imgStyle: 'background:linear-gradient(135deg,#8B2635,#6B1E29)',
        summary: '为纪念济南战役胜利而建，矗立在原济南城墙东南角，是山东省文物保护单位和爱国主义教育基地。',
        location: '历下区黑虎泉西路',
        checkinTime: '2026-07-18 14:30',
        isAiRestored: false
      },
      {
        id: 2,
        pointId: 3,
        pointName: '洪家楼天主教堂',
        category: 'religion',
        categoryName: '宗教',
        emoji: '⛪',
        imgStyle: 'background:linear-gradient(135deg,#4A6741,#3A5233)',
        summary: '济南著名的天主教堂，始建于1901年，为哥特式建筑风格，是华北地区最大的天主教堂之一。',
        location: '历城区洪家楼路',
        checkinTime: '2026-07-16 10:15',
        isAiRestored: false
      },
      {
        id: 3,
        pointId: 2,
        pointName: '济南老火车站',
        category: 'building',
        categoryName: '建筑',
        emoji: '🏛',
        imgStyle: 'background:linear-gradient(135deg,#C4A882,#8B6508)',
        summary: '曾是亚洲最大的火车站，由德国建筑师赫尔曼·菲舍尔设计，典型的德国青年风格派建筑。',
        location: '天桥区车站街',
        checkinTime: '2026-07-14 16:45',
        isAiRestored: false
      }
    ]
  },

  onShow: function () {
    this.loadCheckins();
  },

  loadCheckins: function () {
    var that = this;
    var mockData = this.data.mockData;

    if (wx.cloud) {
      try {
        const db = wx.cloud.database();
        db.collection('checkins').get({
          success: function (res) {
            if (res.data && res.data.length > 0) {
              that.setData({
                list: res.data,
                isEmpty: false
              });
            } else {
              that.setData({
                list: mockData,
                isEmpty: mockData.length === 0
              });
            }
          },
          fail: function () {
            that.setData({
              list: mockData,
              isEmpty: mockData.length === 0
            });
          }
        });
      } catch (e) {
        that.setData({
          list: mockData,
          isEmpty: mockData.length === 0
        });
      }
    } else {
      that.setData({
        list: mockData,
        isEmpty: mockData.length === 0
      });
    }
  },

  goToDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    const category = e.currentTarget.dataset.category;

    if (category === 'ai') {
      wx.navigateTo({
        url: '/pages/aiCompare/index?id=' + id
      });
    } else {
      wx.navigateTo({
        url: '/pages/heritageDetail/index?id=' + id
      });
    }
  },

  goStreet: function () {
    wx.switchTab({
      url: '/pages/street/index'
    });
  },

  onPullDownRefresh: function () {
    var that = this;
    setTimeout(function () {
      that.loadCheckins();
      wx.stopPullDownRefresh();
    }, 800);
  }
});
