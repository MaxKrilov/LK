import './_style.scss'

export default {
  name: 'er-icon',
  data: () => ({
    pre: 'er-icon',
    icon: '',
    viewbox: ''
  }),
  props: {
    /**
     * Название иконки
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Ширина иконки
     */
    width: [String, Number],
    /**
     * Высота иконки
     */
    height: [String, Number]
  },
  watch: {
    name (val) {
      this.icon = require(`@/assets/icons/${val}.svg`)
    }
  },
  created () {
    this.icon = require(`@/assets/icons/${this.name}.svg`)
  },
  render (h) {
    return h('i', {
      staticClass: this.pre
    }, [
      h('svg', {
        attrs: {
          viewBox: this.icon.default.viewBox,
          width: this.width,
          height: this.height
        }
      }, [
        h('use', {
          attrs: {
            'xlink:href': this.icon.default.url,
            'xmlns:xlink': 'http://www.w3.org/1999/xlink'
          }
        })
      ])
    ])
  }
}
