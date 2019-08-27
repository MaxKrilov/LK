import './_style.scss'

export default {
  name: 'er-pagination',
  data: () => ({
    pre: 'er-pagination',
    maxButtons: 0,
    selected: null
  }),
  props: {
    disabled: Boolean,
    length: {
      type: Number,
      default: 0,
      validator: val => val % 1 === 0
    },
    nextIcon: {
      type: String,
      default: 'arrow_r'
    },
    prevIcon: {
      type: String,
      default: 'arrow_l'
    },
    totalVisible: [Number, String],
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    items () {
      const totalVisible = parseInt(this.totalVisible, 10)
      const maxLength = totalVisible > this.maxButtons
        ? this.maxButtons
        : totalVisible || this.maxButtons
      if (this.length <= maxLength) {
        return this.range(1, this.length)
      }

      const even = maxLength % 2 === 0 ? 1 : 0
      const left = Math.floor(maxLength / 2)
      const right = this.length - left + 1 + even

      if (this.value > left && this.value < right) {
        const start = this.value - left + 2
        const end = this.value + left - 2 - even

        return [1, '...', ...this.range(start, end), '...', this.length]
      } else if (this.value === left) {
        const end = this.value + left - 1 - even
        return [...this.range(1, end), '...', this.length]
      } else if (this.value === right) {
        const start = this.value - left + 1
        return [1, '...', ...this.range(start, this.length)]
      } else {
        return [
          ...this.range(1, left),
          '...',
          ...this.range(right, this.length)
        ]
      }
    }
  },
  watch: {
    value () {
      this.init()
    }
  },
  methods: {
    init () {
      this.selected = null
      this.$nextTick(() => {
        const width = this.$el && this.$el.parentElement
          ? this.$el.parentElement.clientWidth
          : window.innerWidth
        this.maxButtons = Math.floor((width - 96) / 42)
      })
      setTimeout(() => (this.selected = this.value), 100)
    },
    next (e) {
      e.preventDefault()
      this.$emit('input', this.value + 1)
      this.$emit('next')
    },
    previous (e) {
      e.preventDefault()
      this.$emit('input', this.value - 1)
      this.$emit('previous')
    },
    range (from, to) {
      const range = []
      from = from > 0 ? from : 1
      for (let i = from; i <= to; i++) {
        range.push(i)
      }
      return range
    },
    genIcon (icon, disabled, cb, direction) {
      return this.$createElement('li', [
        this.$createElement('button', {
          staticClass: `${this.pre}__navigation`,
          class: {
            [`${this.pre}__navigation--disabled`]: disabled,
            [`${this.pre}__navigation--${direction}`]: true
          },
          attrs: {
            type: 'button'
          },
          on: disabled ? {} : { click: cb }
        }, [
          this.$createElement('er-icon', { props: { name: icon } })
        ])
      ])
    },
    genItem (i) {
      return this.$createElement('button', {
        staticClass: `${this.pre}__item`,
        class: {
          [`${this.pre}__item--active`]: i === this.value
        },
        attrs: {
          type: 'button'
        },
        on: {
          click: () => this.$emit('input', i)
        }
      }, [
        this.$createElement('span', [ i.toString() ])
      ])
    },
    genItems () {
      return this.items.map((i, index) => {
        return this.$createElement('li', { key: index }, [
          isNaN(Number(i))
            ? this.$createElement('span', { class: `${this.pre}__more` }, [i.toString()])
            : this.genItem(i)
        ])
      })
    }
  },
  mounted () {
    this.init()
  },
  render (h) {
    const children = [
      this.genIcon(this.prevIcon, this.value <= 1, this.previous, 'previous'),
      this.genItems(h),
      this.genIcon(this.nextIcon, this.value >= this.length, this.next, 'next')
    ]
    return h('ul', {
      staticClass: `${this.pre}`
    }, children)
  }
}
