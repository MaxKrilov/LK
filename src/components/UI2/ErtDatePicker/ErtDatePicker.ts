import Component, { mixins } from 'vue-class-component'

import ErtDatePickerTitle from './ErtDatePickerTitle'
import ErtDatePickerHeader from './ErtDatePickerHeader'
import ErtDatePickerDateTable from './ErtDatePickerDateTable'
import ErtDatePickerMonthTable from './ErtDatePickerMonthTable'
import ErtDatePickerYears from './ErtDatePickerYears'

import ErtPickerMixin from '@/mixins2/ErtPickerMixin'

import isDateAllowed from './utils/isDateAllowed'
import { wrapInArray } from '@/functions/helper2'
import { daysInMonth } from '@/utils/dateTimeUtils'
import {
  createItemTypeListeners,
  createNativeLocaleFormatter,
  pad
} from './utils'

import { VNode } from 'vue'
import {
  DatePickerFormatter,
  DatePickerMultipleFormatter,
  DatePickerAllowedDatesFunction,
  DatePickerType
} from '@/types'

type DatePickerValue = string | string[] | undefined
interface Formatters {
  year: DatePickerFormatter
  titleDate: DatePickerFormatter | DatePickerMultipleFormatter
}

function sanitizeDateString (
  dateString: string,
  type: 'date' | 'month' | 'year'
): string {
  const [year, month = 1, date = 1] = dateString.split('-')
  return `${year}-${pad(month)}-${pad(date)}`.substr(0, { date: 10, month: 7, year: 4 }[type])
}

const props = {
  allowedDates: Function,
  dayFormat: Function,
  disabled: Boolean,
  firstDayOfWeek: {
    type: [String, Number],
    default: 0
  },
  headerDateFormat: Function,
  localeFirstDayOfYear: {
    type: [String, Number],
    default: 0
  },
  max: String,
  min: String,
  monthFormat: Function,
  multiple: Boolean,
  nextIcon: String,
  nextMonthAriaLabel: {
    type: String,
    default: 'Следующий месяц'
  },
  nextYearAriaLabel: {
    type: String,
    default: 'Следующий год'
  },
  pickerDate: String,
  prevIcon: String,
  prevMonthAriaLabel: {
    type: String,
    default: 'Прошлый месяц'
  },
  prevYearAriaLabel: {
    type: String,
    default: 'Предыдущий год'
  },
  range: Boolean,
  reactive: Boolean,
  readonly: Boolean,
  scrollable: Boolean,
  showCurrent: {
    type: [Boolean, String],
    default: true
  },
  selectedItemsText: {
    type: String,
    default: '{0} выбран'
  },
  showAdjacentMonths: Boolean,
  titleDateFormat: Function,
  type: {
    type: String,
    default: 'date',
    validator: (type: any) => ['date', 'month'].includes(type)
  },
  value: [Array, String],
  weekdayFormat: Function,
  yearFormat: Function,
  yearIcon: String
}

