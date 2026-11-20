Component({
  properties: { options: { type: Array, value: [] }, selected: { type: String, value: '' }, sticky: { type: Boolean, value: false } },
  methods: { onChipTap(event) { this.triggerEvent('change', { key: event.currentTarget.dataset.key }); } }
});
