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
    height: [String, Number],
    /**
     * Тень
     * Задаётся в следующем формате
     * {
     *   shadowColor - цвет тени
     *   shadowOffset: { x, y } - смещение тени
     *   shadowRadius - радиус размытия
     * }
     */
    shadow: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    name (val) {
      this.icon = require(`@/assets/icons/${val}.svg`)
    }
  },
  computed: {
    CSSClass () {
      return `${this.pre} ${this.pre}--${this.name}`
    },
    getStyleShadow () {
      if (
        Object.keys(this.shadow).length === 0 ||
        (!this.shadow.shadowColor || !this.shadow.shadowOffset?.x || !this.shadow.shadowOffset?.y || !this.shadow.shadowRadius)
      ) {
        return null
      }
      return `
      drop-shadow(${this.shadow.shadowOffset.x} ${this.shadow.shadowOffset.y} ${this.shadow.shadowRadius} ${this.shadow.shadowColor})`
    }
  },
  mounted () {
    this.icon = require(`@/assets/icons/${this.name}.svg`)
  },
  render (h) {
    return h('i', {
      staticClass: `${this.pre} ${this.pre}--${this.name}`
    }, [
      h('svg', {
        attrs: {
          viewBox: this.icon?.default?.viewBox,
          width: this.width,
          style: `filter: ${this.getStyleShadow}`,
          height: this.height
        },
        key: this.name
      }, [
        h('use', {
          attrs: {
            'xlink:href': this.icon?.default?.url,
            'xmlns:xlink': 'http://www.w3.org/1999/xlink'
          }
        })
      ])
    ])
  }
}
