export default {
  name: 'PreferHint',
  data: () => ({
    pre: 'prefer-hint',
    text: 'Предпочтительный канал связи'
  }),
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    targetEl: {
      default: null
    }
  },
  computed: {
    hintPos () {
      if (!this.isOpen) {
        return { x: 0, y: 0 }
      }
      const rect = this.targetEl.getBoundingClientRect()
      return {
        x: rect.x + rect.width,
        y: rect.y + rect.height / 2
      }
    }
  }
}
