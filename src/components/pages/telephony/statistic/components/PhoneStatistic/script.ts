import { Vue, Component } from 'vue-property-decorator'
import ConnectionRow from '../ConnectionRow/index.vue'
import TBodyCollapser from '../TBodyCollapser/index.vue'
import ErTableFilter from '@/components/blocks/ErTableFilter/index'
import moment from 'moment'
import { IBillingStatisticResponse } from '@/tbapi'
import { head, last } from 'lodash'

const components = {
  ConnectionRow,
  ErTableFilter,
  'tbody-collapser': TBodyCollapser
}

type typeSortOrder = '' | 'date' | 'phone' | 'duration' | 'price' | 'price2'

const getFieldByName = (name: typeSortOrder) => {
  switch (name) {
    case 'date':
      return 'createdDate'
    case 'phone':
      return 'calledNumber'
    case 'duration':
      return 'duration'
    case 'price':
      return 'prebillingCost'
    case 'price2':
      return 'billedCost'
    default:
      return ''
  }
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof PhoneStatistic>>({
  components,
  props: {
    isOpened: Boolean,
    product: String,
    number: String
  },
  watch: {
    pagCurrentPage () {
      this.getStatistic()
    },
    isOpened (val) {
      if (val && this.listStatistic.length === 0) {
        this.getStatistic()
      }
    }
  }
})
export default class PhoneStatistic extends Vue {
  readonly isOpened!: boolean
  readonly product!: string
  readonly number!: string

  // Data
  listStatistic: IBillingStatisticResponse[] = []
  // Data for sort
  sortField: typeSortOrder = ''
  sortOrder: 'asc' | 'desc' = 'asc'

  pagCurrentPage = 1
  pagLength = 1
  loadingStatistic = true

  listPhoneType: string[] = ['Исходящий', 'Входящий', 'Все']
  modelPhoneType: string = 'Все'
  modelPeriod: Date[] = [
    new Date(moment((new Date()).setDate((new Date()).getDate() - 29)).format()),
    new Date()
  ]

  // Computed
  get listStatisticGroupByDate () {
    return this.listStatistic.reduce((acc, item) => {
      const date = moment(item.createdDate).format('DD MMM YYYY')
      if (!acc.hasOwnProperty(date)) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    }, {} as Record<string, IBillingStatisticResponse[]>)
  }

  get listSortingStaticGroupByDate () {
    const getValue = (variable: any) => {
      return this.sortField === 'duration'
        ? Number(variable[getFieldByName(this.sortField)])
        : variable[getFieldByName(this.sortField)]
    }

    // Фильтрация
    const filterList: Record<string, IBillingStatisticResponse[]> = {}
    for (const date in this.listStatisticGroupByDate) {
      if (!this.listStatisticGroupByDate.hasOwnProperty(date)) continue

      filterList[date] = this.listStatisticGroupByDate[date].filter(statisticItem => {
        return statisticItem.createdDate >= +head(this.modelPeriod)! &&
          statisticItem.createdDate <= +last(this.modelPeriod)! &&
          this.modelPhoneType === 'Все'
          ? true
          : this.modelPhoneType === 'Исходящий'
            ? [1, 3, 4].includes(statisticItem.priceEventSpecification.eventTypeId)
            : statisticItem.priceEventSpecification.eventTypeId === 2
      })
    }

    // Сортировка
    if (this.sortField === '') return filterList
    for (const key in filterList) {
      if (filterList.hasOwnProperty(key)) {
        filterList[key].sort((a, b) => {
          const valueA = getValue(a)
          const valueB = getValue(b)
          if (typeof valueA === 'undefined' || typeof valueB === 'undefined') {
            return 0
          }
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA
          }
          return this.sortOrder === 'asc'
            ? (valueA as string).localeCompare(valueB as string)
            : (valueB as string).localeCompare(valueA as string)
        })
      }
    }

    return filterList
  }

  disabledDateCallback (date: Date) {
    const _date = moment(date)
    return _date > moment() || _date < moment().subtract(29, 'days')
  }

  getStatistic () {
    const today = new Date()
    this.loadingStatistic = true

    const beforeMonth = (new Date()).setDate((new Date()).getDate() - 29)
    this.$store.dispatch('internet/getStatistic', {
      fromDate: moment(beforeMonth).format(),
      toDate: moment(today).format(),
      page: this.pagCurrentPage,
      productInstance: this.product,
      eventSource: this.number.replace(/[\D]+/g, '')
    })
      .then((response: {requests: IBillingStatisticResponse[], range: string}) => {
        this.listStatistic = response.requests
        const m = response.range?.match(/^(?:items )?(\d+)-(\d+)\/(\d+|\*)$/)
        this.pagLength = Math.trunc(+m![3] / 25) + 1
        this.loadingStatistic = false
      })
  }

  setSort (sortField: typeSortOrder) {
    if (sortField === this.sortField) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortField = sortField
      this.sortOrder = 'asc'
    }
  }

  currentPhonePage = 1
}
