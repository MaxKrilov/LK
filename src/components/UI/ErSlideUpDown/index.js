import ClickOutsideMixin from '@/mixins/ClickOutsideMixin'

export default {
  name: 'er-slide-up-down',
  props: {
    active: Boolean,
    duration: {
      type: Number,
      default: 500
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  mixins: [ClickOutsideMixin],

  data: () => ({
    style: {},
    initial: false
  }),

  watch: {
    active () {
      this.layout()
    }
  },

  render (h) {
    return h(
      this.tag,
      {
        style: this.style,
        ref: 'container',
        attrs: { 'aria-hidden': !this.active },
        on: { transitionend: this.onTransitionEnd }
      },
      this.$slots.default
    )
  },

  mounted () {
    this.layout()
    this.initial = true
  },

  computed: {
    el () {
      return this.$refs.container
    }
  },

  methods: {
    onOpenEnd () {
      this.$emit('open-end')
      this.bindClickOutside()
    },
    onCloseEnd () {
      this.$emit('close-end')
      this.unbindClickOutside()
    },
    onClickOutside () {
      this.$emit('click-outside')
    },

    layout () {
      if (this.active) {
        this.$emit('open-start')
        if (this.initial) {
          this.setHeight('0px', () => this.el.scrollHeight + 'px')
        }
      } else {
        this.$emit('close-start')
        this.setHeight(this.el.scrollHeight + 'px', () => '0px')
      }
    },

    asap (callback) {
      if (!this.initial) {
        callback()
      } else {
        this.$nextTick(callback)
      }
    },

    setHeight (temp, afterRelayout) {
      this.style = { height: temp }

      this.asap(() => {
        // force relayout so the animation will run
        this.__ = this.el.scrollHeight

        this.style = {
          height: afterRelayout(),
          overflow: 'hidden',
          'transition-property': 'height',
          'transition-duration': this.duration + 'ms'
        }
      })
    },

    onTransitionEnd () {
      if (this.active) {
        this.style = {}
        this.onOpenEnd()
      } else {
        this.style = {
          height: '0',
          overflow: 'hidden'
        }
        this.onCloseEnd()
      }
    }
  }
}
