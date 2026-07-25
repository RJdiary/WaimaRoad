const mockRoutes = [
  {
    id: 'red-memory',
    name: '红色记忆路线',
    theme: '红色文化',
    pointCount: 5,
    duration: 2.5,
    distance: 3.2
  },
  {
    id: 'architecture-art',
    name: '建筑艺术路线',
    theme: '建筑文化',
    pointCount: 6,
    duration: 3,
    distance: 4.1
  },
  {
    id: 'religion-culture',
    name: '宗教文化路线',
    theme: '宗教文化',
    pointCount: 4,
    duration: 2,
    distance: 2.5
  }
];

const mockPoints = {
  'red-memory': [
    {
      id: 1,
      name: '解放阁',
      lat: 36.6512,
      lng: 117.1201,
      status: 'visited',
      summary: '为纪念济南战役胜利而建，矗立在原济南城墙东南角，是山东省文物保护单位和爱国主义教育基地。阁高34.1米，采用中国古典建筑形式，黄琉璃瓦覆顶，飞檐翘角，气势宏伟。'
    },
    {
      id: 2,
      name: '济南战役纪念馆',
      lat: 36.6458,
      lng: 117.1186,
      status: 'visited',
      summary: '记录济南战役的光辉历程，馆内陈列大量历史文物和资料，是进行革命传统教育的重要场所。纪念馆建筑面积约6800平方米，通过实物、图片、雕塑等多种形式再现济南战役。'
    },
    {
      id: 3,
      name: '英雄山革命烈士陵园',
      lat: 36.6389,
      lng: 117.1156,
      status: 'current',
      summary: '英雄山革命烈士陵园位于济南市英雄山南麓，始建于1949年，是为纪念在济南战役中牺牲的革命烈士而建。陵园占地32万平方米，园内松柏常青，风景肃穆。'
    },
    {
      id: 4,
      name: '中共山东省委旧址',
      lat: 36.6552,
      lng: 117.1234,
      status: 'pending',
      summary: '中共山东省委旧址记录了山东党组织的早期革命活动，是重要的红色革命遗址，具有重要的历史价值和教育意义。'
    },
    {
      id: 5,
      name: '五三惨案纪念园',
      lat: 36.6601,
      lng: 117.1289,
      status: 'pending',
      summary: '五三惨案纪念园是为纪念1928年五三惨案中遇难的同胞而建，是进行爱国主义教育的重要场所，让后人铭记历史、勿忘国耻。'
    }
  ]
};

const defaultRoute = {
  id: 'red-memory',
  name: '红色记忆路线',
  theme: '红色文化',
  pointCount: 5,
  duration: 2.5,
  distance: 3.2
};

Page({
  data: {
    route: null,
    points: [],
    markers: [],
    progress: 0,
    visitedCount: 0,
    showPopup: false,
    currentPoint: null,
    latitude: 36.6512,
    longitude: 117.1201,
    scale: 14
  },

  onLoad: function (options) {
    const routeId = options.routeId || 'red-memory';
    let route = defaultRoute;
    let points = mockPoints['red-memory'] || [];

    for (let i = 0; i < mockRoutes.length; i++) {
      if (mockRoutes[i].id === routeId) {
        route = mockRoutes[i];
        break;
      }
    }

    if (mockPoints[routeId]) {
      points = mockPoints[routeId];
    }

    const visitedCount = points.filter(function (p) { return p.status === 'visited'; }).length;
    const progress = points.length > 0 ? Math.round((visitedCount / points.length) * 100) : 0;

    const markers = this.generateMarkers(points);

    this.setData({
      route: route,
      points: points,
      markers: markers,
      progress: progress,
      visitedCount: visitedCount
    });
  },

  generateMarkers: function (points) {
    const markers = [];
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      let color = '#8B7968';
      if (point.status === 'visited') {
        color = '#4A6741';
      } else if (point.status === 'current') {
        color = '#8B2635';
      }

      markers.push({
        id: point.id,
        latitude: point.lat,
        longitude: point.lng,
        width: 36,
        height: 36,
        callout: {
          content: point.name,
          color: '#2D2418',
          fontSize: 12,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 6,
          display: 'ALWAYS'
        }
      });
    }
    return markers;
  },

  onBack: function () {
    wx.navigateBack();
  },

  onMarkerTap: function (e) {
    const markerId = e.detail.markerId;
    const points = this.data.points;
    let point = null;

    for (let i = 0; i < points.length; i++) {
      if (points[i].id === markerId) {
        point = points[i];
        break;
      }
    }

    if (point) {
      this.openPopup(point);
    }
  },

  onPointTap: function (e) {
    const pointId = e.currentTarget.dataset.pointId;
    const points = this.data.points;
    let point = null;

    for (let i = 0; i < points.length; i++) {
      if (points[i].id === pointId) {
        point = points[i];
        break;
      }
    }

    if (point) {
      this.openPopup(point);
    }
  },

  openPopup: function (point) {
    this.setData({
      currentPoint: point,
      showPopup: true
    });
  },

  closePopup: function () {
    this.setData({
      showPopup: false
    });
  },

  checkin: function () {
    const currentPoint = this.data.currentPoint;
    if (!currentPoint || currentPoint.status === 'visited') {
      return;
    }

    const points = this.data.points;
    const updatedPoints = [];
    let foundNextCurrent = false;

    for (let i = 0; i < points.length; i++) {
      let p = JSON.parse(JSON.stringify(points[i]));
      if (p.id === currentPoint.id) {
        p.status = 'visited';
      } else if (!foundNextCurrent && p.status === 'pending') {
        p.status = 'current';
        foundNextCurrent = true;
      }
      updatedPoints.push(p);
    }

    const visitedCount = updatedPoints.filter(function (p) { return p.status === 'visited'; }).length;
    const progress = updatedPoints.length > 0 ? Math.round((visitedCount / updatedPoints.length) * 100) : 0;
    const markers = this.generateMarkers(updatedPoints);

    const updatedCurrentPoint = JSON.parse(JSON.stringify(currentPoint));
    updatedCurrentPoint.status = 'visited';

    this.setData({
      points: updatedPoints,
      markers: markers,
      progress: progress,
      visitedCount: visitedCount,
      currentPoint: updatedCurrentPoint
    });

    wx.showToast({
      title: '打卡成功！',
      icon: 'success',
      duration: 2000
    });
  },

  goToHeritage: function () {
    const currentPoint = this.data.currentPoint;
    if (currentPoint) {
      wx.navigateTo({
        url: '/pages/heritageDetail/index?id=' + currentPoint.id
      });
    }
  },

  goToExplore: function () {
    wx.switchTab({
      url: '/pages/explore/index'
    });
  },

  onPlayVideo: function () {
    wx.showToast({
      title: 'AI视频功能开发中',
      icon: 'none',
      duration: 1500
    });
  },

  onPlayAudio: function () {
    wx.showToast({
      title: '语音讲解功能开发中',
      icon: 'none',
      duration: 1500
    });
  }
});