@Component<InstanceType<typeof ErtDatePicker>>({
  props,
  watch: {
    tableDate (val: string, prev: string) {
      const sanitizeType = this.type === 'month' ? 'year' : 'month'
      this.isReversing = sanitizeDateString(val, sanitizeType) < sanitizeDateString(prev, sanitizeType)
      this.$emit('update:picker-date', val)
    },
    pickerDate (val: string | null) {
      if (val) this.tableDate = val
      else if (this.lastValue && this.type === 'date') this.tableDate = sanitizeDateString(this.lastValue, 'month')
      else if (this.lastValue && this.type === 'month') this.tableDate = sanitizeDateString(this.lastValue, 'year')
    },
    value (val: DatePickerValue, prev: DatePickerValue) {
      this.checkMultipleProp()
      this.setInputDate()

      if (
        (!this.isMultiple && this.value && !this.pickerDate) ||
        (this.isMultiple && this.multipleValue.length && (!prev || !prev.length) && !this.pickerDate)
      ) {
        this.tableDate = sanitizeDateString(this.inputDate, this.type === 'month' ? 'year' : 'month')
      }
    },
    type (type: DatePickerType) {
      this.activePicker = type.toUpperCase()

      if (this.value && this.value.length) {
        const output = this.multipleValue
          .map((val: string) => sanitizeDateString(val, type))
          .filter(this.isDateAllowed)
        this.$emit('input', this.isMultiple ? output : output[0])
      }
    }
  },
  created () {
    this.checkMultipleProp()

    if (this.pickerDate !== this.tableDate) {
      this.$emit('update:picker-date', this.tableDate)
    }

    this.setInputDate()
  },
  render (): VNode {
    return this.genPicker('ert-picker--date')
  }
})
export default class ErtDatePicker extends mixins(ErtPickerMixin) {
  // Props
  /**
   * Restricts which dates can be selected
   * @type {DatePickerFormatter | undefined}
   */
  readonly allowedDates!: DatePickerAllowedDatesFunction | undefined
  /**
   * Allows you to customize the format of the day string that appears in the date table.
   * Called with date (ISO 8601 date string) arguments.
   * @type {function}
   */
  readonly dayFormat!: DatePickerAllowedDatesFunction | undefined
  /**
   * Disables interaction with the picker
   */
  readonly disabled!: boolean
  /**
   * Sets the first day of the week, starting with 0 for Sunday.
   */
  readonly firstDayOfWeek!: string | number
  /**
   * Allows you to customize the format of the month string that appears in the header of the calendar.
   * Called with date (ISO 8601 date string) arguments.
   */
  readonly headerDateFormat!: DatePickerMultipleFormatter | undefined
  /**
   * Sets the day that determines the first week of the year, starting with 0 for Sunday.
   * For ISO 8601 this should be 4.
   */
  readonly localeFirstDayOfYear!: string | number
  /**
   * Maximum allowed date/month (ISO 8601 format)
   */
  readonly max!: string
  /**
   * Minimum allowed date/month (ISO 8601 format)
   */
  readonly min!: string
  /**
   * Formatting function used for displaying months in the months table.
   * Called with date (ISO 8601 date string) arguments.
   */
  readonly monthFormat!: DatePickerFormatter | undefined
  /**
   * Allow the selection of multiple dates
   */
  readonly multiple!: boolean
  /**
   * Sets the icon for next month/year button
   */
  readonly nextIcon!: string
  readonly nextMonthAriaLabel!: string
  readonly nextYearAriaLabel!: string
  /**
   * Displayed year/month
   */
  readonly pickerDate!: string
  /**
   * Sets the icon for previous month/year button
   */
  readonly prevIcon!: string
  readonly prevMonthAriaLabel!: string
  readonly prevYearAriaLabel!: string
  /**
   * Allow the selection of date range
   */
  readonly range!: boolean
  /**
   * Updates the picker model when changing months/years automatically
   */
  readonly reactive!: boolean
  /**
   * Makes the picker readonly (doesn’t allow to select new date)
   */
  readonly readonly!: boolean
  /**
   * Allows changing displayed month with mouse scroll
   */
  readonly scrollable!: boolean
  readonly showCurrent!: boolean | string
  /**
   * Text used for translating the number of selected dates when using multiple prop
   */
  readonly selectedItemsText!: string
  /**
   * Toggles visibility of days from previous and next months
   */
  readonly showAdjacentMonths!: boolean
  /**
   * Toggles visibility of the week numbers in the body of the calendar
   */
  readonly showWeek!: boolean
  /**
   * Allows you to customize the format of the date string that appears in the title of the date picker.
   * Called with date (ISO 8601 date string) arguments.
   */
  readonly titleDateFormat!: DatePickerFormatter | DatePickerMultipleFormatter | undefined
  /**
   * Determines the type of the picker - date for date picker, month for month picker
   */
  readonly type!: 'date' | 'month'
  /**
   * Date picker model (ISO 8601 format, YYYY-mm-dd or YYYY-mm)
   */
  readonly value!: DatePickerValue
  /**
   * Allows you to customize the format of the weekday string that appears in the body of the calendar.
   * Called with date (ISO 8601 date string) arguments.
   */
  readonly weekdayFormat!: DatePickerFormatter | undefined
  /**
   * Allows you to customize the format of the year string that appears in the header of the calendar.
   * Called with date (ISO 8601 date string) arguments.
   */
  readonly yearFormat!: DatePickerFormatter | undefined
  /**
   * Sets the icon in the year selection button
   */
  readonly yearIcon!: string

