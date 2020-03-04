import { daysOfWeek, months } from '../../../functions/helper'
import Mixin from './mixin'

const transformDate = date => {
  return date ? new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ) : new Date()
}

export default {
  name: 'calendar',
  mixins: [ Mixin ],
  data: () => ({
    pre: 'er-date-picker',
    today: null,
    monitoredMonth: -1,
    isSelectedRange: false
  }),
  props: {
    value: null,
    disabledDate: {
      type: [Function, String]
    }
  },
  computed: {
    getDays () {
      const days = []
      const year = this.monitoredYear
      const month = this.monitoredMonth
      const time = new Date(year, month, 1)
      const dayOfBeginWeek = 1
      // Устанавливаем последний день предыдущего месяца
      time.setDate(0)
      let lastDay = time.getDate()
      const dayOfWeek = time.getDay() || 7
      let count = dayOfBeginWeek <= dayOfWeek
        ? dayOfWeek - dayOfBeginWeek + 1
        : dayOfWeek - dayOfBeginWeek + 8
      while (count > 0) {
        days.push({
          day: lastDay - count + 1,
          month: month > 0 ? month - 1 : 11,
          year: month > 0 ? year : year - 1,
          isPrevious: true
        })
        count--
      }
      // Устанавливаем последний день текущего месяца
      time.setMonth(time.getMonth() + 2, 0)
      lastDay = time.getDate()
      for (let i = 1; i <= lastDay; i++) {
        days.push({
          day: i,
          month: month,
          year: year
        })
      }
      for (let i = 1; days.length < 42; i++) {
        days.push({
          day: i,
          month: month < 11 ? month + 1 : 0,
          year: month < 11 ? year : year + 1,
          isNext: true
        })
      }
      return days
    },
    getMonthByNumber () {
      return months[this.monitoredMonth]
    },
    isRange () {
      return this._.isArray(this.value)
    },
    internalValue () {
      return this.value
        ? this.isRange
          ? [
            transformDate(this._.head(this.value)),
            transformDate(this._.last(this.value))
          ]
          : transformDate(this.value)
        : null
    }
  },
  watch: {
  },
  methods: {
    generateHead () {
      return this.$createElement('div', {
        staticClass: 'er-date-picker__calendar__head'
      }, [
        this.$createElement('div', {
          staticClass: 'er-date-picker__calendar__month'
        }, [
          this.$createElement('div', {
            staticClass: 'prev',
            attrs: {
              'data-direction': 'prev'
            },
            on: { click: this.onChangeMonth }
          }, [
            this.$createElement('er-icon', { props: { name: 'corner_down' } })
          ]),
          this.$createElement('div', { staticClass: 'value' }, [
            this.getMonthByNumber?.name
          ]),
          this.$createElement('div', {
            staticClass: 'next',
            attrs: {
              'data-direction': 'next'
            },
            on: { click: this.onChangeMonth }
          }, [
            this.$createElement('er-icon', { props: { name: 'corner_down' } })
          ])
        ]),
        this.$createElement('div', {
          staticClass: 'er-date-picker__calendar__year'
        }, [
          ...this.generateSwitchYear()
        ])
      ])
    },
    generateBody () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__calendar__body`
      }, [
        this.generateDaysOfWeek(),
        this.generateDays()
      ])
    },
    generateDayOfWeek (day, dayOfWeek) {
      return this.$createElement('div', {
        staticClass: `${this.pre}__calendar__day-of-week`,
        class: {
          'weekend': [5, 6].includes(dayOfWeek)
        }
      }, [ day ])
    },
    generateDaysOfWeek () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__calendar__days-of-week`
      }, daysOfWeek.map((day, i) => this.generateDayOfWeek(day, i)))
    },
    generateDays () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__calendar__days`
      }, this.getDays.map(day => this.generateDay(day)))
    },
    generateDay (day) {
      const date = new Date(day.year, day.month, day.day)
      const isSelected = this.isRange
        ? +date === +this._.head(this.internalValue) ||
        +date === +this._.last(this.internalValue)
        : +date === +this.internalValue
      return this.$createElement('div', {
        staticClass: `${this.pre}__calendar__day`,
        class: {
          range: this.isRange && !day.isPrevious && !day.isNext
            ? +date >= +this._.head(this.internalValue) &&
              +date <= +this._.last(this.internalValue)
            : false,
          'first-day': day.day === 1,
          'last-day': day.day === (new Date(day.year, day.month + 1, 0)).getDate()
        }
      }, [
        !day.isPrevious && !day.isNext && this.$createElement('div', {
          staticClass: 'content',
          class: {
            selected: isSelected,
            disabled: typeof this.disabledDate === 'string'
              ? this.disabledDate === 'future'
                ? +(new Date()) < +date
                : this.disabledDate === 'past'
                  ? +(new Date()) > +date
                  : false
              : this.disabledDate(date)
          },
          attrs: {
            'data-day': day.day,
            'data-month': day.month,
            'data-year': day.year
          },
          on: {
            click: this.onSelectedDate
          }
        }, [
          day.day
        ])
      ])
    },
    onChangeMonth (e) {
      const direction = e.target.closest('div').dataset.direction
      if (direction === 'prev') {
        if (this.monitoredMonth > 0) {
          this.monitoredMonth--
        } else {
          this.monitoredMonth = 11
          this.monitoredYear--
        }
      } else {
        if (this.monitoredMonth < 11) {
          this.monitoredMonth++
        } else {
          this.monitoredMonth = 0
          this.monitoredYear++
        }
      }
    },
    onSelectedDate (e) {
      if (e.target.classList.contains('disabled')) return
      const day = +e.target.dataset.day
      const month = +e.target.dataset.month
      const year = +e.target.dataset.year
      const date = new Date(year, month, day)
      if (this.isRange) {
        const value = this.value
        if (this.isSelectedRange) {
          +date < +value[0]
            ? this.$emit('input', [
              date, value[0]
            ])
            : this.$emit('input', [
              value[0], date
            ])
          this.isSelectedRange = false
        } else {
          +date < +value[1]
            ? this.$emit('input', [
              date,
              value[1]
            ])
            : this.$emit('input', [
              value[1], date
            ])
          this.isSelectedRange = true
        }
      } else {
        this.$emit('input', new Date(year, month, day))
      }
    }
  },
  mounted () {
    this.today = new Date()
    this.monitoredMonth = this.today.getMonth()
    this.monitoredYear = this.today.getFullYear()
  },
  render (h) {
    return h('div', {
      staticClass: `${this.pre}__calendar`
    }, [
      this.generateHead(),
      this.generateBody()
    ])
  }
}
