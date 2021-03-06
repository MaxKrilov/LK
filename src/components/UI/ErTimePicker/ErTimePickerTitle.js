import ErPickerButtonMixin from '@/mixins/ErPickerButtonMixin'
import './ErTimePickerTitle.scss'

import pad from './util'
import { selectingTimes } from './ErTimePicker'

export default {
  name: 'er-time-picker-title',
  mixins: [
    ErPickerButtonMixin
  ],
  props: {
    ampm: Boolean,
    disabled: Boolean,
    hour: Number,
    minute: Number,
    second: Number,
    period: {
      type: String,
      validator: period => period === 'am' || period === 'pm'
    },
    readonly: Boolean,
    useSeconds: Boolean,
    selecting: Number
  },
  methods: {
    genTime () {
      let hour = this.hour
      if (this.ampm) {
        hour = hour ? ((hour - 1) % 12 + 1) : 12
      }
      const displayedHour = this.hour == null
        ? '--'
        : this.ampm
          ? String(hour)
          : pad(hour)
      const displayedMinute = this.minute == null ? '--' : pad(this.minute)
      const titleContent = [
        this.genPickerButton('selecting', selectingTimes.Hour, displayedHour, this.disabled),
        this.$createElement('span', ':'),
        this.genPickerButton('selecting', selectingTimes.Minute, displayedMinute, this.disabled)
      ]
      if (this.useSeconds) {
        const displayedSecond = this.second == null ? '--' : pad(this.second)
        titleContent.push(this.$createElement('span', ':'))
        titleContent.push(this.genPickerButton('selecting', selectingTimes.Second, displayedSecond, this.disabled))
      }
      return this.$createElement('div', {
        staticClass: 'er-time-picker-title__time'
      }, titleContent)
    },
    genAmPm () {
      return this.$createElement('div', {
        staticClass: 'er-time-picker-title__ampm'
      }, [
        this.genPickerButton('period', 'am', 'am', this.disabled || this.readonly),
        this.genPickerButton('period', 'pm', 'pm', this.disabled || this.readonly)
      ])
    }
  },
  render (h) {
    const children = [this.genTime()]
    this.ampm && children.push(this.genAmPm())
    return h('div', {
      staticClass: 'er-time-picker-title'
    }, children)
  }
}
