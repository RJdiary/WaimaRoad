Page({
  data: {
    sliderLeft: 50,
    containerWidth: 0,
    startX: 0,
    startLeft: 50
  },

  onLoad: function () {
    var that = this;
    wx.createSelectorQuery()
      .select('.compare-slider')
      .boundingClientRect(function (rect) {
        if (rect) {
          that.setData({
            containerWidth: rect.width
          });
        }
      })
      .exec();
  },

  onBack: function () {
    wx.navigateBack();
  },

  onSliderTouchStart: function (e) {
    var touch = e.touches[0];
    this.setData({
      startX: touch.clientX,
      startLeft: this.data.sliderLeft
    });
  },

  onSliderTouchMove: function (e) {
    var touch = e.touches[0];
    var deltaX = touch.clientX - this.data.startX;
    var containerWidth = this.data.containerWidth;

    if (containerWidth <= 0) {
      return;
    }

    var deltaPercent = (deltaX / containerWidth) * 100;
    var newLeft = this.data.startLeft + deltaPercent;

    if (newLeft < 0) {
      newLeft = 0;
    } else if (newLeft > 100) {
      newLeft = 100;
    }

    this.setData({
      sliderLeft: newLeft
    });
  },

  onSliderTouchEnd: function () {}
});
