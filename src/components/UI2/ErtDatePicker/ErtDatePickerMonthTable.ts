import DatePickerTable from './mixins/date-picker-table'

import { pad, createNativeLocaleFormatter } from './utils'

import { VNode } from 'vue'
import Component, { mixins } from 'vue-class-component'
import { DatePickerFormatter } from '@/types'

@Component
export default class ErtDatePickerMonthTable extends mixins(DatePickerTable) {
  // Computed
  get formatter (): DatePickerFormatter {
    return this.format ||
      createNativeLocaleFormatter(
        'ru',
        { month: 'short', timeZone: 'UTC' },
        { start: 5, length: 2 }
      )
  }

  // Methods
  calculateTableDate (delta: number) {
    return `${parseInt(this.tableDate, 10) + Math.sign(delta || 1)}`
  }
  genTBody () {
    const children = []
    const cols = Array(3).fill(null)
    const rows = 12 / cols.length

    for (let row = 0; row < rows; row++) {
      const tds = cols.map((_, col) => {
        const month = row * cols.length + col
        const date = `${this.displayedYear}-${pad(month + 1)}`
        return this.$createElement('td', {
          key: month
        }, [
          this.genButton(date, false, 'month', this.formatter)
        ])
      })

      children.push(this.$createElement('tr', {
        key: row
      }, tds))
    }

    return this.$createElement('tbody', children)
  }

  render (): VNode {
    return this.genTable(
      'ert-date-picker-table ert-date-picker-table--month',
      [ this.genTBody() ],
      this.calculateTableDate
    )
  }
}
