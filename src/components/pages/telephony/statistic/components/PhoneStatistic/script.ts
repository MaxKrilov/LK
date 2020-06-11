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
    product: String
  },
  watch: {
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

  // Data
  listStatistic: IBillingStatisticResponse[] = []
  // Data for sort
  sortField: typeSortOrder = ''
  sortOrder: 'asc' | 'desc' = 'asc'

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

    if (this.sortField === '') return this.listStatisticGroupByDate
    for (const key in this.listStatisticGroupByDate) {
      this.listStatisticGroupByDate[key].sort((a, b) => {
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

    return this.listStatisticGroupByDate
  }

  getStatistic () {
    const today = new Date()
    const beforeMonth = (new Date()).setDate((new Date()).getDate() - 29)
    this.$store.dispatch('internet/getStatistic', {
      fromDate: moment(beforeMonth).format(),
      toDate: moment(today).format(),
      productInstance: this.product
    })
      .then(response => { this.listStatistic = response })
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
