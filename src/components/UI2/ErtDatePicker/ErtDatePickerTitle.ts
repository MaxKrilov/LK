import './ErtDatePickerTitle.scss'

import ErtIcon from '@/components/UI2/ErtIcon'

import ErtPickerButton from '@/mixins2/ErtPickerButton'

import { VNode } from 'vue'
import Component, { mixins } from 'vue-class-component'

const props = {
  date: {
    type: String,
    default: ''
  },
  disabled: Boolean,
  readonly: Boolean,
  selectingYear: Boolean,
  value: String,
  year: {
    type: [Number, String],
    default: ''
  },
  yearIcon: String
}

@Component<InstanceType<typeof ErtDatePickerTitle>>({
  props,
  watch: {
    value (val: string, prev: string) {
      this.isReversing = val < prev
    }
  }
})
export default class ErtDatePickerTitle extends mixins(ErtPickerButton) {
  // Props
  readonly date!: string
  readonly disabled!: boolean
  readonly readonly!: boolean
  readonly selectingYear!: boolean
  readonly value!: string
  readonly year!: number | string
  readonly yearIcon!: string

  // Data
  isReversing: boolean = false

  // Computed
  get computedTransition (): string {
    return this.isReversing
      ? 'picker-reverse-transition'
      : 'picker-transition'
  }

  // Methods
  genYearIcon (): VNode {
    return this.$createElement(ErtIcon, {
      props: { name: this.yearIcon }
    })
  }
  getYearBtn (): VNode {
    return this.genPickerButton(
      'selectingYear',
      true,
      [
        String(this.year),
        this.yearIcon
          ? this.genYearIcon()
          : null
      ],
      false,
      'ert-date-picker-title__year'
    )
  }
  genTitleText (): VNode {
    return this.$createElement('transition', {
      props: {
        name: this.computedTransition
      }
    }, [
      this.$createElement('div', {
        domProps: { innerHTML: this.date || '&nbsp;' },
        key: this.value
      })
    ])
  }
  genTitleDate (): VNode {
    return this.genPickerButton(
      'selectingYear',
      false,
      [this.genTitleText()],
      false,
      'ert-date-picker-title__date'
    )
  }

  render (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-date-picker-title',
      class: {
        'ert-date-picker-title--disabled': this.disabled
      }
    }, [
      this.getYearBtn(),
      this.genTitleDate()
    ])
  }
}
