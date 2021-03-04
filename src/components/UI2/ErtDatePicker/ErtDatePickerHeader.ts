import './ErtDatePickerHeader.scss'

import Vue, { VNode } from 'vue'
import Component from 'vue-class-component'

import ErtIcon from '@/components/UI2/ErtIcon'

import { DatePickerFormatter } from '@/types'
import { createNativeLocaleFormatter, monthChange } from './utils'

const props = {
  disabled: Boolean,
  format: Function,
  min: String,
  max: String,
  nextAriaLabel: String,
  nextIcon: {
    type: String,
    default: 'right_big'
  },
  prevAriaLabel: String,
  prevIcon: {
    type: String,
    default: 'left_big'
  },
  readonly: Boolean,
  value: {
    type: [Number, String],
    required: true
  }
}

@Component<InstanceType<typeof ErtDatePickerHeader>>({
  props,
  watch: {
    value (newVal, oldVal) {
      this.isReversing = newVal < oldVal
    }
  }
})
export default class ErtDatePickerHeader extends Vue {
  // Props
  readonly disabled!: boolean
  readonly format!: DatePickerFormatter | undefined
  readonly min!: string
  readonly max!: string
  readonly nextAriaLabel!: string
  readonly nextIcon!: string
  readonly prevAriaLabel!: string
  readonly prevIcon!: string
  readonly readonly!: boolean
  readonly value!: number | string

  // Data
  isReversing: boolean = false

  // Computed
  get formatter (): DatePickerFormatter {
    if (this.format) {
      return this.format
    } else if (String(this.value).split('-')[1]) {
      return createNativeLocaleFormatter(
        'ru',
        { month: 'long', year: 'numeric', timeZone: 'UTC' },
        { length: 7 }
      )
    } else {
      return createNativeLocaleFormatter(
        'ru',
        { year: 'numeric', timeZone: 'UTC' },
        { length: 4 }
      )
    }
  }

  // Methods
  genBtn (change: number) {
    const disabled = this.disabled ||
      (change < 0 && this.min && this.calculateChange(change) < this.min) ||
      (change > 0 && this.max && this.calculateChange(change) > this.max)

    return this.$createElement('button', {
      domProps: { disabled },
      on: {
        click: (e: Event) => {
          e.stopPropagation()
          this.$emit('input', this.calculateChange(change))
        }
      }
    }, [
      this.$createElement(ErtIcon, {
        props: {
          small: true,
          name: change < 0
            ? this.prevIcon
            : this.nextIcon
        }
      })
    ])
  }
  calculateChange (sign: number) {
    const [year, month] = String(this.value).split('-').map(Number)

    if (month == null) {
      return `${year + sign}`
    }

    return monthChange(String(this.value), sign)
  }
  genHeader () {
    const header = this.$createElement('div', {
      key: String(this.value)
    }, [
      this.$createElement('button', {
        attrs: {
          type: 'button'
        },
        on: {
          click: () => this.$emit('toggle')
        }
      }, [this.$slots.default || this.formatter(String(this.value))])
    ])

    const transition = this.$createElement('transition', {
      props: {
        name: this.isReversing
          ? 'tab-reverse-transition'
          : 'tab-transition'
      }
    }, [header])

    return this.$createElement('div', {
      staticClass: 'ert-date-picker-header__value',
      class: {
        'ert-date-picker-header__value--disabled': this.disabled
      }
    }, [transition])
  }

  render (): VNode {
    return this.$createElement('div', {
      staticClass: 'ert-date-picker-header',
      class: {
        'ert-date-picker-header--disabled': this.disabled
      }
    }, [
      this.genBtn(-1),
      this.genHeader(),
      this.genBtn(+1)
    ])
  }
}
