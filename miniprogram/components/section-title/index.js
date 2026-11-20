Component({
  properties: { title: { type: String, value: '' }, calligraphy: { type: Boolean, value: false }, more: { type: String, value: '' } },
  methods: { onMore() { this.triggerEvent('more'); } }
});
