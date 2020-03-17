import './_style.scss'

export default {
  name: 'er-card',
  props: {
    /**
     * Делает карточку неактивной
     */
    disabled: Boolean
  },
  render (h) {
    return h('div', {
      staticClass: 'er-card'
    }, [
      h('div', {
        class: [
          'er-card__content',
          {
            disabled: this.disabled
          }
        ]
      }, [
        this.$slots.default
      ])
    ])
  }
}
