import './style.scss'

import Vue, { CreateElement, VNode, VNodeChildren } from 'vue'
import Component from 'vue-class-component'

import { convertToUnit } from '@/functions/helper2'

const props = {
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
}

@Component({ props })
class ErtProgressCircular extends Vue {
  // Props
  readonly button!: boolean
  readonly indeterminate!: boolean
  readonly rotate!: number | string
  readonly size!: number | string
  readonly width!: number | string
  readonly value!: number | string

  // Data
  radius: number = 20

  // Computed
  get calculatedSize (): number {
    return Number(this.size) + (this.button ? 8 : 0)
  }

  get circumference (): number {
    return 2 * Math.PI * this.radius
  }

  get classes (): object {
    return {
      'ert-progress-circular--indeterminate': this.indeterminate,
      'ert-progress-circular--button': this.button
    }
  }

  get normalizedValue (): number {
    if (this.value < 0) {
      return 0
    }

    if (this.value > 100) {
      return 100
    }

    return parseFloat(this.value)
  }

  get strokeDashArray (): number {
    return Math.round(this.circumference * 1000) / 1000
  }

  get strokeDashOffset (): string {
    return ((100 - this.normalizedValue) / 100) * this.circumference + 'px'
  }

  get strokeWidth (): number {
    return Number(this.width) / +this.size * this.viewBoxSize * 2
  }

  get styles (): object {
    return {
      height: convertToUnit(this.calculatedSize),
      width: convertToUnit(this.calculatedSize)
    }
  }

  get svgStyles (): object {
    return {
      transform: `rotate(${Number(this.rotate)}deg)`
    }
  }

  get viewBoxSize (): number {
    return this.radius / (1 - Number(this.width) / +this.size)
  }

  // Methods
  genCircle (name: string, offset: string | number): VNode {
    return this.$createElement('circle', {
      class: `ert-progress-circular__${name}`,
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
  }

  genSvg (): VNode {
    const children = [
      this.indeterminate || this.genCircle('underlay', 0),
      this.genCircle('overlay', this.strokeDashOffset)
    ] as VNodeChildren

    return this.$createElement('svg', {
      style: this.svgStyles,
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`
      }
    }, children)
  }

  genInfo (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-progress-circular__info'
    }, this.$slots.default)
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-progress-circular',
      attrs: {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue
      },
      class: this.classes,
      style: this.styles,
      on: this.$listeners
    }, [
      this.genSvg(),
      this.genInfo()
    ])
  }
}

export { ErtProgressCircular }
export default ErtProgressCircular
