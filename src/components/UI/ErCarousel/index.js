import './_style.scss'

const IS_BROWSER = typeof window !== 'undefined'
const IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in window.document.documentElement : false
const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in window : false
const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown'
const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove'
const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend' : 'mouseup'
const EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START
const EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE
const EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup' : EVENT_TOUCH_END
const EVENT_POINTER_ENTER = HAS_POINTER_EVENT ? 'pointerenter' : 'mouseenter'
const EVENT_POINTER_LEAVE = HAS_POINTER_EVENT ? 'pointerleave' : 'mouseleave'

export default {
  name: 'er-carousel',
  data: () => ({
    pre: 'er-carousel',
    endX: 0,
    endY: 0,
    index: 0,
    list: [],
    playing: false,
    sliding: false,
    startX: 0,
    startY: 0,
    timeout: 0
  }),
  props: {
    autoplay: {
      type: Boolean,
      default: true
    },
    constrols: {
      type: [Boolean, String],
      default: 'hover'
    },
    data: Array,
    direction: {
      type: String,
      default: 'left'
    },
    indicators: {
      type: [Boolean, String],
      default: true
    },
    indicatorTrigger: {
      type: String,
      default: 'click'
    },
    indicatorType: {
      type: String,
      default: 'line'
    },
    interval: {
      type: Number,
      default: 5000
    },
    pauseOnEnter: {
      type: Boolean,
      default: true
    },
    slideOnSwipe: {
      type: Boolean,
      default: true
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  watch: {
    data () {
      this.init()
    }
  },
  methods: {
    init () {
      const { data } = this
      const list = []
      if (data && data.length > 0) {
        data.forEach((rawItem, index) => {
          const active = index === this.index
          const item = {
            ...(rawItem && rawItem.content !== undefined ? rawItem : {
              content: rawItem
            }),
            active,
            bottom: false,
            left: false,
            raw: rawItem,
            right: false,
            sliding: active,
            toBottom: false,
            toLeft: false,
            toRight: false,
            toTop: false,
            top: false
          }
          list.push(item)
        })
      }
      this.list = list
    },
    play () {
      if (!this.playing) {
        this.playing = true
        this.cycle()
      }
    },
    cycle () {
      this.pause()
      this.timeout = setTimeout(() => {
        this.next(() => {
          this.cycle()
        })
      }, this.interval)
    },
    pause () {
      clearTimeout(this.timeout)
      this.timeout = 0
    },
    stop () {
      if (this.playing) {
        this.pause()
        this.playing = false
      }
    },
    prev (done) {
      this.slideTo(this.index - 1, done)
    },
    next (done) {
      this.slideTo(this.index + 1, done)
    },
    slide (index, reverse = false, done = () => {}) {
      if (document.hidden || this.sliding) {
        done()
        return
      }
      this.sliding = true
      const { list } = this
      const minIndex = 0
      const maxIndex = list.length - 1
      if (index > maxIndex) {
        index = minIndex
      } else if (index < minIndex) {
        index = maxIndex
      }
      if (index === this.index) {
        done()
        return
      }
      const active = list[ this.index ]
      const next = list[ index ]
      switch (this.direction) {
        case 'up':
          next.bottom = !reverse
          next.top = reverse
          break
        case 'right':
          next.left = !reverse
          next.right = reverse
          break
        case 'down':
          next.top = !reverse
          next.bottom = reverse
          break
        default:
          next.right = !reverse
          next.left = reverse
      }
      // Waiting for the class change applied
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.$el.offsetWidth
        switch (this.direction) {
          case 'up':
            active.toTop = !reverse
            active.toBottom = reverse
            next.toTop = !reverse
            next.toBottom = reverse
            break
          case 'right':
            active.toRight = !reverse
            active.toLeft = reverse
            next.toRight = !reverse
            next.toLeft = reverse
            break
          case 'down':
            active.toBottom = !reverse
            active.toTop = reverse
            next.toBottom = !reverse
            next.toTop = reverse
            break
          // case 'left':
          default:
            active.toLeft = !reverse
            active.toRight = reverse
            next.toLeft = !reverse
            next.toRight = reverse
        }
        active.sliding = false
        next.sliding = true
        setTimeout(() => {
          active.active = false
          active.top = false
          active.right = false
          active.bottom = false
          active.left = false
          active.toTop = false
          active.toRight = false
          active.toBottom = false
          active.toLeft = false
          next.active = true
          next.top = false
          next.right = false
          next.bottom = false
          next.left = false
          next.toTop = false
          next.toRight = false
          next.toBottom = false
          next.toLeft = false
          this.index = index
          this.sliding = false
          done()
        }, 600)
      })
    },
    slideTo (index, done) {
      if (index === this.index) {
        return
      }
      const { direction } = this
      let reverse = index < this.index
      if (direction === 'right' || direction === 'down') {
        reverse = !reverse
      }
      this.slide(index, reverse, done)
    },
    slideStart (event) {
      const touch = event.touches ? event.touches[ 0 ] : null
      if (this.pauseOnEnter) {
        this.stop()
      }
      this.startX = touch ? touch.pageX : event.pageX
      this.startY = touch ? touch.pageY : event.pageY
    },
    slideMove (event) {
      const touch = event.touches ? event.touches[ 0 ] : null
      event.preventDefault()
      this.endX = touch ? touch.pageX : event.pageX
      this.endY = touch ? touch.pageY : event.pageY
    },
    slideEnd () {
      const moveX = this.endX - this.startX
      const moveY = this.endY - this.startY
      this.endX = this.startX
      this.endY = this.startY
      // Ignore click events
      if (moveX === 0 && moveY === 0) {
        return
      }
      const thresholdX = this.$el.offsetWidth / 5
      const thresholdY = this.$el.offsetHeight / 5
      const top = moveY < -thresholdY
      const right = moveX > thresholdX
      const bottom = moveY > thresholdY
      const left = moveX < -thresholdX
      const done = () => {
        if (this.pauseOnEnter) {
          this.play()
        }
      }
      let prev = false
      let next = false
      switch (this.direction) {
        case 'up':
          prev = bottom
          next = top
          break
        case 'right':
          prev = left
          next = right
          break
        case 'down':
          prev = top
          next = bottom
          break
        // case 'left':
        default:
          prev = right
          next = left
      }
      if (prev) {
        this.prev(done)
      } else if (next) {
        this.next(done)
      } else {
        done()
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    document.addEventListener('visibilitychange', this.onVisibilityChange = () => {
      if (this.playing) {
        if (document.visibilityState === 'visible') {
          this.cycle()
        } else {
          this.pause()
        }
      }
    })
    if (this.autoplay) {
      this.play()
    }
  },
  beforeDestroy () {
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  },
  render (h) {
    return h(this.tag, {
      staticClass: `${this.pre}`,
      class: {
        [`${this.pre}--${this.direction}`]: this.direction,
        [`${this.pre}--slideable`]: this.slideOnSwipe,
        [`${this.pre}--controls`]: this.controls === 'hover',
        [`${this.pre}--indicators`]: this.indicators === 'hover'
      },
      on: {
        ...this.$listeners,
        ...(this.pauseOnEnter ? {
          [EVENT_POINTER_ENTER]: this.pause,
          [EVENT_POINTER_LEAVE]: this.cycle
        } : {}),
        ...(this.slideOnSwipe ? {
          [EVENT_POINTER_DOWN]: this.slideStart,
          [EVENT_POINTER_MOVE]: this.slideMove,
          [EVENT_POINTER_UP]: this.slideEnd
        } : {})
      }
    },
    this._.isEmpty(this.list)
      ? []
      : [
        h('ul', {
          staticClass: `${this.pre}__list`
        }, this.list.map((item, index) => h('li', {
          attrs: { 'data-index': index },
          staticClass: `${this.pre}__item`,
          class: {
            [`${this.pre}__item--active`]: item.active,
            [`${this.pre}__item--top`]: item.top,
            [`${this.pre}__item--right`]: item.right,
            [`${this.pre}__item--bottom`]: item.bottom,
            [`${this.pre}__item--left`]: item.left,
            [`${this.pre}__item--to-top`]: item.toTop,
            [`${this.pre}__item--to-right`]: item.toRight,
            [`${this.pre}__item--to-bottom`]: item.toBottom,
            [`${this.pre}__item--to-left`]: item.toLeft
          }
        }, [
          item.content
        ]))),
        this.indicators
          ? h('ol', {
            staticClass: `${this.pre}__indicators`,
            class: {
              [`${this.pre}__indicators--${this.indicatorType}`]: this.indicatorType
            }
          }, this.list.map((item, index) => h('li', {
            attrs: { 'data-slide-to': index },
            staticClass: `${this.pre}__indicator`,
            class: {
              [`${this.pre}__indicator--active`]: item.sliding
            },
            on: (() => {
              const listeners = {}
              const slide = () => {
                this.slideTo(index)
              }
              if (this.indicatorTrigger === 'hover') {
                listeners.touchstart = slide
                listeners[EVENT_POINTER_ENTER] = slide
              } else {
                listeners.click = slide
              }
              return listeners
            })()
          })))
          : '',
        this.controls && h('button', {
          attrs: { 'data-slide': 'prev' },
          class: [
            `${this.pre}__control`,
            `${this.pre}__control--prev`
          ],
          on: {
            click: () => {
              if (['right', 'down'].includes(this.direction)) {
                this.next()
              } else {
                this.prev()
              }
            }
          }
        }),
        this.controls && h('button', {
          attrs: { 'data-slide': 'next' },
          class: [
            `${this.pre}__control`,
            `${this.pre}__control--next`
          ],
          on: {
            click: () => {
              if (['right', 'down'].includes(this.direction)) {
                this.prev()
              } else {
                this.next()
              }
            }
          }
        })
      ]
    )
  }
}
