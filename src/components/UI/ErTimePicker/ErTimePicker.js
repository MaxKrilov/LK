import ErTimePickerClock from './ErTimePickerClock'
import ErTimePickerTitle from './ErTimePickerTitle'

import ErPickerMixin from '../../../mixins/ErPickerMixin'
import ErPickerButtonMixin from '../../../mixins/ErPickerButtonMixin'

import { createRange } from '../../../functions/helper'
import pad from './util'

const rangeHours24 = createRange(24)
const rangeHours12am = createRange(12)
const rangeHours12pm = rangeHours12am.map(v => v + 12)
const range60 = createRange(60)

const selectingTimes = {
  Hour: 1,
  Minute: 2,
  Second: 3
}

const selectingNames = {
  1: 'hour',
  2: 'minute',
  3: 'second'
}

export { selectingTimes }

export default {
  name: 'er-time-picker',
  mixins: [
    ErPickerMixin,
    ErPickerButtonMixin
  ],
  data: () => ({
    inputHour: null,
    inputMinute: null,
    inputSecond: null,
    lazyInputHour: null,
    lazyInputMinute: null,
    lazyInputSecond: null,
    period: 'am',
    selecting: selectingTimes.Hour
  }),
  props: {
    allowedHours: [Function, Array],
    allowedMinutes: [Function, Array],
    allowedSeconds: [Function, Array],
    disabled: Boolean,
    format: {
      type: String,
      default: '24hr',
      validator: val => ['ampm', '24hr'].includes(val)
    },
    min: String,
    max: String,
    readonly: Boolean,
    scrollable: Boolean,
    useSeconds: Boolean,
    value: null,
    ampmInTitle: Boolean
  },
  computed: {
    selectingHour: {
      get () {
        return this.selecting === selectingTimes.Hour
      },
      set (v) {
        this.selecting = selectingTimes.Hour
      }
    },
    selectingMinute: {
      get () {
        return this.selecting === selectingTimes.Minute
      },
      set (v) {
        this.selecting = selectingTimes.Minute
      }
    },
    selectingSecond: {
      get () {
        return this.selecting === selectingTimes.Second
      },
      set (v) {
        this.selecting = selectingTimes.Second
      }
    },
    isAllowedHourCb () {
      let cb
      if (this.allowedHours instanceof Array) {
        cb = val => this.allowedHours.includes(val)
      } else {
        cb = this.allowedHours
      }
      if (!this.min && !this.max) return cb

      const minHour = this.min ? Number(this.min.split(':')[0]) : 0
      const maxHour = this.max ? Number(this.max.split(':')[0]) : 23

      return (val) => {
        return val >= minHour &&
          val <= maxHour &&
          (!cb || cb(val))
      }
    },
    isAllowedMinuteCb () {
      let cb

      const isHourAllowed = !this.isAllowedHourCb || this.inputHour === null || this.isAllowedHourCb(this.inputHour)
      if (this.allowedMinutes instanceof Array) {
        cb = (val) => this.allowedMinutes.includes(val)
      } else {
        cb = this.allowedMinutes
      }

      if (!this.min && !this.max) {
        return isHourAllowed ? cb : () => false
      }

      const [minHour, minMinute] = this.min ? this.min.split(':').map(Number) : [0, 0]
      const [maxHour, maxMinute] = this.max ? this.max.split(':').map(Number) : [23, 59]
      const minTime = minHour * 60 + minMinute
      const maxTime = maxHour * 60 + maxMinute

      return (val) => {
        const time = 60 * this.inputHour + val
        return time >= minTime &&
          time <= maxTime &&
          isHourAllowed &&
          (!cb || cb(val))
      }
    },
    isAllowedSecondCb () {
      let cb

      const isHourAllowed = !this.isAllowedHourCb || this.inputHour === null || this.isAllowedHourCb(this.inputHour)
      const isMinuteAllowed = isHourAllowed &&
        (!this.isAllowedMinuteCb ||
          this.inputMinute === null ||
          this.isAllowedMinuteCb(this.inputMinute)
        )

      if (this.allowedSeconds instanceof Array) {
        cb = (val) => this.allowedSeconds.includes(val)
      } else {
        cb = this.allowedSeconds
      }

      if (!this.min && !this.max) {
        return isMinuteAllowed ? cb : () => false
      }

      const [minHour, minMinute, minSecond] = this.min ? this.min.split(':').map(Number) : [0, 0, 0]
      const [maxHour, maxMinute, maxSecond] = this.max ? this.max.split(':').map(Number) : [23, 59, 59]
      const minTime = minHour * 3600 + minMinute * 60 + (minSecond || 0)
      const maxTime = maxHour * 3600 + maxMinute * 60 + (maxSecond || 0)

      return (val) => {
        const time = 3600 * this.inputHour + 60 * this.inputMinute + val
        return time >= minTime &&
          time <= maxTime &&
          isMinuteAllowed &&
          (!cb || cb(val))
      }
    },
    isAmPm () {
      return this.format === 'ampm'
    }
  },
  watch: {
    value: 'setInputData'
  },
  methods: {
    genValue () {
      if (this.inputHour != null && this.inputMinute != null && (!this.useSeconds || this.inputSecond != null)) {
        return `${pad(this.inputHour)}:${pad(this.inputMinute)}` + (this.useSeconds ? `:${pad(this.inputSecond)}` : '')
      }
      return null
    },
    emitValue () {
      const value = this.genValue()
      if (value !== null) this.$emit('input', value)
    },
    setPeriod (period) {
      this.period = period
      if (this.inputHour != null) {
        const newHour = this.inputHour + (period === 'am' ? -12 : 12)
        this.inputHour = this.firstAllowed('hour', newHour)
        this.emitValue()
      }
    },
    setInputData (value) {
      if (value == null || value === '') {
        this.inputHour = null
        this.inputMinute = null
        this.inputSecond = null
      } else if (value instanceof Date) {
        this.inputHour = value.getHours()
        this.inputMinute = value.getMinutes()
        this.inputSecond = value.getSeconds()
      } else {
        const [, hour, minute, , second, period] =
        value.trim().toLowerCase().match(/^(\d+):(\d+)(:(\d+))?([ap]m)?$/) || new Array(6)

        this.inputHour = period ? this.convert12to24(parseInt(hour, 10), period) : parseInt(hour, 10)
        this.inputMinute = parseInt(minute, 10)
        this.inputSecond = parseInt(second || 0, 10)
      }

      this.period = (this.inputHour == null || this.inputHour < 12) ? 'am' : 'pm'
    },
    convert24to12 (hour) {
      return hour ? ((hour - 1) % 12 + 1) : 12
    },
    convert12to24 (hour, period) {
      return hour % 12 + (period === 'pm' ? 12 : 0)
    },
    onInput (value) {
      if (this.selecting === selectingTimes.Hour) {
        this.inputHour = this.isAmPm ? this.convert12to24(value, this.period) : value
      } else if (this.selecting === selectingTimes.Minute) {
        this.inputMinute = value
      } else {
        this.inputSecond = value
      }
      this.emitValue()
    },
    onChange (value) {
      this.$emit(`click:${selectingNames[this.selecting]}`, value)

      const emitChange = this.selecting === (this.useSeconds ? selectingTimes.Second : selectingTimes.Minute)

      if (this.selecting === selectingTimes.Hour) {
        this.selecting = selectingTimes.Minute
      } else if (this.useSeconds && this.selecting === selectingTimes.Minute) {
        this.selecting = selectingTimes.Second
      }

      if (this.inputHour === this.lazyInputHour &&
        this.inputMinute === this.lazyInputMinute &&
        (!this.useSeconds || this.inputSecond === this.lazyInputSecond)
      ) return

      const time = this.genValue()
      if (time === null) return

      this.lazyInputHour = this.inputHour
      this.lazyInputMinute = this.inputMinute
      this.useSeconds && (this.lazyInputSecond = this.inputSecond)

      emitChange && this.$emit('change', time)
    },
    firstAllowed (type, value) {
      const allowedFn = type === 'hour' ? this.isAllowedHourCb : (type === 'minute' ? this.isAllowedMinuteCb : this.isAllowedSecondCb)
      if (!allowedFn) return value
      const range = type === 'minute'
        ? range60
        : (type === 'second'
          ? range60
          : (this.isAmPm
            ? (value < 12
              ? rangeHours12am
              : rangeHours12pm)
            : rangeHours24))
      const first = range.find(v => allowedFn((v + value) % range.length + range[0]))
      return ((first || 0) + value) % range.length + range[0]
    },
    genClock () {
      return this.$createElement(ErTimePickerClock, {
        props: {
          allowedValues:
            this.selecting === selectingTimes.Hour
              ? this.isAllowedHourCb
              : (this.selecting === selectingTimes.Minute
                ? this.isAllowedMinuteCb
                : this.isAllowedSecondCb),
          color: this.color,
          dark: this.dark,
          disabled: this.disabled,
          double: this.selecting === selectingTimes.Hour && !this.isAmPm,
          format: this.selecting === selectingTimes.Hour
            ? (this.isAmPm ? this.convert24to12 : (val) => val)
            : (val) => pad(val, 2),
          light: this.light,
          max: this.selecting === selectingTimes.Hour ? (this.isAmPm && this.period === 'am' ? 11 : 23) : 59,
          min: this.selecting === selectingTimes.Hour && this.isAmPm && this.period === 'pm' ? 12 : 0,
          readonly: this.readonly,
          scrollable: this.scrollable,
          size: Number(this.width) - ((!this.fullWidth && this.landscape) ? 80 : 20),
          step: this.selecting === selectingTimes.Hour ? 1 : 5,
          value: this.selecting === selectingTimes.Hour
            ? this.inputHour
            : (this.selecting === selectingTimes.Minute
              ? this.inputMinute
              : this.inputSecond)
        },
        on: {
          input: this.onInput,
          change: this.onChange
        },
        ref: 'clock'
      })
    },
    genClockAmPm () {
      return this.$createElement('div', {
        staticClass: 'er-rime-picker-clock__ampm'
      }, [
        this.genPickerButton('period', 'am', 'AM', this.disabled || this.readonly),
        this.genPickerButton('period', 'pm', 'PM', this.disabled || this.readonly)
      ])
    },
    genPickerBody () {
      return this.$createElement('div', {
        staticClass: 'er-time-picker-clock__container',
        // key: this.selecting
      }, [
        !this.ampmInTitle && this.isAmPm && this.genClockAmPm(),
        this.genClock()
      ])
    },
    genPickerTitle () {
      return this.$createElement(ErTimePickerTitle, {
        props: {
          ampm: this.ampmInTitle && this.isAmPm,
          disabled: this.disabled,
          hour: this.inputHour,
          minute: this.inputMinute,
          second: this.inputSecond,
          period: this.period,
          readonly: this.readonly,
          useSeconds: this.useSeconds,
          selecting: this.selecting
        },
        on: {
          'update:selecting': (value) => (this.selecting = value),
          'update:period': this.setPeriod
        },
        ref: 'title',
        slot: 'title'
      })
    }
  },
  mounted () {
    this.setInputData(this.value)
    this.$on('update:period', this.setPeriod)
  },
  render () {
    return this.genPicker('er-picker--time')
  }
}
