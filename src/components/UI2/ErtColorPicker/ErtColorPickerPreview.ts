import './ErtColorPickerPreview.scss'

import ErtSlider from '@/components/UI2/ErtSlider'

import { RGBtoCSS, RGBAtoCSS } from '@/utils/colorUtils'

import Vue, { CreateElement, VNode, VNodeData } from 'vue'
import Component from 'vue-class-component'

import { ErtColorPickerColor, fromHSVA } from './util'

const props = {
  color: Object,
  disabled: Boolean,
  hideAlpha: Boolean
}

@Component({ props })
export default class ErtColorPickerPreview extends Vue {
  // Props
  readonly color!: ErtColorPickerColor
  readonly disabled!: boolean
  readonly hideAlpha!: boolean

  // Methods
  genAlpha (): VNode {
    return this.genTrack({
      staticClass: 'ert-color-picker__alpha',
      props: {
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        value: this.color.alpha,
        step: 0,
        min: 0,
        max: 1
      },
      style: {
        backgroundImage: this.disabled
          ? undefined
          : `linear-gradient(to right, transparent, ${RGBtoCSS(this.color.rgba)})`
      },
      on: {
        input: (val: number) => this.color.alpha !== val && this.$emit('update:color', fromHSVA({ ...this.color.hsva, a: val }))
      }
    })
  }
  genSliders (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-color-picker__sliders'
    }, [
      this.genHue(),
      !this.hideAlpha && this.genAlpha()
    ])
  }
  genDot (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-color-picker__dot'
    }, [
      this.$createElement('div', {
        style: {
          background: RGBAtoCSS(this.color.rgba)
        }
      })
    ])
  }
  genHue (): VNode {
    return this.genTrack({
      staticClass: 'ert-color-picker__hue',
      props: {
        thumbColor: 'grey lighten-2',
        hideDetails: true,
        value: this.color.hue,
        step: 0,
        min: 0,
        max: 360
      },
      on: {
        input: (val: number) => this.color.hue !== val && this.$emit('update:color', fromHSVA({ ...this.color.hsva, h: val }))
      }
    })
  }
  genTrack (options: VNodeData): VNode {
    return this.$createElement(ErtSlider, {
      class: 'ert-color-picker__track',
      ...options,
      props: {
        disabled: this.disabled,
        ...options.props
      }
    })
  }

  render (h: CreateElement): VNode {
    return h('div', {
      staticClass: 'ert-color-picker__preview',
      class: {
        'ert-color-picker__preview--hide-alpha': this.hideAlpha
      }
    }, [
      this.genDot(),
      this.genSliders()
    ])
  }
}
