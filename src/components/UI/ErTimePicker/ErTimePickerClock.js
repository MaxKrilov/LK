import { getFirstElement } from '../../../functions/helper'
import './ErTimePickerClock.scss'

export default {
  name: 'er-time-picker-clock',
  data () {
    return {
      inputValue: this.value,
      isDragging: false,
      valueOnMouseDown: null,
      valueOnMouseUp: null
    }
  },
  props: {
    allowedValues: Function,
    ampm: Boolean,
    disabled: Boolean,
    double: Boolean,
    format: {
      type: Function,
      default: val => val
    },
    max: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    scrollable: Boolean,
    readonly: Boolean,
    rotate: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    value: Number
  },
  computed: {
    count () {
      return this.max - this.min + 1
    },
    degreesPerUnit () {
      return 360 / this.roundCount
    },
    degrees () {
      return this.degreesPerUnit * Math.PI / 180
    },
    displayedValue () {
      return this.value === null ? this.min : this.value
    },
    innerRadiusScale () {
      return 0.62
    },
    roundCount () {
      return this.double ? (this.count / 2) : this.count
    }
  },
  watch: {
    value (value) {
      this.inputValue = value
    }
  },
  methods: {
    /**
     * @param {WheelEvent} e
     */
    wheel (e) {
      e.preventDefault()
      const delta = Math.sign(-e.deltaY || 1)
      let value = this.displayedValue
      do {
        value += delta
        value = (value - this.min + this.count) % this.count + this.min
      } while (!this.isAllowed(value) && value !== this.displayedValue)
      if (value !== this.displayedValue) {
        this.update(value)
      }
    },
    /**
     * @param value
     * @return {BooleanConstructor | QUOTE_SETTINGS.double | {alternateQuote, quote, description} | boolean}
     */
    isInner (value) {
      return this.double && (value - this.min >= this.roundCount)
    },
    /**
     * @param {number} value
     * @return {number}
     */
    handScale (value) {
      return this.isInner(value) ? this.innerRadiusScale : 1
    },
    isAllowed (value) {
      return !this.allowedValues || this.allowedValues(value)
    },
    genValues (h) {
      const children = []
      for (let value = this.min; value <= this.max; value += this.step) {
        children.push(
          <span
            class={[
              'er-time-picker-clock__item',
              {
                'er-time-picker-clock__item--active': value === this.displayedValue,
                'er-time-picker-clock__item--disabled': this.disabled || !this.isAllowed(value)
              }
            ]}
            style={this.getTransform(value)}
          >
            <span>{this.format(value)}</span>
          </span>
        )
      }
      return children
    },
    genHand (h) {
      const scale = `scaleY(${this.handScale(this.displayedValue)})`
      const angle = this.rotate + this.degreesPerUnit * (this.displayedValue - this.min)
      return (
        <div
          class={[
            'er-time-picker-clock__hand',
            {
              'er-time-picker-clock__hand--inner': this.isInner(this.value)
            }
          ]}
          style={{
            transform: `rotate(${angle}deg) ${scale}`
          }}
        >

        </div>
      )
    },
    getTransform (i) {
      const { x, y } = this.getPosition(i)
      return {
        left: `${50 + x * 50}%`,
        top: `${50 + y * 50}%`
      }
    },
    getPosition (value) {
      const rotateRadians = this.rotate * Math.PI / 180
      return {
        x: Math.sin((value - this.min) * this.degrees + rotateRadians) * this.handScale(value),
        y: -Math.cos((value - this.min) * this.degrees + rotateRadians) * this.handScale(value)
      }
    },
    /**
     * @param {MouseEvent|TouchEvent} e
     */
    onMouseDown (e) {
      e.preventDefault()
      this.valueOnMouseDown = null
      this.valueOnMouseUp = null
      this.isDragging = true
      this.onDragMove(e)
    },
    /**
     * @param {MouseEvent|TouchEvent} e
     */
    onMouseUp (e) {
      e.stopPropagation()
      this.isDragging = false
      if (this.valueOnMouseUp !== null && this.isAllowed(this.valueOnMouseUp)) {
        this.$emit('change', this.valueOnMouseUp)
      }
    },
    /**
     * @param {MouseEvent|TouchEvent} e
     */
    onDragMove (e) {
      e.preventDefault()
      if (!this.isDragging && e.type !== 'click') return
      const { width, top, left } = this.$refs.clock.getBoundingClientRect()
      const { width: innerWidth } = this.$refs.innerClock.getBoundingClientRect()
      const { clientX, clientY } = 'touches' in e ? getFirstElement(e.touches) : e
      const center = { x: width / 2, y: -width / 2 }
      const coords = { x: clientX - left, y: top - clientY }
      const handAngle = Math.round(this.angle(center, coords) - this.rotate + 360) % 360
      const insideClick = this.double && this.euclidean(center, coords) < (innerWidth + innerWidth * this.innerRadiusScale) / 4
      const value = (
        Math.round(handAngle / this.degreesPerUnit) + (insideClick ? this.roundCount : 0)
      ) % this.count + this.min
      let newValue
      if (handAngle >= (360 - this.degreesPerUnit / 2)) {
        newValue = insideClick ? this.max - this.roundCount + 1 : this.min
      } else {
        newValue = value
      }
      if (this.isAllowed(value)) {
        if (this.valueOnMouseDown === null) {
          this.valueOnMouseDown = newValue
        }
        this.valueOnMouseUp = newValue
        this.update(newValue)
      }
    },
    update (value) {
      if (this.inputValue !== value) {
        this.inputValue = value
        this.$emit('input', value)
      }
    },
    euclidean (p0, p1) {
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      return Math.sqrt(dx * dx + dy * dy)
    },
    angle (center, p1) {
      const value = 2 * Math.atan2(p1.y - center.y - this.euclidean(center, p1), p1.x - center.x)
      return Math.abs(value * 180 / Math.PI)
    }
  },
  render (h) {
    const data = {
      staticClass: 'er-time-picker-clock',
      class: {
        'er-time-picker--inderterminate': this.value == null
      },
      on: (this.readonly || this.disabled) ? undefined : Object.assign({
        mousedown: this.onMouseDown,
        mouseup: this.onMouseUp,
        mouseleave: e => (this.isDragging && this.onMouseUp(e)),
        touchstart: this.onMouseDown,
        touchend: this.onMouseUp,
        mousemove: this.onDragMove,
        touchmove: this.onDragMove
      }, this.scrollable ? { wheel: this.wheel } : {}),
      ref: 'clock'
    }
    return h('div', data, [
      h('div', {
        staticClass: 'er-time-picker-clock__inner',
        ref: 'innerClock'
      }, [
        this.genHand(h),
        this.genValues(h)
      ])
    ])
  }
}
