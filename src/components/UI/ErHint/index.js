import './_style.scss'

export default {
  name: 'er-hint',
  data: () => ({
    pre: 'er-hint'
  }),
  methods: {
    generateActivator (on) {
      return this.$createElement('div', {
        staticClass: `${this.pre}__activator`,
        on,
        ref: 'activator'
      }, [
        this.$createElement('er-icon', { props: { name: 'question' } }),
        this.$slots['activator-text'] && this.$createElement('a', {}, [ this.$slots['activator-text'] ])
      ])
    },
    generateHint () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__message`
      }, [
        this.$createElement('div', {
          staticClass: `${this.pre}__message__content`
        }, [ this.$slots.default ])
      ])
    }
  },
  render (h) {
    return h('div', {
      staticClass: `${this.pre}`
    }, [
      h('er-menu', {
        props: {
          openOnHover: true,
          right: true,
          offsetX: true,
          nudgeRight: 52
        },
        scopedSlots: {
          activator: props => this.generateActivator(props.on)
        }
      }, [
        this.generateHint()
      ])
    ])
  }
}
