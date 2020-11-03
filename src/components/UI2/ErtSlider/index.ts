import './style.scss'

import ErtInput from '@/components/UI2/ErtInput'
import { ErtScaleTransition } from '@/functions/transitions'

import Component, { mixins } from 'vue-class-component'

import ErtLoadableMixin from '@/mixins2/ErtLoadableMixin'
import ErtColorableMixin from '@/mixins2/ErtColorableMixin'

import ClickOutside from '@/directives2/click-outside'

import {
  addOnceEventListener,
  deepEqual,
  createRange,
  convertToUnit,
  passiveSupported
} from '@/functions/helper2'
import { keyCode as keyCodes } from '@/functions/keyCode'

import { VNode, VNodeChildrenArrayContents } from 'vue'
import { ScopedSlotChildren } from 'vue/types/vnode'

const baseMixins = mixins(
  ErtInput,
  ErtLoadableMixin,
  ErtColorableMixin
)

const directives = {
  ClickOutside
}

const props = {
  disabled: Boolean,
  inverseLabel: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  min: {
    type: [Number, String],
    default: 0
  },
  step: {
    type: [Number, String],
    default: 1
  },
  thumbColor: String,
  thumbLabel: {
    type: [Boolean, String],
    default: undefined,
    validator: (v: any) => typeof v === 'boolean' || v === 'always'
  },
  thumbSize: {
    type: [Number, String],
    default: 32
  },
  tickLabels: {
    type: Array,
    default: () => ([])
  },
  ticks: {
    type: [Boolean, String],
    default: false,
    validator: (v: any) => typeof v === 'boolean' || v === 'always'
  },
  tickSize: {
    type: [Number, String],
    default: 2
  },
  trackColor: String,
  trackFillColor: String,
  value: [Number, String],
  vertical: Boolean
}

@Component<InstanceType<typeof ErtSlider>>({
  directives,
  props,
  watch: {
    min (val) {
      const parsed = parseFloat(val)
      parsed > this.internalValue && this.$emit('input', parsed)
    },
    max (val) {
      const parsed = parseFloat(val)
      parsed < this.internalValue && this.$emit('input', parsed)
    },
    value: {
      handler (v: number) {
        this.internalValue = v
      }
    }
  }
})
class ErtSlider extends baseMixins {
  // Options
  $refs!: {
    'track': HTMLElement
  }

  // Props
  readonly disabled!: boolean
  readonly inverseLabel!: boolean
  readonly max!: number | string
  readonly min!: number | string
  readonly step!: number | string
  readonly thumbColor!: string
  readonly thumbLabel!: boolean | 'always'
  readonly thumbSize!: number | string
  readonly tickLabels!: string[]
  readonly ticks!: boolean | 'always'
  readonly tickSize!: number | string
  readonly trackColor!: string
  readonly trackFillColor!: string
  readonly value!: number
  readonly vertical!: boolean

  // Data
  app: any = null
  oldValue: any = null
  keyPressed: number = 0
  isFocused: boolean = false
  isActive: boolean = false
  noClick: boolean = false

  // Computed
  get classes (): object {
    return {
      ...ErtInput.options.computed.classes.get.call(this),
      'ert-input__slider': true,
      'ert-input__slider--vertical': this.vertical,
      'ert-input__slider--inverse-label': this.inverseLabel
    }
  }
  get trackTransition (): string {
    return this.keyPressed >= 2 ? 'none' : ''
  }
  get minValue (): number {
    return parseFloat(this.min)
  }
  get maxValue (): number {
    return parseFloat(this.max)
  }
  get stepNumeric (): number {
    return this.step > 0 ? parseFloat(this.step) : 0
  }
  get inputWidth (): number {
    const value = (this.roundValue(this.internalValue) - this.minValue) / (this.maxValue - this.minValue) * 100

    return value
  }
  get trackFillStyles (): Partial<CSSStyleDeclaration> {
    const startDir = this.vertical ? 'bottom' : 'left'
    const endDir = this.vertical ? 'top' : 'right'
    const valueDir = this.vertical ? 'height' : 'width'

    const start = '0'
    const end = 'auto'
    const value = this.isDisabled ? `calc(${this.inputWidth}% - 10px)` : `${this.inputWidth}%`

    return {
      transition: this.trackTransition,
      [startDir]: start,
      [endDir]: end,
      [valueDir]: value
    }
  }
  get trackStyles (): Partial<CSSStyleDeclaration> {
    const startDir = this.vertical ? 'top' : 'right'
    const endDir = this.vertical ? 'height' : 'width'

    const start = '0px'
    const end = this.isDisabled ? `calc(${100 - this.inputWidth}% - 10px)` : `calc(${100 - this.inputWidth}%)`

    return {
      transition: this.trackTransition,
      [startDir]: start,
      [endDir]: end
    }
  }
  get showTicks (): boolean {
    return this.tickLabels.length > 0 ||
      !!(!this.isDisabled && this.stepNumeric && this.ticks)
  }
  get numTicks (): number {
    return Math.ceil((this.maxValue - this.minValue) / this.stepNumeric)
  }
  get showThumbLabel (): boolean {
    return !this.isDisabled && !!(
      this.thumbLabel ||
      this.$scopedSlots['thumb-label']
    )
  }
  get computedTrackColor (): string | undefined {
    if (this.isDisabled) return undefined
    if (this.trackColor) return this.trackColor
    return this.validationState || 'primary lighten-3'
  }
  get computedTrackFillColor (): string | undefined {
    if (this.isDisabled) return undefined
    if (this.trackFillColor) return this.trackFillColor
  }
  get computedThumbColor (): string | undefined {
    if (this.thumbColor) return this.thumbColor
  }

