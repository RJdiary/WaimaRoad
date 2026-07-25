Page({
  data: {
    categories: [
      { key: 'all', name: '全部' },
      { key: 'building', name: '🏛 建筑' },
      { key: 'red', name: '⭐ 红色' },
      { key: 'religion', name: '⛩ 宗教' },
      { key: 'ai', name: '✨ AI修复' }
    ],
    activeCategory: 'all',
    list: [],
    mockData: [
      {
        id: 1,
        title: '济南老火车站',
        category: 'building',
        categoryName: '建筑',
        emoji: '🏛',
        imgStyle: 'background:linear-gradient(135deg,#C4A882,#8B6508)',
        summary: '曾是亚洲最大的火车站，由德国建筑师赫尔曼·菲舍尔设计，典型的德国青年风格派建筑，被誉为"亚洲最漂亮的火车站"之一。',
        views: '2.3k',
        favorites: 186,
        isAiRestored: false
      },
      {
        id: 2,
        title: '1930年代泉城路街景',
        category: 'ai',
        categoryName: 'AI修复',
        emoji: '✨',
        imgStyle: '',
        summary: 'AI技术还原民国时期泉城路繁华景象，旧时商铺林立，行人如织，重现老济南的市井风情与历史韵味。',
        views: '5.8k',
        favorites: 423,
        isAiRestored: true
      },
      {
        id: 3,
        title: '解放阁',
        category: 'red',
        categoryName: '红色',
        emoji: '⭐',
        imgStyle: 'background:linear-gradient(135deg,#8B2635,#6B1E29)',
        summary: '为纪念济南战役胜利而建，矗立在原济南城墙东南角，是山东省文物保护单位和爱国主义教育基地。',
        views: '3.1k',
        favorites: 256,
        isAiRestored: false
      },
      {
        id: 4,
        title: '洪家楼天主教堂',
        category: 'religion',
        categoryName: '宗教',
        emoji: '⛪',
        imgStyle: 'background:linear-gradient(135deg,#4A6741,#3A5233)',
        summary: '济南著名的天主教堂，始建于1901年，为哥特式建筑风格，是华北地区最大的天主教堂之一。',
        views: '1.9k',
        favorites: 142,
        isAiRestored: false
      },
      {
        id: 5,
        title: '趵突泉老照片',
        category: 'ai',
        categoryName: 'AI修复',
        emoji: '💧',
        imgStyle: '',
        summary: 'AI修复的清末民初趵突泉影像，三股水喷涌如初，周围亭台楼阁古色古香，再现泉城胜景的历史风貌。',
        views: '4.2k',
        favorites: 318,
        isAiRestored: true
      },
      {
        id: 6,
        title: '齐鲁大学旧址',
        category: 'building',
        categoryName: '建筑',
        emoji: '🏯',
        imgStyle: 'background:linear-gradient(135deg,#B8956B,#8B6508)',
        summary: '中国最早的教会大学之一，现存建筑多为中西合璧风格，办公楼、考文楼等具有重要的历史和建筑价值。',
        views: '1.5k',
        favorites: 98,
        isAiRestored: false
      },
      {
        id: 7,
        title: '济南战役纪念馆',
        category: 'red',
        categoryName: '红色',
        emoji: '🏛️',
        imgStyle: 'background:linear-gradient(135deg,#8B2635,#6B1E29)',
        summary: '记录济南战役的光辉历程，馆内陈列大量历史文物和资料，是进行革命传统教育的重要场所。',
        views: '2.7k',
        favorites: 201,
        isAiRestored: false
      },
      {
        id: 8,
        title: '千佛山兴国禅寺',
        category: 'religion',
        categoryName: '宗教',
        emoji: '⛩',
        imgStyle: 'background:linear-gradient(135deg,#4A6741,#3A5233)',
        summary: '始建于唐代的佛教禅宗寺院，坐落于千佛山山腰，寺内古木参天，碑刻林立，是济南著名的宗教圣地。',
        views: '1.8k',
        favorites: 167,
        isAiRestored: false
      },
      {
        id: 9,
        title: '大明湖历史影像',
        category: 'ai',
        categoryName: 'AI修复',
        emoji: '🌊',
        imgStyle: '',
        summary: 'AI修复的上世纪初大明湖风光，湖面碧波荡漾，荷花映日，湖边古迹错落有致，尽显"泉城明珠"的历史风韵。',
        views: '3.6k',
        favorites: 289,
        isAiRestored: true
      },
      {
        id: 10,
        title: '珍珠泉大院',
        category: 'building',
        categoryName: '建筑',
        emoji: '🏰',
        imgStyle: 'background:linear-gradient(135deg,#C4A882,#8B6508)',
        summary: '明清时期山东巡抚衙门所在地，院内珍珠泉为济南七十二名泉之一，古建筑群保存完好，具有重要历史价值。',
        views: '1.2k',
        favorites: 87,
        isAiRestored: false
      }
    ]
  },

  onLoad: function () {
    const app = getApp();
    let activeCategory = 'all';

    if (app.globalData.selectedCategory) {
      activeCategory = app.globalData.selectedCategory;
      app.globalData.selectedCategory = null;
    }

    this.setData({
      activeCategory: activeCategory
    });

    this.filterList(activeCategory);
  },

  filterList: function (category) {
    const { mockData } = this.data;
    let list = mockData;

    if (category !== 'all') {
      list = mockData.filter(function (item) {
        return item.category === category;
      });
    }

    this.setData({
      list: list
    });
  },

  onCategoryTap: function (e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      activeCategory: key
    });
    this.filterList(key);
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

  onPullDownRefresh: function () {
    var that = this;
    setTimeout(function () {
      that.filterList(that.data.activeCategory);
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
