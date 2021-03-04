import '../ErtDatePickerTable.scss'

import Vue, { VNodeChildren } from 'vue'
import Component from 'vue-class-component'

import Touch from '@/directives/touch'

import { createItemTypeNativeListeners } from '@/components/UI2/ErtDatePicker/utils'
import isDateAllowed from '@/components/UI2/ErtDatePicker/utils/isDateAllowed'
import { mergeListeners } from '@/utils/mergeData'
import { throttle } from '@/functions/helper2'

import { DatePickerAllowedDatesFunction, DatePickerFormatter, TouchWrapper } from '@/types'

type CalculateTableDateFunction = (v: number) => string

const directives = { Touch }

const props = {
  allowedDates: Function,
  current: String,
  disabled: Boolean,
  format: Function,
  min: String,
  max: String,
  range: Boolean,
  readonly: Boolean,
  scrollabe: Boolean,
  tableDate: {
    type: String,
    required: true
  },
  value: [String, Array]
}

@Component<InstanceType<typeof DatePickerTable>>({
  directives,
  props,
  watch: {
    tableDate (newVal: string, oldVal: string) {
      this.isReversing = newVal < oldVal
    }
  }
})
export default class DatePickerTable extends Vue {
  // Props
  readonly allowedDates!: DatePickerAllowedDatesFunction | undefined
  readonly current!: string
  readonly disabled!: boolean
  readonly format!: DatePickerFormatter
  readonly min!: string
  readonly max!: string
  readonly range!: boolean
  readonly readonly!: boolean
  readonly scrollable!: boolean
  readonly tableDate!: string
  readonly value!: string | string[]

  // Data
  isReversing: boolean = false
  wheelThrottle: any = null

  // Computed
  get computedTransition (): string {
    return this.isReversing
      ? 'tab-reverse-transition'
      : 'tab-transition'
  }

  get displayedMonth (): number {
    return Number(this.tableDate.split('-')[1]) - 1
  }

  get displayedYear (): number {
    return Number(this.tableDate.split('-')[0])
  }

  // Hooks
  mounted () {
    this.wheelThrottle = throttle(this.wheel, 250)
  }

  // Methods
  genButtonClasses (
    isAllowed: boolean,
    isFloating: boolean,
    isSelected: boolean,
    isCurrent: boolean
  ) {
    return {
      'ert-size--default': !isFloating,
      'ert-date-picker-table__current': isCurrent,
      'ert-btn--active': isSelected,
      'ert-btn--flat': !isAllowed || this.disabled,
      'ert-btn--text': isSelected === isCurrent,
      'ert-btn--rounded': isFloating,
      'ert-btn--disabled': !isAllowed || this.disabled,
      'ert-btn--outlined': isCurrent && !isSelected
    }
  }
  genButtonEvents (
    value: string,
    isAllowed: boolean,
    mouseEventType: string
  ) {
    if (this.disabled) return undefined

    return mergeListeners({
      click: () => {
        if (isAllowed && !this.readonly) this.$emit('input', value)
      }
    }, createItemTypeNativeListeners(this, `:${mouseEventType}`, value))
  }
  genButton (
    value: string,
    isFloating: boolean,
    mouseEventType: string,
    formatter: DatePickerFormatter,
    isOtherMonth: boolean = false
  ) {
    const isAllowed = isDateAllowed(value, this.min, this.max, this.allowedDates)
    const isSelected = this.isSelected(value) && isAllowed
    const isCurrent = value === this.current

    return this.$createElement('button', {
      staticClass: 'ert-btn',
      class: this.genButtonClasses(isAllowed && !isOtherMonth, isFloating, isSelected, isCurrent),
      attrs: { type: 'button' },
      domProps: {
        disabled: this.disabled || !isAllowed || isOtherMonth
      },
      on: this.genButtonEvents(value, isAllowed, mouseEventType)
    }, [
      this.$createElement('div', {
        staticClass: 'ert-btn__content'
      }, [formatter(value)])
    ])
  }
  wheel (
    e: WheelEvent,
    calculateTableDate: CalculateTableDateFunction
  ) {
    this.$emit('update:table-date', calculateTableDate(e.deltaY))
  }
  touch (
    value: number,
    calculateTableDate: CalculateTableDateFunction
  ) {
    this.$emit('update:table-date', calculateTableDate(value))
  }
  genTable (
    staticClass: string,
    children: VNodeChildren,
    calculateTableDate: CalculateTableDateFunction
  ) {
    const transition = this.$createElement('transition', {
      props: { name: this.computedTransition }
    }, [ this.$createElement('table', { key: this.tableDate }, children) ])

    const touchDirective = {
      name: 'touch',
      value: {
        left: (e: TouchWrapper) => (e.offsetX < -15) && this.touch(1, calculateTableDate),
        right: (e: TouchWrapper) => (e.offsetX > 15) && this.touch(-1, calculateTableDate)
      }
    }

    return this.$createElement('div', {
      staticClass,
      class: {
        'ert-date-picker-table--disabled': this.disabled
      },
      on: (!this.disabled && this.scrollable)
        ? {
          wheel: (e: WheelEvent) => {
            e.preventDefault()
            this.wheelThrottle(e, calculateTableDate)
          }
        }
        : undefined,
      directives: [touchDirective]
    }, [transition])
  }
  isSelected (value: string): boolean {
    if (Array.isArray(this.value)) {
      if (this.range && this.value.length === 2) {
        const [from, to] = [...this.value].sort()
        return from <= value && value <= to
      } else {
        return this.value.indexOf(value) !== -1
      }
    }

    return value === this.value
  }
}
