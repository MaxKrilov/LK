import './_style.scss'

export default {
  name: 'er-progress-circular',
  data: () => ({
    pre: 'er-progress-circular'
  }),
  props: {
    button: Boolean,
    indeterminate: Boolean,
    rotate: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 32
    },
    width: {
      type: [Number, String],
      default: 4
    },
    value: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    calculatedSize () {
      return Number(this.size) + (this.button ? 8 : 0)
    },
    circumference () {
      return 2 * Math.PI * this.radius
    },
    classes () {
      return {
        [`${this.pre}--indeterminate`]: this.indeterminate,
        [`${this.pre}--button`]: this.button
      }
    },
    normalizedValue () {
      return this.value < 0 ? 0 : (this.value > 100 ? 100 : parseFloat(this.value))
    },
    radius () {
      return 20
    },
    strokeDashArray () {
      return Math.round(this.circumference * 1000) / 1000
    },
    strokeDashOffset () {
      return `${((100 - this.normalizedValue) / 100) * this.circumference}px`
    },
    strokeWidth () {
      return Number(this.width) / Number(this.size) * this.viewBoxSize * 2
    },
    styles () {
      return {
        width: `${this.calculatedSize}px`,
        height: `${this.calculatedSize}px`
      }
    },
    svgStyles () {
      return {
        transform: `rotate(${Number(this.rotate)}deg)`
      }
    },
    viewBoxSize () {
      return this.radius / (1 - Number(this.width) / Number(this.size))
    }
  },
  methods: {
    genCircle (h, name, offset) {
      return h('circle', {
        class: `${this.pre}__${name}`,
        attrs: {
          fill: 'transparent',
          cx: 2 * this.viewBoxSize,
          cy: 2 * this.viewBoxSize,
          r: this.radius,
          'stroke-width': this.strokeWidth,
          'stroke-dasharray': this.strokeDashArray,
          'stroke-dashoffset': offset
        }
      })
    },
    genSvg (h) {
      const children = [
        this.indeterminate || this.genCircle(h, 'underlay', 0),
        this.genCircle(h, 'overlay', this.strokeDashOffset)
      ]
      return h('svg', {
        style: this.svgStyles,
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`
        }
      }, children)
    }
  },
  render (h) {
    const info = h('div', { staticClass: `${this.pre}__info` }, this.$slots.default)
    const svg = this.genSvg(h)
    return h('div', {
      staticClass: this.pre,
      attrs: {
        'role': 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue
      },
      class: this.classes,
      style: this.styles,
      on: this.$listeners
    }, [svg, info])
  }
}
