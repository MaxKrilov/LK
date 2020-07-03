import Vue from 'vue'
import Component from 'vue-class-component'
import ErTableFilter from '@/components/blocks/ErTableFilter'
import InternetStatisticComponent from './blocks/InternetStatisticComponent'
import { DocumentInterface, IBillingStatisticResponse, ICustomerProduct } from '@/tbapi'
import moment from 'moment'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import FileComponent from './blocks/FileComponent/index.vue'
import { Cookie } from '@/functions/storage'

const getHtmlVolume = (volume: number) => {
  const tb = 2 ** 40
  const gb = 2 ** 30
  const mb = 2 ** 20
  const kb = 2 ** 10
  if (volume >= tb) return `<span>${(volume / tb).toFixed(3)}</span> ТБ`
  if (volume >= gb) return `<span>${(volume / gb).toFixed(3)}</span> ГБ`
  if (volume >= mb) return `<span>${(volume / mb).toFixed(3)}</span> МБ`
  if (volume >= kb) return `<span>${(volume / mb).toFixed(3)}</span> КБ`
  return `<span>${volume}</span> Б`
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof StatisticPage>>({
  props: {
    customerProduct: {
      type: Object,
      default: null
    }
  },
  components: {
    ErTableFilter,
    InternetStatisticComponent,
    ErActivationModal,
    FileComponent
  },
  watch: {
    customerProduct (val) {
      if (val !== null) {
        this.$nextTick(() => {
          this.getStatistic()
        })
      }
    },
    period (val) {
      if (!this.customerProduct) return
      const diff = Math.abs(moment(val[0]).diff(val[1], 'days'))
      // Если меньше 30 дней, то перезапрашиваем данные
      if (diff < 30) {
        this.listStatistic = []
        this.isLoading = true
        this.getStatistic()
      } else { // В противном случае предлагаем скачать файл
        this.isShowDialogForFile = true
      }
    }
  }
})
export default class StatisticPage extends Vue {
  // Props
  readonly customerProduct!: ICustomerProduct | null
  /**
   * Список логинов и IP адресов
   */
  listLogin = []
  /**
   * Выбранный для показа статистики логин или IP адрес
   */
  currentLogin = null
  /**
   * Период для показа статистики (по-умолчанию - последний месяц)
   */
  period: Date[] = []

  listStatistic: any[] = []

  isLoading = true
  isLoadingFile = false

  isShowDialogForFile = false
  isShowDialogForFileSuccess = false

  sortField = ''
  sortDirection = 'asc'

  // Getters Vuex
  readonly allOtherDocuments!: (DocumentInterface | DocumentInterface[])[]

  get getTloName () {
    return this.customerProduct?.tlo.name || ''
  }

  get getInternetTraffic () {
    const value = this.listStatistic.reduce((acc, item) => {
      return acc + (item.type.toLowerCase() === 'internet' ? item.bytes : 0)
    }, 0)
    return getHtmlVolume(value)
  }

  get computedListStatistic () {
    return this.listStatistic.sort((first, second) => {
      if (this.sortField === '') return 0
      if (!first.hasOwnProperty(this.sortField) || !second.hasOwnProperty(this.sortField)) return 0
      if (this.sortDirection === 'asc') {
        return first[this.sortField] < second[this.sortField]
          ? -1
          : first[this.sortField] > second[this.sortField]
            ? 1
            : 0
      } else {
        return first[this.sortField] < second[this.sortField]
          ? 1
          : first[this.sortField] > second[this.sortField]
            ? -1
            : 0
      }
    })
  }

  get getListFileStatistic () {
    return this.allOtherDocuments.filter((item: DocumentInterface | DocumentInterface[]) =>
      !Array.isArray(item) && item.fileName.indexOf('BPI') > 0 &&
        item.fileName.indexOf(this.customerProduct?.tlo.id || '') > 0)
  }

  getStatistic () {
    const fromDate = moment(this.period[0]!).format()
    const toDate = moment(this.period[1]!).format()
    this.isLoading = true
    this.$store.dispatch('internet/getStatistic', {
      fromDate,
      toDate,
      productInstance: this.customerProduct!.tlo.id,
      eventSource: this.customerProduct!.tlo.chars?.['Идентификатор сервиса'] || ''
    })
      .then((response: IBillingStatisticResponse[]) => {
        this.listStatistic = response.map(item => ({
          ip: item.service,
          start: item.createdDate,
          bytes: Number(item.duration),
          type: item.priceEventSpecification.name
        }))
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  getFileStatistic () {
    const fromDate = moment(this.period[0]!).toISOString()
    const toDate = moment(this.period[1]!).toISOString()
    this.isLoadingFile = true
    this.$store.dispatch('internet/getFileStatistic', {
      fromDate,
      toDate,
      productInstance: this.customerProduct!.tlo.id
    })
      .then((response: any) => {
        this.isShowDialogForFileSuccess = true
        Cookie.set('is-loading', '1', { expires: 30 * 24 * 60 * 60 })
        Cookie.set('statistic-file', response.fileName, { expires: 30 * 24 * 60 * 60 });
        (this as any).setIntervalForFile()
      })
      .finally(() => {
        this.isShowDialogForFile = false
        this.isLoadingFile = false
      })
  }

  setIntervalForFile () {
    this.$store.commit('timer/setInterval', {
      id: 'GET_FILE_STATISTIC',
      delay: 5000,
      cb: () => {
        this.$store.dispatch('fileinfo/downloadListDocument', { api: this.$api })
          .then(() => {
            const fileName = Cookie.get('statistic-file')
            const findingDocument = this.allOtherDocuments.find(document =>
              !Array.isArray(document) && document.fileName === fileName)
            if (findingDocument) {
              Cookie.remove('statistic-file')
              Cookie.remove('is-loading')
              this.$store.commit('timer/clearInterval', 'GET_FILE_STATISTIC')
            }
          })
      }
    })
  }

  sortBy (field: string, direction: string) {
    this.sortField = field
    this.sortDirection = direction
  }

  mounted () {
    const today = new Date()
    const beforeMonth = new Date()
    // TBAPI возвращает только до 30 дней. В противном случае надо запрашивать файл
    beforeMonth.setDate(beforeMonth.getDate() - 29)
    this.period = [
      beforeMonth,
      today
    ]
  }
}
