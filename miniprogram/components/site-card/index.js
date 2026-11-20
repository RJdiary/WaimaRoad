const { formatCount } = require('../../utils/format');
Component({
  properties: { site: { type: Object, value: {} }, variant: { type: String, value: 'terracotta' }, showFavorite: { type: Boolean, value: false }, favorited: { type: Boolean, value: false } },
  data: { viewText: '0', favoriteText: '0' },
  observers: { site(site) { this.setData({ viewText: formatCount(site.viewCount), favoriteText: formatCount(site.favoriteCount) }); } },
  methods: {
    onSelect() { this.triggerEvent('select', { id: this.properties.site.id }); },
    onFavorite() { this.triggerEvent('favorite', { id: this.properties.site.id, favorited: !this.properties.favorited }); }
  }
});
