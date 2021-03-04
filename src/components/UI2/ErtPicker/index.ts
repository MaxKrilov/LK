import './style.scss'

import Vue from 'vue'
import Component from 'vue-class-component'

import { convertToUnit } from '@/functions/helper2'

const props = {
  fullWidth: Boolean,
  landscape: Boolean,
  noTitle: Boolean,
  transition: {
    type: String,
    default: 'fade-transition'
  },
  width: {
    type: [Number, String],
    default: 290
  }
}

@Component<InstanceType<typeof ErtPicker>>({
  props
})
class ErtPicker extends Vue {
  // Props
  readonly fullWidth!: boolean
  readonly landscape!: boolean
  readonly noTitle!: boolean
  readonly transition!: string
  readonly width!: number | string

  // Methods
  genTitle () {
    return this.$createElement('div', {
      staticClass: 'ert-picker__title',
      class: {
        'ert-picker__title--landscape': this.landscape
      }
    }, this.$slots.title)
  }
  genBodyTransition () {
    return this.$createElement('transition', {
      props: {
        name: this.transition
      }
    }, this.$slots.default)
  }
  genBody () {
    return this.$createElement('div', {
      staticClass: 'ert-picker__body',
      class: {
        'ert-picker__body--no-title': this.noTitle
      },
      style: this.fullWidth
        ? undefined
        : { width: convertToUnit(this.width) }
    }, [
      this.genBodyTransition()
    ])
  }
  genActions () {
    return this.$createElement('div', {
      staticClass: 'ert-picker__actions',
      class: {
        'ert-picker__actions--no-title': this.noTitle
      }
    }, this.$slots.actions)
  }

  render () {
    return this.$createElement('div', {
      staticClass: 'ert-picker',
      class: {
        'ert-picker__landscape': this.landscape,
        'ert-picker--full-width': this.fullWidth
      }
    }, [
      this.$slots.title ? this.genTitle() : null,
      this.genBody(),
      this.$slots.actions ? this.genActions() : null
    ])
  }
}

export { ErtPicker }
export default ErtPicker
