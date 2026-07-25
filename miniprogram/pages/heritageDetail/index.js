const mockData = [
  {
    id: 1,
    title: '济南老火车站',
    category: 'building',
    categoryName: '建筑',
    categoryEmoji: '🏛',
    emoji: '🏛',
    imgStyle: 'background:linear-gradient(135deg,#C4A882,#8B6508)',
    location: '天桥区',
    era: '1904年',
    summary: '曾是亚洲最大的火车站，由德国建筑师赫尔曼·菲舍尔设计，典型的德国青年风格派建筑，被誉为"亚洲最漂亮的火车站"之一。',
    detail: '济南老火车站由德国建筑师赫尔曼·菲舍尔设计，始建于1904年，1912年建成投入使用。这座建筑是典型的德国青年风格派（Jugendstil）作品，被誉为"亚洲最漂亮的火车站"之一。\n\n车站主体为圆柱形钟楼，顶部为绿色穹顶，塔钟镶嵌在四面墙体上，方圆百里清晰可见。主楼为方形，红瓦坡顶，门窗采用细长的拱形设计，整体建筑风格典雅庄重，具有极高的艺术价值。',
    views: '2.3k',
    favorites: 186,
    isAiRestored: false
  },
  {
    id: 2,
    title: '1930年代泉城路街景',
    category: 'ai',
    categoryName: 'AI修复',
    categoryEmoji: '✨',
    emoji: '✨',
    imgStyle: '',
    location: '历下区',
    era: '1930年代',
    summary: 'AI技术还原民国时期泉城路繁华景象，旧时商铺林立，行人如织，重现老济南的市井风情与历史韵味。',
    detail: '这张照片拍摄于1932年，记录了当时济南最繁华的商业街——泉城路的日常景象。照片中可以看到沿街林立的各式商铺、穿梭的黄包车、身着民国服饰的行人，生动再现了那个年代的市井风情。\n\n通过AI超分辨率修复技术，我们成功还原了照片中模糊的细节，包括店铺招牌上的文字、行人的面部表情、建筑的精美装饰等，让这段珍贵的历史记忆得以清晰重现。',
    views: '5.8k',
    favorites: 423,
    isAiRestored: true
  },
  {
    id: 3,
    title: '解放阁',
    category: 'red',
    categoryName: '红色',
    categoryEmoji: '⭐',
    emoji: '⭐',
    imgStyle: 'background:linear-gradient(135deg,#8B2635,#6B1E29)',
    location: '历下区',
    era: '1948年',
    summary: '为纪念济南战役胜利而建，矗立在原济南城墙东南角，是山东省文物保护单位和爱国主义教育基地。',
    detail: '解放阁位于山东省济南市历下区下黑虎泉西路，矗立在原济南城墙东南角之上，是为纪念1948年9月24日中国人民解放军攻克济南而建。\n\n阁高34.1米，占地1637.2平方米，建筑面积617.2平方米，为二层楼阁式建筑，采用中国古典建筑形式，黄琉璃瓦覆顶，飞檐翘角，气势宏伟。阁内陈列有济南战役相关的史料和文物，是山东省文物保护单位和重要的爱国主义教育基地。',
    views: '3.1k',
    favorites: 256,
    isAiRestored: false
  },
  {
    id: 4,
    title: '洪家楼天主教堂',
    category: 'religion',
    categoryName: '宗教',
    categoryEmoji: '⛪',
    emoji: '⛪',
    imgStyle: 'background:linear-gradient(135deg,#4A6741,#3A5233)',
    location: '历城区',
    era: '1901年',
    summary: '济南著名的天主教堂，始建于1901年，为哥特式建筑风格，是华北地区最大的天主教堂之一。',
    detail: '洪家楼天主教堂，全称洪家楼耶稣圣心主教座堂，位于山东省济南市历城区洪家楼镇，是济南教区的主教座堂，也是华北地区最大的天主教堂之一。\n\n教堂始建于1901年，由奥地利传教士设计，1905年建成。建筑为典型的哥特式风格，双塔尖顶，平面呈十字形，长60余米，宽30余米，高约28米，双塔高约45米。教堂采用当地石材砌筑，做工精细，雕刻精美，是中国近代西方宗教建筑的重要代表之一。',
    views: '1.9k',
    favorites: 142,
    isAiRestored: false
  },
  {
    id: 5,
    title: '趵突泉老照片',
    category: 'ai',
    categoryName: 'AI修复',
    categoryEmoji: '💧',
    emoji: '💧',
    imgStyle: '',
    location: '历下区',
    era: '清末民初',
    summary: 'AI修复的清末民初趵突泉影像，三股水喷涌如初，周围亭台楼阁古色古香，再现泉城胜景的历史风貌。',
    detail: '趵突泉，古称"泺水"，是济南七十二名泉之首，被誉为"天下第一泉"。这张拍摄于清末民初的老照片，记录了趵突泉当时的原始风貌。\n\n照片中，三股泉水从地下涌出，水涌若轮，声如隐雷。周围的观澜亭、泺源堂等古建筑错落有致，古色古香。通过AI修复技术，我们得以重新清晰地看到百年前趵突泉的壮丽景象和历史风貌。',
    views: '4.2k',
    favorites: 318,
    isAiRestored: true
  },
  {
    id: 6,
    title: '齐鲁大学旧址',
    category: 'building',
    categoryName: '建筑',
    categoryEmoji: '🏯',
    emoji: '🏯',
    imgStyle: 'background:linear-gradient(135deg,#B8956B,#8B6508)',
    location: '历下区',
    era: '1864年',
    summary: '中国最早的教会大学之一，现存建筑多为中西合璧风格，办公楼、考文楼等具有重要的历史和建筑价值。',
    detail: '齐鲁大学是中国最早的教会大学之一，其前身可追溯至1864年美国北长老会在山东登州创办的文会馆。1904年迁至济南，1917年正式定名为齐鲁大学。\n\n齐鲁大学旧址现存建筑多为20世纪初建造，采用中西合璧的建筑风格，主要建筑包括办公楼（柏根楼）、考文楼（教学楼）、图书馆、水塔等。这些建筑既具有西方建筑的结构特点，又融入了中国传统建筑的装饰元素，是近代中西文化交流的重要实物见证。',
    views: '1.5k',
    favorites: 98,
    isAiRestored: false
  },
  {
    id: 7,
    title: '济南战役纪念馆',
    category: 'red',
    categoryName: '红色',
    categoryEmoji: '🏛️',
    emoji: '🏛️',
    imgStyle: 'background:linear-gradient(135deg,#8B2635,#6B1E29)',
    location: '市中区',
    era: '1998年',
    summary: '记录济南战役的光辉历程，馆内陈列大量历史文物和资料，是进行革命传统教育的重要场所。',
    detail: '济南战役纪念馆位于山东省济南市市中区英雄山路，坐落在英雄山风景区内，是为纪念济南战役胜利50周年于1998年建成开放的。\n\n纪念馆建筑面积约6800平方米，陈列展示面积约3000平方米，馆内陈列有大量济南战役相关的历史文物、照片、文献资料等，通过实物、图片、雕塑、场景复原等多种形式，全面生动地再现了济南战役的光辉历程，是进行革命传统教育和爱国主义教育的重要场所。',
    views: '2.7k',
    favorites: 201,
    isAiRestored: false
  },
  {
    id: 8,
    title: '千佛山兴国禅寺',
    category: 'religion',
    categoryName: '宗教',
    categoryEmoji: '⛩',
    emoji: '⛩',
    imgStyle: 'background:linear-gradient(135deg,#4A6741,#3A5233)',
    location: '历下区',
    era: '唐代',
    summary: '始建于唐代的佛教禅宗寺院，坐落于千佛山山腰，寺内古木参天，碑刻林立，是济南著名的宗教圣地。',
    detail: '兴国禅寺，位于山东省济南市历下区千佛山山腰，是济南地区最著名的佛教寺院之一，也是汉族地区佛教全国重点寺院。\n\n寺院始建于唐贞观年间（627-649年），原名"千佛寺"，宋代改称"兴国禅寺"。寺院依山而建，布局严谨，主要建筑有山门、天王殿、大雄宝殿、观音殿、藏经楼等。寺内古木参天，碑刻林立，保存有大量历代文物。登寺远眺，泉城美景尽收眼底，是济南著名的旅游胜地和宗教圣地。',
    views: '1.8k',
    favorites: 167,
    isAiRestored: false
  },
  {
    id: 9,
    title: '大明湖历史影像',
    category: 'ai',
    categoryName: 'AI修复',
    categoryEmoji: '🌊',
    emoji: '🌊',
    imgStyle: '',
    location: '历下区',
    era: '上世纪初',
    summary: 'AI修复的上世纪初大明湖风光，湖面碧波荡漾，荷花映日，湖边古迹错落有致，尽显"泉城明珠"的历史风韵。',
    detail: '大明湖，位于山东省济南市历下区，是济南三大名胜之一，被誉为"泉城明珠"。这张拍摄于上世纪初的老照片，记录了大明湖当时的自然风光和人文景观。\n\n照片中，湖面碧波荡漾，荷花映日，湖边的历下亭、铁公祠、汇波楼等古建筑错落有致。通过AI修复技术，我们得以重新清晰地看到百年前大明湖的秀美风光和历史风韵，感受到"四面荷花三面柳，一城山色半城湖"的诗画意境。',
    views: '3.6k',
    favorites: 289,
    isAiRestored: true
  },
  {
    id: 10,
    title: '珍珠泉大院',
    category: 'building',
    categoryName: '建筑',
    categoryEmoji: '🏰',
    emoji: '🏰',
    imgStyle: 'background:linear-gradient(135deg,#C4A882,#8B6508)',
    location: '历下区',
    era: '明代',
    summary: '明清时期山东巡抚衙门所在地，院内珍珠泉为济南七十二名泉之一，古建筑群保存完好，具有重要历史价值。',
    detail: '珍珠泉大院，位于山东省济南市历下区泉城路以北，是明清时期山东巡抚衙门所在地，现为山东省人大常委会机关驻地。\n\n大院始建于明成化二年（1466年），为德王府所在地。清康熙五年（1666年）改为山东巡抚衙门。院内珍珠泉为济南七十二名泉之一，泉水清澈见底，水泡从泉底串串上升，如同珍珠，故名珍珠泉。大院古建筑群保存完好，主要建筑有巡抚大堂、二堂、三堂等，是研究明清官署建筑的重要实物资料。',
    views: '1.2k',
    favorites: 87,
    isAiRestored: false
  }
];

