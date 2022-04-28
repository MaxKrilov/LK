import './_style.scss'

import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'

const FORMAT_DATE = 'DD.MM.YYYY'
const FORMAT_TIME = 'HH:mm'

@Component({
  props: {
    ip: String,
    start: [Number, Date],
    end: [Number, Date],
    bytes: Number,
    type: String
  }
})
export default class InternetStatisticComponent extends Vue {
  // Props
  readonly ip!: string
  readonly start!: number
  readonly end!: number
  readonly bytes!: number
  readonly type!: string
  // Computed
  get computedStartDate () {
    return moment(this.start).format(FORMAT_DATE)
  }
  get computedStartTime () {
    return moment(this.start).format(FORMAT_TIME)
  }
  get computedEndDate () {
    return moment(this.end).format(FORMAT_DATE)
  }
  get computedEndTime () {
    return moment(this.end).format(FORMAT_TIME)
  }
  get computedStartDateNTime () {
    return moment(this.start).format(`${FORMAT_DATE} ${FORMAT_TIME}`)
  }
  get htmlIP () {
    return `
      <span class="start">${this.computedStartDate}</span>
      <span class="ip">${this.ip}</span>
    `
  }
  get htmlPeriod () {
    return `
      <div><span class="date">${this.computedStartDate}</span>&nbsp;${this.computedStartTime}</div>
    `
  }
  get htmlVolume () {
    const tb = 2 ** 40
    const gb = 2 ** 30
    const mb = 2 ** 20
    const kb = 2 ** 10
    if (this.bytes >= tb) return `<span>${(this.bytes / tb).toFixed(1)}</span> ТБ`
    if (this.bytes >= gb) return `<span>${(this.bytes / gb).toFixed(1)}</span> ГБ`
    if (this.bytes >= mb) return `<span>${(this.bytes / mb).toFixed(1)}</span> МБ`
    if (this.bytes >= kb) return `<span>${(this.bytes / kb).toFixed(1)}</span> КБ`
    return `<span>${this.bytes}</span> Б`
  }
  // Methods
  renderCeil (className: string, value: string | number) {
    return this.$createElement('div', {
      staticClass: 'internet-statistic-component__ceil',
      class: className,
      domProps: {
        innerHTML: value
      }
    })
  }
  // Hooks
  render (h: CreateElement): VNode {
    const rc = this.renderCeil
    return h('div', {
      staticClass: 'internet-statistic-component'
    }, [
      h('div', {
        staticClass: 'internet-statistic-component__content',
        class: ['main-content', 'main-content--h-padding']
      }, [
        rc('ip', this.htmlIP),
        rc('start', `<div><span class="date">${this.computedStartDate}</span>&nbsp;${this.computedStartTime}</div>`),
        rc('start', `<div><span class="date">${this.computedEndDate}</span>&nbsp;${this.computedEndTime}</div>`),
        rc('volume', this.htmlVolume),
        rc('type', this.type)
      ])
    ])
  }
}
