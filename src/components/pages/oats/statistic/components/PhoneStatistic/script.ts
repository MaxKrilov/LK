import { Vue, Component } from 'vue-property-decorator'
import ConnectionRow from '../ConnectionRow/index.vue'
import TBodyCollapser from '../TBodyCollapser/index.vue'
import ErTableFilter from '@/components/blocks/ErTableFilter/index'
import moment from 'moment'
import { IBillingStatisticResponse } from '@/tbapi'

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
    pagCurrentPage (val) {
      this.listStatistic = this.allStatistic[val - 1]
    },
    isOpened (val) {
      if (val && this.listStatistic.length === 0) {
        this.getStatistic(moment(this.modelPeriod[0]).format(),
          moment(this.modelPeriod[1]).add('days', 1).format(),
          this.modelPhoneType)
      }
    }
  }
})
export default class PhoneStatistic extends Vue {
  readonly isOpened!: boolean
  readonly product!: string
  readonly number!: string

  // Data
  allStatistic: IBillingStatisticResponse[][] = []
  listStatistic: IBillingStatisticResponse[] = []
  // Data for sort
  sortField: typeSortOrder = ''
  sortOrder: 'asc' | 'desc' = 'asc'

  pagCurrentPage = 1
  pagLength = 1
  statisticLength = 25
  loadingStatistic = true

  currentEventType = 'Все'

  listPhoneType: string[] = ['Входящие', 'Исходящие', 'Исходящие МГМН', 'Исходящие через сторонних операторов', 'Все']
  modelPhoneType: string = 'Все'
  modelPeriod: Date[] = [
    new Date(moment((new Date()).setDate((new Date()).getDate() - 29)).format()),
    new Date()
  ]

  // Computed
  get listStatisticGroupByDate () {
    return this.listStatistic.reduce((acc, item) => {
      const date = moment(item.createdDate, 'DD.MM.YYYY').format('DD MMM YYYY')
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

      filterList[date] = this.listStatisticGroupByDate[date]
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
    return _date > moment() || _date < moment().subtract(30, 'days')
  }

  onFilterButtonClick () {
    let phoneType: string = this.modelPhoneType
    if (phoneType === 'Исходящие') {
      phoneType = 'Исходящие местные телефонные звонки'
    } else if (phoneType === 'Входящие') {
      phoneType = 'Входящие телефонные звонки'
    } else if (phoneType === 'Исходящие МГМН') {
      phoneType = 'Исходящие телефонные звонки'
    } else if (phoneType === 'Исходящие через сторонних операторов') {
      phoneType = 'Исходящие телефонные звонки через сторонних операторов'
    }

    this.getStatistic(moment(this.modelPeriod[0]).format(),
      moment(this.modelPeriod[1]).add('days', 1).format(),
      phoneType)
  }

  getStatistic (dateFrom:string, dateTo:string, eventType?:string) {
    this.loadingStatistic = true
    this.pagCurrentPage = 1

    if (this.currentEventType !== eventType && eventType) {
      this.currentEventType = eventType
    }

    const getStatisticData: Record<string, string | number> = {
      fromDate: dateFrom,
      toDate: dateTo,
      productInstance: this.product,
      eventSource: this.number.replace(/[\D]+/g, '')
    }

    if (eventType === 'Исходящие') {
      eventType = 'Исходящие местные телефонные звонки'
    } else if (eventType === 'Входящие') {
      eventType = 'Входящие телефонные звонки'
    } else if (eventType === 'Исходящие МГМН') {
      eventType = 'Исходящие телефонные звонки'
    } else if (eventType === 'Исходящие через сторонних операторов') {
      eventType = 'Исходящие телефонные звонки через сторонних операторов'
    }

    if (eventType && eventType !== 'Все') getStatisticData.eventType = eventType

    this.$store.dispatch('internet/getStatistic', getStatisticData)
      .then((response: Record<string, IBillingStatisticResponse[]>) => {
        let result = Object.values(response)

        let allStatistic = result.reduce((a, c) => a.concat(c), [])

        allStatistic.sort((a, b) => Number(moment(a.createdDate, 'DD.MM.YYYY').format('x')) - Number(moment(b.createdDate, 'DD.MM.YYYY').format('x')))

        this.pagLength = Math.ceil(allStatistic.length / this.statisticLength)

        let currentIndex = 0
        let allStatisticLength = allStatistic.length
        this.allStatistic = []

        for (let currentPage = 0; currentPage < this.pagLength; currentPage++) {
          let statisticsLength = allStatisticLength > this.statisticLength ? this.statisticLength : allStatisticLength
          let currentStatistic = []

          for (let index = 0; index < statisticsLength; index++) {
            currentStatistic.push(allStatistic[currentIndex])
            currentIndex++
          }

          this.allStatistic.push(currentStatistic)
          allStatisticLength -= this.statisticLength
        }

        this.listStatistic = this.allStatistic.length === 0 ? [] : this.allStatistic[0]

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