  // Proxy
  get internalValue () {
    return this.lazyValue
  }
  set internalValue (val: number) {
    val = isNaN(val) ? this.minValue : val
    const value = this.roundValue(Math.min(Math.max(val, this.minValue), this.maxValue))

    if (value === this.lazyValue) return

    this.lazyValue = value

    this.$emit('input', value)
  }

  // Hooks
  beforeMount () {
    this.internalValue = this.value
  }

  mounted () {
    this.app = document.querySelector('[data-app]') ||
      console.warn('Missing v-app or a non-body wrapping element with the [data-app] attribute')
  }

  // Methods
  // @ts-ignore
  genDefaultSlot (): VNodeChildrenArrayContents {
    const children: VNodeChildrenArrayContents = [this.genLabel()]
    const slider = this.genSlider()
    this.inverseLabel
      ? children.unshift(slider)
      : children.push(slider)

    children.push(this.genProgress())

    return children
  }
  genSlider (): VNode {
    return this.$createElement('div', {
      class: {
        'ert-slider': true,
        'ert-slider--horizontal': !this.vertical,
        'ert-slider--vertical': this.vertical,
        'ert-slider--focused': this.isFocused,
        'ert-slider--active': this.isActive,
        'ert-slider--disabled': this.isDisabled,
        'ert-slider--readonly': this.isReadonly
      },
      directives: [{
        name: 'click-outside',
        value: this.onBlur
      }],
      on: {
        click: this.onSliderClick
      }
    }, this.genChildren())
  }
  genChildren (): VNodeChildrenArrayContents {
    return [
      this.genInput(),
      this.genTrackContainer(),
      this.genSteps(),
      this.genThumbContainer(
        this.internalValue,
        this.inputWidth,
        this.isActive,
        this.isFocused,
        this.onThumbMouseDown,
        this.onFocus,
        this.onBlur
      )
    ]
  }
  genInput (): VNode {
    return this.$createElement('input', {
      attrs: {
        value: this.internalValue,
        id: this.computedId,
        disabled: this.isDisabled,
        readonly: true,
        tabindex: -1,
        ...this.$attrs
      }
    })
  }
  genTrackContainer (): VNode {
    const children = [
      this.$createElement('div', this.setBackgroundColor(this.computedTrackColor, {
        staticClass: 'ert-slider__track-background',
        style: this.trackStyles
      })),
      this.$createElement('div', this.setBackgroundColor(this.computedTrackFillColor, {
        staticClass: 'ert-slider__track-fill',
        style: this.trackFillStyles
      }))
    ]

    return this.$createElement('div', {
      staticClass: 'ert-slider__track-container',
      ref: 'track'
    }, children)
  }
  genSteps (): VNode | null {
    if (!this.step || !this.showTicks) return null

    const tickSize = parseFloat(this.tickSize)
    const range = createRange(this.numTicks + 1)
    const direction = this.vertical ? 'bottom' : ('left')
    const offsetDirection = this.vertical ? ('right') : 'top'

    if (this.vertical) range.reverse()

    const ticks = range.map(index => {
      const children = []

      if (this.tickLabels[index]) {
        children.push(this.$createElement('div', {
          staticClass: 'ert-slider__tick-label'
        }, this.tickLabels[index]))
      }

      const width = index * (100 / this.numTicks)
      const filled = width < this.inputWidth

      return this.$createElement('span', {
        key: index,
        staticClass: 'ert-slider__tick',
        class: {
          'ert-slider__tick--filled': filled
        },
        style: {
          width: `${tickSize}px`,
          height: `${tickSize}px`,
          [direction]: `calc(${width}% - ${tickSize / 2}px)`,
          [offsetDirection]: `calc(50% - ${tickSize / 2}px)`
        }
      }, children)
    })

    return this.$createElement('div', {
      staticClass: 'ert-slider__ticks-container',
      class: {
        'ert-slider__ticks-container--always-show': this.ticks === 'always' || this.tickLabels.length > 0
      }
    }, ticks)
  }
  genThumbContainer (
    value: number,
    valueWidth: number,
    isActive: boolean,
    isFocused: boolean,
    onDrag: Function,
    onFocus: Function,
    onBlur: Function,
    ref = 'thumb'
  ): VNode {
    const children = [this.genThumb()]

    const thumbLabelContent = this.genThumbLabelContent(value)
    this.showThumbLabel && children.push(this.genThumbLabel(thumbLabelContent))

    return this.$createElement('div', this.setTextColor(this.computedThumbColor, {
      ref,
      key: ref,
      staticClass: 'ert-slider__thumb-container',
      class: {
        'ert-slider__thumb-container--active': isActive,
        'ert-slider__thumb-container--focused': isFocused,
        'ert-slider__thumb-container--show-label': this.showThumbLabel
      },
      style: this.getThumbContainerStyles(valueWidth),
      attrs: {
        role: 'slider',
        tabindex: this.isDisabled ? -1 : this.$attrs.tabindex ? this.$attrs.tabindex : 0,
        'aria-label': this.label,
        'aria-valuemin': this.min,
        'aria-valuemax': this.max,
        'aria-valuenow': this.internalValue,
        'aria-readonly': String(this.isReadonly),
        'aria-orientation': this.vertical ? 'vertical' : 'horizontal',
        ...this.$attrs
      },
      on: {
        focus: onFocus,
        blur: onBlur,
        keydown: this.onKeyDown,
        keyup: this.onKeyUp,
        touchstart: onDrag,
        mousedown: onDrag
      }
    }), children)
  }
  genThumbLabelContent (value: number | string): ScopedSlotChildren {
    return this.$scopedSlots['thumb-label']
      ? this.$scopedSlots['thumb-label']!({ value })
      : [this.$createElement('span', [String(value)])]
  }
  genThumbLabel (content: ScopedSlotChildren): VNode {
    const size = convertToUnit(this.thumbSize)

    const transform = this.vertical
      ? `translateY(20%) translateY(${(Number(this.thumbSize) / 3) - 1}px) translateX(55%) rotate(135deg)`
      : `translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)`

    return this.$createElement(ErtScaleTransition, {
      props: { origin: 'bottom center' }
    }, [
      this.$createElement('div', {
        staticClass: 'ert-slider__thumb-label-container',
        directives: [{
          name: 'show',
          value: this.isFocused || this.isActive || this.thumbLabel === 'always'
        }]
      }, [
        this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
          staticClass: 'ert-slider__thumb-label',
          style: {
            height: size,
            width: size,
            transform
          }
        }), [this.$createElement('div', content)])
      ])
    ])
  }
  genThumb (): VNode {
    return this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
      staticClass: 'ert-slider__thumb'
    }))
  }
  getThumbContainerStyles (width: number): object {
    const direction = this.vertical ? 'top' : 'left'
    let value = width
    value = this.vertical ? 100 - value : value

    return {
      transition: this.trackTransition,
      [direction]: `${value}%`
    }
  }
  onThumbMouseDown (e: MouseEvent) {
    e.preventDefault()

    this.oldValue = this.internalValue
    this.keyPressed = 2
    this.isActive = true

    const mouseUpOptions = passiveSupported ? { passive: true, capture: true } : true
    const mouseMoveOptions = passiveSupported ? { passive: true } : false
    if ('touches' in e) {
      this.app.addEventListener('touchmove', this.onMouseMove, mouseMoveOptions)
      addOnceEventListener(this.app, 'touchend', this.onSliderMouseUp, mouseUpOptions)
    } else {
      this.app.addEventListener('mousemove', this.onMouseMove, mouseMoveOptions)
      addOnceEventListener(this.app, 'mouseup', this.onSliderMouseUp, mouseUpOptions)
    }

    this.$emit('start', this.internalValue)
  }
  onSliderMouseUp (e: Event) {
    e.stopPropagation()
    this.keyPressed = 0
    const mouseMoveOptions = passiveSupported ? { passive: true } : false
    this.app.removeEventListener('touchmove', this.onMouseMove, mouseMoveOptions)
    this.app.removeEventListener('mousemove', this.onMouseMove, mouseMoveOptions)

    this.$emit('mouseup', e)
    this.$emit('end', this.internalValue)
    if (!deepEqual(this.oldValue, this.internalValue)) {
      this.$emit('change', this.internalValue)
      this.noClick = true
    }

    this.isActive = false
  }
  onMouseMove (e: MouseEvent) {
    const { value } = this.parseMouseMove(e)
    this.internalValue = value
  }
  onKeyDown (e: KeyboardEvent) {
    if (!this.isInteractive) return

    const value = this.parseKeyDown(e, this.internalValue)

    if (
      value == null ||
      value < this.minValue ||
      value > this.maxValue
    ) return

    this.internalValue = value
    this.$emit('change', value)
  }
  onKeyUp () {
    this.keyPressed = 0
  }
  onSliderClick (e: MouseEvent) {
    if (this.noClick) {
      this.noClick = false
      return
    }
    const thumb = (this.$refs as any).thumb as HTMLElement
    thumb.focus()

    this.onMouseMove(e)
    this.$emit('change', this.internalValue)
  }
  onBlur (e: Event) {
    this.isFocused = false

    this.$emit('blur', e)
  }
  onFocus (e: Event) {
    this.isFocused = true

    this.$emit('focus', e)
  }
  parseMouseMove (e: MouseEvent) {
    const start = this.vertical ? 'top' : 'left'
    const length = this.vertical ? 'height' : 'width'
    const click = this.vertical ? 'clientY' : 'clientX'

    const {
      [start]: trackStart,
      [length]: trackLength
    } = this.$refs.track.getBoundingClientRect() as any
    const clickOffset = 'touches' in e ? (e as any).touches[0][click] : e[click]

    let clickPos = Math.min(Math.max((clickOffset - trackStart) / trackLength, 0), 1) || 0

    if (this.vertical) clickPos = 1 - clickPos

    const isInsideTrack = clickOffset >= trackStart && clickOffset <= trackStart + trackLength
    const value = parseFloat(this.min) + clickPos * (this.maxValue - this.minValue)

    return { value, isInsideTrack }
  }
  parseKeyDown (e: KeyboardEvent, value: number) {
    if (!this.isInteractive) return

    const {
      DOM_VK_PAGE_UP: pageup,
      DOM_VK_PAGE_DOWN: pagedown,
      DOM_VK_END: end,
      DOM_VK_HOME: home,
      DOM_VK_LEFT: left,
      DOM_VK_RIGHT: right,
      DOM_VK_DOWN: down,
      DOM_VK_UP: up
    } = keyCodes

    if (![pageup, pagedown, end, home, left, right, down, up].includes(e.keyCode)) return

    e.preventDefault()
    const step = this.stepNumeric || 1
    const steps = (this.maxValue - this.minValue) / step
    if ([left, right, down, up].includes(e.keyCode)) {
      this.keyPressed += 1

      const increase = [right, up]
      const direction = increase.includes(e.keyCode) ? 1 : -1
      const multiplier = e.shiftKey ? 3 : (e.ctrlKey ? 2 : 1)

      value = value + (direction * step * multiplier)
    } else if (e.keyCode === home) {
      value = this.minValue
    } else if (e.keyCode === end) {
      value = this.maxValue
    } else {
      const direction = e.keyCode === pagedown ? 1 : -1
      value = value - (direction * step * (steps > 100 ? steps / 10 : 10))
    }

    return value
  }
  roundValue (value: number): number {
    if (!this.stepNumeric) return value
    const trimmedStep = this.step.toString().trim()
    const decimals = trimmedStep.indexOf('.') > -1
      ? (trimmedStep.length - trimmedStep.indexOf('.') - 1)
      : 0
    const offset = this.minValue % this.stepNumeric

    const newValue = Math.round((value - offset) / this.stepNumeric) * this.stepNumeric + offset

    return parseFloat(Math.min(newValue, this.maxValue).toFixed(decimals))
  }
}

export { ErtSlider }
export default ErtSlider
