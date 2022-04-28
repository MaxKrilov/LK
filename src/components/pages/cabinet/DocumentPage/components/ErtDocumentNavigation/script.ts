import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'

import Touch from '@/directives/touch'
import { TouchWrapper } from '../../../../../../types'

@Component<InstanceType<typeof ErtDocumentNavigation>>({
  directives: {
    Touch
  },
  watch: {
    internalValue () {
      this.$nextTick(() => {
        this.defineSliderStyle()
      })
    }
  }
})
export default class ErtDocumentNavigation extends Vue {
  /// Options
  $refs!: {
    component: HTMLDivElement
    list: HTMLDivElement
  }

  /// Props
  @Prop({ type: Array, default: () => ([]) })
  readonly items!: string[]

  @Prop({ type: Number })
  readonly value!: number

  /// Data
  sliderTransformStyle: number = 0
  sliderWidthStyle: number = 0
  listTransformStyle: number = 0

  isSliderLongerContent: boolean = false
  isEndScrollbar: boolean = false
  isStartScrollbar: boolean = true

  /// Computed
  get internalValue () {
    return this.value
  }

  set internalValue (val) {
    this.$emit('input', val)
  }

  get sliderStyle () {
    return {
      'width': `${this.sliderWidthStyle}px`,
      'transform': `translateX(${this.sliderTransformStyle}px)`
    }
  }

  get listStyle () {
    return {
      'transform': `translateX(${this.listTransformStyle}px)`
    }
  }

  get componentsClasses () {
    return {
      'is-scroll': this.isSliderLongerContent,
      'is-end': this.isEndScrollbar,
      'is-start': this.isStartScrollbar
    }
  }

  /// Methods
  defineSliderStyle () {
    const activeElement = this.$el.querySelector('.ert-document-navigation__item.is-active')

    if (!activeElement) return

    this.sliderWidthStyle = activeElement.clientWidth

    const componentCoords = this.$el.getBoundingClientRect()
    const elemCoords = activeElement.getBoundingClientRect()

    this.sliderTransformStyle = elemCoords.left - componentCoords.left
  }

  onResizeHandler () {
    this.isSliderLongerContent = this.$refs['component'].offsetWidth < this.$refs['list'].scrollWidth
    this.listTransformStyle = 0
  }

  onLeftHandler (e: TouchWrapper | number) {
    if (this.isEndScrollbar || !this.isSliderLongerContent) return

    const offsetX = typeof e === 'number'
      ? e
      : e.offsetX

    this.listTransformStyle = this.$refs['list'].scrollWidth > this.$refs['list'].offsetWidth + Math.abs(this.listTransformStyle) + Math.abs(offsetX)
      ? this.listTransformStyle - Math.abs(offsetX)
      : -(this.$refs['list'].scrollWidth - this.$refs['list'].offsetWidth)
    this.isStartScrollbar = false
    this.isEndScrollbar = this.$refs['list'].scrollWidth <=
      this.$refs['list'].offsetWidth +
      Math.abs(this.listTransformStyle)
  }

  onRightHandler (e: TouchWrapper | number) {
    if (this.isStartScrollbar || !this.isSliderLongerContent) return

    const offsetX = typeof e === 'number'
      ? e
      : e.offsetX

    this.listTransformStyle = Math.abs(this.listTransformStyle) < Math.abs(offsetX)
      ? 0
      : this.listTransformStyle + Math.abs(offsetX)
    this.isEndScrollbar = false
    this.isStartScrollbar = this.listTransformStyle === 0
  }

  onScrollEvent (e: WheelEvent) {
    e.preventDefault()

    if (e.deltaY < 0) {
      // Прокрутка вверх - листаем вправо
      this.onRightHandler(50)
    } else if (e.deltaY > 0) {
      this.onLeftHandler(50)
    }
  }

  mounted () {
    window.addEventListener('resize', this.onResizeHandler)

    window.setTimeout(() => {
      this.defineSliderStyle()
      this.onResizeHandler()
    }, 200)
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeHandler)
  }
}
