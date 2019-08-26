import './_style.scss'

export default {
  name: 'er-messages',
  data: () => ({
    pre: 'er-messages'
  }),
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    generateChildren () {
      return this.$createElement('transition-group', {
        staticClass: `${this.pre}__wrapper`,
        attrs: {
          name: 'message-transition',
          tag: 'div'
        }
      }, this.value.map(this.generateMessage))
    },
    generateMessage (message, key) {
      return this.$createElement('div', {
        staticClass: `${this.pre}__message`,
        key,
        domProps: {
          innerHTML: message
        }
      })
    }
  },
  render (h) {
    return h('div', {
      staticClass: `${this.pre}`
    }, [this.generateChildren()])
  }
}