  // Data
  now = new Date()

  activePicker = this.type.toUpperCase()
  inputDay: number | null = null
  inputMonth: number | null = null
  inputYear: number | null = null
  isReversing = false
  tableDate = (() => {
    if (this.pickerDate) {
      return this.pickerDate
    }

    const multipleValue = wrapInArray(this.value)
    const date = multipleValue[multipleValue.length - 1] ||
      (typeof this.showCurrent === 'string' ? this.showCurrent : `${this.now.getFullYear()}-${this.now.getMonth() + 1}`)
    return sanitizeDateString(date as string, this.type === 'date' ? 'month' : 'year')
  })()

  // Computed
  get multipleValue (): string [] {
    return wrapInArray(this.value)
  }
  get isMultiple (): boolean {
    return this.multiple || this.range
  }
  get lastValue (): string | null {
    return this.isMultiple
      ? this.multipleValue[this.multipleValue.length - 1]
      : (this.value as string | null)
  }
  get selectedMonths (): string | string[] | undefined {
    if (!this.value || this.type === 'month') return this.value
    if (this.isMultiple) return this.multipleValue.map(val => val.substr(0, 7))
    return (this.value as string).substr(0, 7)
  }
  get current (): string | null {
    if (this.showCurrent === true) {
      return sanitizeDateString(
        `${this.now.getFullYear()}-${this.now.getMonth() + 1}-${this.now.getDate()}`,
        this.type
      )
    }
    return this.showCurrent || null
  }
  get inputDate (): string {
    return this.type === 'date'
      ? `${this.inputYear}-${pad(this.inputMonth! + 1)}-${pad(this.inputDay!)}`
      : `${this.inputYear}-${pad(this.inputMonth! + 1)}`
  }
  get tableMonth (): number {
    return Number((this.pickerDate || this.tableDate).split('-')[1]) - 1
  }
  get tableYear (): number {
    return Number((this.pickerDate || this.tableDate).split('-')[0])
  }
  get minMonth (): string | null {
    return this.min
      ? sanitizeDateString(this.min, 'month')
      : null
  }
  get maxMonth (): string | null {
    return this.max
      ? sanitizeDateString(this.max, 'month')
      : null
  }
  get minYear (): string | null {
    return this.min
      ? sanitizeDateString(this.min, 'year')
      : null
  }
  get maxYear (): string | null {
    return this.max
      ? sanitizeDateString(this.max, 'year')
      : null
  }
  get formatters (): Formatters {
    return {
      year: this.yearFormat ||
        createNativeLocaleFormatter(
          'ru',
          { year: 'numeric', timeZone: 'UTC' },
          { length: 4 }
        ),
      titleDate: this.titleDateFormat ||
        (this.isMultiple ? this.defaultTitleMultipleDateFormatter : this.defaultTitleDateFormatter)
    }
  }
  get defaultTitleMultipleDateFormatter (): DatePickerMultipleFormatter {
    return (dates: string[]) => {
      if (!dates.length) return '-'
      if (dates.length === 1) return this.defaultTitleDateFormatter(dates[0])
      if (dates.length === 2 && this.range) return `${this.defaultTitleDateFormatter(dates[0])}-${this.defaultTitleDateFormatter(dates[1])}`
      return this.selectedItemsText
    }
  }
  get defaultTitleDateFormatter (): DatePickerFormatter {
    const titleFormats = {
      year: { year: 'numeric', timeZone: 'UTC' },
      month: { month: 'long', timeZone: 'UTC' },
      date: { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }
    }

    const titleDateFormatter = createNativeLocaleFormatter(
      'ru',
      titleFormats[this.type],
      {
        start: 0,
        length: { date: 10, month: 7, year: 4 }[this.type]
      }
    )

    const landscapeFormatter = (date: string) => titleDateFormatter(date)
      .replace(/([^\d\s])([\d])/g, (match, nonDigit, digit) => `${nonDigit} ${digit}`)
      .replace(', ', ',<br>')

    return this.landscape
      ? landscapeFormatter
      : titleDateFormatter
  }

