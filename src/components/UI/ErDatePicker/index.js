import './_style.scss'
import Calendar from './calendar'
import Report from './report'
import { getScreenWidth } from '../../../functions/helper'
export default {
  name: 'er-date-picker',
  components: {
    Calendar,
    Report
  },
  data: () => ({
    pre: 'er-date-picker',
    isMobile: false,
    tag: 'er-menu', // todo change on er-menu
    isOpenDialog: false,
    typeOfCalendar: 'calendar',
    /**
     * @param {Date}
     */
    internalValue: null,
    isShowNotificationPicker: null
  }),
  props: {
    value: null,
    placeholder: String,
    separator: {
      type: String,
      default: ' - '
    },
    disabledDate: {
      type: [Function, String],
      default: () => false
    },
    format: {
      type: String,
      default: 'DD.MM.YYYY'
    },
    rules: {
      type: Array,
      default: () => []
    },
    isShowRequiredLabel: Boolean,
    isHidePeriodBlock: Boolean,
    hasAnalytics: Boolean
  },
  computed: {
    valueForTextInput () {
      return this._.isArray(this.value)
        ? this._.isEmpty(this.value)
          ? ''
          : `${this.$moment(this._.head(this.value)).format(this.format)}${this.separator}${this.$moment(this._.last(this.value)).format(this.format)}`
        : !this.value
          ? ''
          : this.$moment(this.value).format(this.format)
    }
  },
  watch: {
    value (val) {
      if (this._.isArray(val) && this._.isEmpty(val)) {
        this.internalValue = [ new Date(), new Date() ]
      } else if (!val) {
        this.internalValue = new Date()
      } else {
        this.internalValue = val
      }

      const diff = Math.abs(this.$moment(this.internalValue[0]).diff(this.internalValue[1], 'days')) + 1
      this.isShowNotificationPicker = (diff <= 2)
      this.$emit('showNotification', this.isShowNotificationPicker)
    },
    isOpenDialog (val) {
      if (val) {
        if (this._.isArray(this.value) && this._.isEmpty(this.value)) {
          this.internalValue = [ new Date(), new Date() ]
        } else if (!this._.isArray(this.value) && !this.value) {
          this.internalValue = new Date()
        }
      }
    }
  },
  methods: {
    generateActivator (props) {
      return this.$createElement('er-text-field', {
        props: {
          label: this.placeholder,
          appendInnerIcon: 'calendar',
          autocomplete: 'off',
          readonly: true,
          value: this.valueForTextInput,
          isShowRequiredLabel: this.isShowRequiredLabel,
          isShowNotificationPicker: this.isShowNotificationPicker,
          rules: this.rules

        },
        on: props.on,
        ref: 'input'
      })
    },
    generateTextSlider () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__head__slider`
      }, [
        this.$createElement('div',
          { staticClass: `${this.pre}__head__slider-item` },
          [
            this.$createElement('a', {
              attrs: {
                'data-type': 'calendar',
                'data-ga-category': this.hasAnalytics ? 'documents' : null,
                'data-ga-label': this.hasAnalytics ? 'calendarrandom' : null
              },
              on: {
                click: this.onChangeTypeCalendar
              }
            }, '???????????????????????? ????????????')
          ]
        ),
        this._.isArray(this.internalValue) && !this.isHidePeriodBlock && this.$createElement('div',
          { staticClass: `${this.pre}__head__slider-item` },
          [
            this.$createElement('a', {
              attrs: {
                'data-type': 'report',
                'data-ga-category': this.hasAnalytics ? 'documents' : null,
                'data-ga-label': this.hasAnalytics ? 'calendarreporting' : null
              },
              on: {
                click: this.onChangeTypeCalendar
              }
            }, '???????????????? ????????????')
          ]
        )
      ])
    },
    generateDate (date) {
      const dateMoment = this.$moment(date)
      return this.$createElement('div', {
        staticClass: `${this.pre}__head__date`
      }, [
        this.$createElement('div', { staticClass: 'day' }, dateMoment.format('DD')),
        this.$createElement('div', { staticClass: 'month' }, `.${dateMoment.format('MM')}`),
        this.$createElement('div', { staticClass: 'year' }, dateMoment.format('YYYY'))
      ])
    },
    generateHeadTitle () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__head__title`
      }, this.typeOfCalendar === 'calendar'
        ? this.generateHeadTitleForCalendar()
        : this.generateHeadTitleForReport()
      )
    },
    generateHeadTitleForCalendar () {
      return this._.isArray(this.internalValue)
        ? [
          this.generateDate(this._.head(this.internalValue)),
          '-',
          this.generateDate(this._.last(this.internalValue))
        ]
        : [ this.generateDate(this.internalValue) ]
    },
    generateHeadTitleForReport () {
      let number, period, year
      if (this._.head(this.internalValue).getFullYear() !== this._.last(this.internalValue).getFullYear()) {
        return this.generateHeadTitleForCalendar()
      }
      year = this._.head(this.internalValue).getFullYear()
      const dayBegin = this._.head(this.internalValue).getDate()
      const dayEnd = this._.last(this.internalValue).getDate()
      const monthBegin = this._.head(this.internalValue).getMonth()
      const monthEnd = this._.last(this.internalValue).getMonth()
      if (dayBegin !== 1) {
        return this.generateHeadTitleForCalendar()
      }
      if (monthBegin === 0 && dayEnd === 31 && monthEnd === 2) {
        number = '01'
        period = '??????????????'
      } else if (monthBegin === 3 && dayEnd === 30 && monthEnd === 5) {
        number = '02'
        period = '??????????????'
      } else if (monthBegin === 6 && dayEnd === 30 && monthEnd === 8) {
        number = '03'
        period = '??????????????'
      } else if (monthBegin === 9 && dayEnd === 31 && monthEnd === 11) {
        number = '04'
        period = '??????????????'
      } else if (monthBegin === 0 && dayEnd === 30 && monthEnd === 5) {
        number = '01'
        period = '??????????????????'
      } else if (monthBegin === 6 && dayEnd === 31 && monthEnd === 11) {
        number = '02'
        period = '??????????????????'
      } else if (monthBegin === 0 && dayEnd === 31 && monthEnd === 11) {
        number = ''
        period = '??????'
      }
      if (period) { // ?????????????????? ???????????? ???? ??????????????, ??.??. number ?????????? ???????? ???????????? ??????????????
        return [
          this.$createElement('div', {
            staticClass: `${this.pre}__head__date`
          }, [
            this.$createElement('div', { staticClass: 'day' }, number),
            this.$createElement('div', { staticClass: 'month', domProps: { innerHTML: `&nbsp;${period}` } }),
            this.$createElement('div', { staticClass: 'year' }, year)
          ])
        ]
      }
      return this.generateHeadTitleForCalendar()
    },
    generateWrapper () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__wrapper`
      }, [
        this.$createElement('div', {
          staticClass: `${this.pre}__head`
        }, [
          this.generateTextSlider(),
          this.generateHeadTitle()
        ]),
        this.$createElement('div', {
          staticClass: `${this.pre}__body`
        }, [
          this.$createElement(this.typeOfCalendar === 'calendar' ? 'calendar' : 'report', {
            props: {
              value: this.internalValue,
              disabledDate: this.disabledDate
            },
            on: {
              input: e => { this.internalValue = e }
            }
          })
        ]),
        this.generateFooter()
      ])
    },
    generateFooter () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__footer`
      }, [
        this.$createElement('er-button', {
          on: {
            click: this.onConfirm
          }
        }, '????'),
        this.$createElement('er-button', {
          props: {
            flat: true
          },
          on: {
            click: this.onCancel
          }
        }, '????????????')
      ])
    },
    onConfirm () {
      this.$emit('input', this.internalValue)
      this.isOpenDialog = false
    },
    onCancel () {
      this.internalValue = this.value
      this.isOpenDialog = false
    },
    onChangeTypeCalendar (e) {
      e.preventDefault()
      this.typeOfCalendar = e.target.dataset.type
    }
  },
  created () {
    this.isMobile = getScreenWidth() < 640
    this.isMobile && (this.tag = 'er-dialog')
    this.internalValue = this.value
  },
  render (h) {
    const scopedSlots = {
      activator: props => this.generateActivator(props)
    }
    const options = this.isMobile
      ? {
        props: {
          fullscreen: true,
          transition: 'dialog-bottom-transition',
          value: this.isOpenDialog
        },
        on: {
          input: () => { this.isOpenDialog = true }
        }
      } : {
        props: {
          value: this.isOpenDialog,
          offsetY: true,
          closeOnContentClick: false,
          maxWidth: 352
        },
        on: {
          input: () => { this.isOpenDialog = true }
        }
      }
    return h('div', {
      staticClass: this.pre
    }, [
      h(this.tag, {
        scopedSlots,
        ...options
      }, [
        this.generateWrapper()
      ])
    ])
  }
}
