const { heritages } = require('../../utils/data');
const db = require('../../utils/db');
const fallback = { id: 0, title: '外马路历史点位', categoryName: '史料', categoryEmoji: '📍', emoji: '📍', location: '汕头外马路', era: '待补充', summary: '该点位史料正在整理中。', detail: '项目将持续补充经过核验的文献、口述与实地调研资料。' };

Page({
  data: { heritage: fallback, isFavorited: false, isPlaying: false, actionTop: 88 },
  onLoad(options) {
    const heritage = heritages.find(item => item.id === Number(options.id)) || fallback;
    let actionTop = 88;
    try { actionTop = (wx.getMenuButtonBoundingClientRect().bottom || 68) + 20; } catch (e) {}
    this.setData({ heritage, actionTop });
    db.getHeritageById(options.id).then(function (cloudHeritage) {
      if (cloudHeritage) this.setData({ heritage: cloudHeritage });
    }.bind(this));
  },
  onBack() { wx.navigateBack(); },
  onToggleFavorite() { const isFavorited = !this.data.isFavorited; this.setData({ isFavorited }); wx.showToast({ title: isFavorited ? '已收藏' : '已取消收藏', icon: 'none' }); },
  onShare() { wx.showShareMenu({ withShareTicket: true }); },
  onTogglePlay() { this.setData({ isPlaying: !this.data.isPlaying }); wx.showToast({ title: '导览音频待接入', icon: 'none' }); },
  onShareAppMessage() { return { title: this.data.heritage.title, path: '/pages/heritageDetail/index?id=' + this.data.heritage.id }; }
});