  // Methods
  emitInput (newInput: string) {
    if (this.range) {
      if (this.multipleValue.length !== 1) {
        this.$emit('input', [newInput])
      } else {
        const output = [this.multipleValue[0], newInput]
        this.$emit('input', output)
        this.$emit('change', output)
      }
    } else {
      const output = this.multiple
        ? this.multipleValue.indexOf(newInput) === -1
          ? this.multipleValue.concat([newInput])
          : this.multipleValue.filter(x => x !== newInput)
        : newInput
      this.$emit('input', output)
      this.multiple || this.$emit('change', newInput)
    }
  }
  checkMultipleProp () {
    if (this.value == null) return
    const valueType = this.value.constructor.name
    const expected = this.isMultiple ? 'Array' : 'String'
    if (valueType !== expected) {
      console.warn(`Неверный тип параметра! Ожидалось: ${expected}, получено: ${valueType}`)
    }
  }
  isDateAllowed (value: string) {
    return isDateAllowed(value, this.min, this.max, this.allowedDates)
  }
  yearClick (value: number) {
    this.inputYear = value
    this.tableDate = this.type === 'month'
      ? `${value}`
      : `${value}-${pad((this.tableMonth || 0) + 1)}`
    this.activePicker = 'MONTH'
    if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
      this.$emit('input', this.inputDate)
    }
  }
  monthClick (value: string) {
    this.inputYear = parseInt(value.split('-')[0], 10)
    this.inputMonth = parseInt(value.split('-')[1], 10) - 1
    if (this.type === 'date') {
      if (this.inputDay) {
        this.inputDay = Math.min(
          this.inputDay,
          daysInMonth(this.inputYear, this.inputMonth + 1)
        )
      }

      this.tableDate = value
      this.activePicker = 'DATE'
      if (this.reactive && !this.readonly && !this.isMultiple && this.isDateAllowed(this.inputDate)) {
        this.$emit('input', this.inputDate)
      }
    } else {
      this.emitInput(this.inputDate)
    }
  }
  dateClick (value: string) {
    const dateArr = value.split('-')
    this.inputYear = parseInt(dateArr[0], 10)
    this.inputMonth = parseInt(dateArr[1], 10) - 1
    this.inputDay = parseInt(dateArr[2], 10)
    this.emitInput(this.inputDate)
  }
  genPickerTitle (): VNode {
    return this.$createElement(ErtDatePickerTitle, {
      props: {
        date: this.value
          ? (this.formatters.titleDate as (value: any) => string)(this.isMultiple ? this.multipleValue : this.value)
          : '',
        disabled: this.disabled,
        readonly: this.readonly,
        selectingYear: this.activePicker === 'YEAR',
        year: this.formatters.year(this.multipleValue.length ? `${this.inputYear}` : this.tableDate),
        yearIcon: this.yearIcon,
        value: this.multipleValue[0]
      },
      slot: 'title',
      on: {
        'update:selecting-year': (value: boolean) => { this.activePicker = value ? 'YEAR' : this.type.toUpperCase() }
      }
    })
  }
  genTableHeader (): VNode {
    return this.$createElement(ErtDatePickerHeader, {
      props: {
        nextIcon: this.nextIcon,
        disabled: this.disabled,
        format: this.headerDateFormat,
        locale: 'ru',
        min: this.activePicker === 'DATE' ? this.minMonth : this.minYear,
        max: this.activePicker === 'DATE' ? this.maxMonth : this.maxYear,
        nextAriaLabel: this.activePicker === 'DATE' ? this.nextMonthAriaLabel : this.nextYearAriaLabel,
        prevAriaLabel: this.activePicker === 'DATE' ? this.prevMonthAriaLabel : this.prevYearAriaLabel,
        prevIcon: this.prevIcon,
        readonly: this.readonly,
        value: this.activePicker === 'DATE'
          ? `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}`
          : `${pad(this.tableYear, 4)}`
      },
      on: {
        toggle: () => { this.activePicker = this.activePicker === 'DATE' ? 'MONTH' : 'YEAR' },
        input: (value: string) => { this.tableDate = value }
      }
    })
  }
  genDateTable (): VNode {
    return this.$createElement(ErtDatePickerDateTable, {
      props: {
        allowedDates: this.allowedDates,
        current: this.current,
        disabled: this.disabled,
        firstDayOfWeek: this.firstDayOfWeek,
        format: this.dayFormat,
        locale: 'ru',
        localeFirstDayOfYear: this.localeFirstDayOfYear,
        min: this.min,
        max: this.max,
        range: this.range,
        readonly: this.readonly,
        scrollable: this.scrollable,
        showAdjacentMonths: this.showAdjacentMonths,
        showWeek: this.showWeek,
        tableDate: `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}`,
        value: this.value,
        weekdayFormat: this.weekdayFormat
      },
      ref: 'table',
      on: {
        input: this.dateClick,
        'update:table-date': (value: string) => { this.tableDate = value },
        ...createItemTypeListeners(this, ':date')
      }
    })
  }
  genMonthTable (): VNode {
    return this.$createElement(ErtDatePickerMonthTable, {
      props: {
        allowedDates: this.type === 'month' ? this.allowedDates : null,
        current: this.current ? sanitizeDateString(this.current, 'month') : null,
        disabled: this.disabled,
        format: this.monthFormat,
        locale: 'ru',
        min: this.minMonth,
        max: this.maxMonth,
        range: this.range,
        readonly: this.readonly && this.type === 'month',
        scrollable: this.scrollable,
        value: this.selectedMonths,
        tableDate: `${pad(this.tableYear, 4)}`
      },
      ref: 'table',
      on: {
        input: this.monthClick,
        'update:table-date': (value: string) => { this.tableDate = value },
        ...createItemTypeListeners(this, ':month')
      }
    })
  }
  genYears (): VNode {
    return this.$createElement(ErtDatePickerYears, {
      props: {
        format: this.yearFormat,
        locale: 'ru',
        min: this.minYear,
        max: this.maxYear,
        value: this.tableYear
      },
      on: {
        input: this.yearClick,
        ...createItemTypeListeners(this, ':year')
      }
    })
  }
  genPickerBody (): VNode {
    const children = this.activePicker === 'YEAR'
      ? [ this.genYears() ]
      : [
        this.genTableHeader(),
        this.activePicker === 'DATE'
          ? this.genDateTable()
          : this.genMonthTable()
      ]

    return this.$createElement('div', {
      key: this.activePicker
    }, children)
  }
  setInputDate () {
    if (this.lastValue) {
      const array = this.lastValue.split('-')
      this.inputYear = parseInt(array[0], 10)
      this.inputMonth = parseInt(array[1], 10) - 1
      if (this.type === 'date') {
        this.inputDay = parseInt(array[2], 10)
      }
    } else {
      this.inputYear = this.inputYear || this.now.getFullYear()
      this.inputMonth = this.inputMonth == null ? this.inputMonth : this.now.getMonth()
      this.inputDay = this.inputDay || this.now.getDate()
    }
  }
}
