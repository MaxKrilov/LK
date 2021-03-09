import './ErtDatePickerYears.scss'

import Vue, { VNode } from 'vue'
import Component from 'vue-class-component'

import {
  createItemTypeNativeListeners,
  createNativeLocaleFormatter
} from './utils'

import { mergeListeners } from '@/utils/mergeData'

import { DatePickerFormatter } from '@/types'

const props = {
  format: Function,
  min: [Number, String],
  max: [Number, String],
  readonly: Boolean,
  value: [Number, String]
}

@Component<InstanceType<typeof ErtDatePickerYears>>({ props })
export default class ErtDatePickerYears extends Vue {
  // Options
  $el!: HTMLElement

  // Props
  readonly format!: DatePickerFormatter | undefined
  readonly min!: number | string
  readonly max!: number | string
  readonly readonly!: boolean
  readonly value!: number | string

  // Computed
  get formatter (): DatePickerFormatter {
    return this.format ||
      createNativeLocaleFormatter(
        'ru',
        { year: 'numeric', timeZone: 'UTC' },
        { length: 4 }
      )
  }

  // Hooks
  mounted () {
    setTimeout(() => {
      const activeItem = this.$el.getElementsByClassName('active')[0]
      if (activeItem) {
        this.$el.scrollTop = activeItem.offsetTop - this.$el.offsetHeight / 2 + activeItem.offsetHeight / 2
      } else if (this.min && !this.max) {
        this.$el.scrollTop = this.$el.scrollHeight
      } else if (!this.min && this.max) {
        this.$el.scrollTop = 0
      } else {
        this.$el.scrollTop = this.$el.scrollHeight / 2 - this.$el.offsetHeight / 2
      }
    })
  }

  // Methods
  genYearItem (year: number): VNode {
    const formatted = this.formatter(`${year}`)
    const active = parseInt(this.value, 10) === year

    return this.$createElement('li', {
      key: year,
      class: { active },
      on: mergeListeners({
        click: () => this.$emit('input', year)
      }, createItemTypeNativeListeners(this, ':year', year))
    }, formatted)
  }

  genYearItems (): VNode[] {
    const children = []
    const selectedYear = this.value
      ? parseInt(this.value, 10)
      : new Date().getFullYear()
    const maxYear = this.max
      ? parseInt(this.max, 10)
      : (selectedYear + 100)
    const minYear = Math.min(
      maxYear,
      this.min
        ? parseInt(this.min, 10)
        : (selectedYear - 100)
    )

    for (let year = maxYear; year >= minYear; year--) {
      children.push(this.genYearItem(year))
    }

    return children
  }

  render (): VNode {
    return this.$createElement('ul', {
      staticClass: 'ert-date-picker-years',
      ref: 'years'
    }, this.genYearItems())
  }
}
