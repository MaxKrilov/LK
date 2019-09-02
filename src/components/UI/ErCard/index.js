import './_style.scss'

export default {
  name: 'er-card',
  render (h) {
    return h('div', {
      staticClass: 'er-card'
    }, [
      h('div', {
        staticClass: 'er-card__content'
      }, [
        this.$slots.default
      ])
    ])
  }
}