const defaultHeritage = {
  id: 0,
  title: '史料详情',
  category: 'building',
  categoryName: '建筑',
  categoryEmoji: '🏛',
  emoji: '🏛',
  imgStyle: 'background:linear-gradient(135deg,#8B6508,#B8860B)',
  location: '未知',
  era: '未知',
  summary: '暂无详细介绍。',
  detail: '暂无详细介绍。',
  views: '0',
  favorites: 0,
  isAiRestored: false
};

Page({
  data: {
    heritage: null,
    isFavorited: false,
    isPlaying: false,
    navBarTop: 88,
    actionTop: 88
  },

  onLoad: function (options) {
    var id = parseInt(options.id);
    var heritage = defaultHeritage;

    for (var i = 0; i < mockData.length; i++) {
      if (mockData[i].id === id) {
        heritage = mockData[i];
        break;
      }
    }

    try {
      var sysInfo = wx.getSystemInfoSync();
      var menuBtn = wx.getMenuButtonBoundingClientRect();
      var statusBarHeight = sysInfo.statusBarHeight || 20;
      var navBarTop = statusBarHeight + 10;
      var actionTop = menuBtn.bottom + 20;

      this.setData({
        heritage: heritage,
        navBarTop: navBarTop,
        actionTop: actionTop
      });
    } catch (e) {
      this.setData({
        heritage: heritage
      });
    }
  },

  onBack: function () {
    wx.navigateBack();
  },

  onToggleFavorite: function () {
    const isFavorited = !this.data.isFavorited;
    this.setData({
      isFavorited: isFavorited
    });
    wx.showToast({
      title: isFavorited ? '已收藏' : '已取消收藏',
      icon: 'none',
      duration: 1500
    });
  },

  onShare: function () {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none',
      duration: 1500
    });
  },

  onTogglePlay: function () {
    const isPlaying = !this.data.isPlaying;
    this.setData({
      isPlaying: isPlaying
    });
    wx.showToast({
      title: isPlaying ? '开始播放' : '已暂停',
      icon: 'none',
      duration: 1500
    });
  },

  onShareAppMessage: function () {
    const heritage = this.data.heritage || defaultHeritage;
    return {
      title: heritage.title,
      path: '/pages/heritageDetail/index?id=' + heritage.id
    };
  }
});
