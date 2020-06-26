import { mapState, mapGetters } from 'vuex'
import { leadingZero, price } from '../../../../functions/filters'
import ProductItemComponent from './blocks/ProductItemComponent/index.vue'
import ErDocumentViewer from '../../../blocks/ErDocumentViewer/index.vue'
import ErToastStack from '@/components/blocks/ErToastStack/index'
import ErActivationModal from '../../../blocks/ErActivationModal/index'

export default {
  name: 'index-page',
  components: {
    ProductItemComponent,
    ErDocumentViewer,
    ErToastStack,
    ErActivationModal
  },
  data: () => ({
    pre: 'index-page',
    isOpenFilter: false,
    modelSortService: 'service',
    modelFilterService: '',
    dataFilterSwitch: [
      { label: 'По офисам', value: 'office' },
      { label: 'По услугам', value: 'service' }
    ],
    tmpActive: false,
    isOpenViewer: false,
    trackerIntervalPromisePay: 1,
    idIntervalPromisePay: 0,
    isNotAccessInvPayment: false
  }),
  computed: {
    getCarouselItem () {
      // todo Переделать после реализации админ-панели
      return ['slide_1', 'slide_2'].map(item => this.$createElement('div', {
        staticClass: `${this.pre}__carousel__item`
      }, [
        this.$createElement('picture', [
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/1200.png`), media: '(min-width: 1200px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/960.png`), media: '(min-width: 960px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/640.png`), media: '(min-width: 640px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/480.png`), media: '(min-width: 480px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/320.png`), media: '(min-width: 0)' } }),
          this.$createElement('img', { attrs: { src: require(`@/assets/images/carousel/${item}/1200.png`) } })
        ]),
        this.$createElement('er-button', ['Начать чат'])
      ]))
    },
    ...mapState({
      clientName: state => state.user.clientInfo.name,
      balanceInfo: state => state.user.paymentInfo,
      invPaymentsForViewer: state => state.payments.invPaymentsForViewer,
      isPromisePay: state => state.user.isPromisePay,
      promisePayStart: state => state.user.promisePayStart,
      promisePayEnd: state => state.user.promisePayEnd
    }),
    ...mapGetters({
      listProductByAddress: 'user/getListProductByAddress',
      listProductByService: 'user/getListProductByService',
      indexPageProductByAddress: 'loading/indexPageProductByAddress',
      loadingClientInfo: 'loading/clientInfo',
      menuComponentBalance: 'loading/menuComponentBalance',
      loadingDocuments: 'loading/loadingDocuments',
      loadingRequest: 'loading/loadingRequest',
      loadingPromisedPayment: 'loading/loadingPromisedPayment',
      loadingInvoiceForPayment: 'loading/loadingInvoiceForPayment',
      getCountRequestInWork: 'request/getCountRequestInWork',
      getCountUnsignedDocument: 'fileinfo/getCountUnsignedDocument'
    }),

    isEmptyListProduct () {
      return this.listProductByAddress.length === 0
    },

    getToDatePromisePay () {
      if (!this.isPromisePay) return { day: '', hour: '', minute: '' }
      const current = this.$moment()
      const diff = this.promisePayEnd.diff(current)
      const duration = this.$moment.duration(diff)
      return {
        day: this.trackerIntervalPromisePay ? leadingZero(duration.days(), 2) : '0',
        hour: this.trackerIntervalPromisePay ? leadingZero(duration.hours(), 2) : '0',
        minute: this.trackerIntervalPromisePay ? leadingZero(duration.minutes(), 2) : '0'
      }
    },

    getWidthPromisePayLine () {
      if (!this.isPromisePay) return 0
      const current = this.$moment()
      return this.trackerIntervalPromisePay
        ? (1 - (current - this.promisePayStart) / (this.promisePayEnd - this.promisePayStart)) * 100
        : 0
    }
  },
  filters: {
    sortBy: val => val === 'service' ? 'По услугам' : 'По офисам',
    price
  },
  methods: {
    openFilterForm () {
      this.isOpenFilter = true
    },
    closeFilterForm () {
      this.isOpenFilter = false
    },
    clearModelFilterService () {
      this.modelFilterService = ''
    },
    onClickToast (id) {
      // ещё не реализовано
    },
    getEventsForInvPayments (on) {
      if (Number(this.balanceInfo.balance) >= 0) {
        return {
          click: (e) => {
            e.preventDefault()
            this.isNotAccessInvPayment = true
          }
        }
      }
      return on
    }
  },
  watch: {
    isOpenViewer (val) {
      if (Number(this.balanceInfo.balance) >= 0) {
        this.isNotAccessInvPayment = true
      } else if (val && this.invPaymentsForViewer[0].filePath === '') {
        this.$store.dispatch(`payments/invPayment`, { api: this.$api })
      }
    },
    isPromisePay (val) {
      if (val) {
        this.idIntervalPromisePay = setInterval(() => {
          this.trackerIntervalPromisePay === 1
            ? this.trackerIntervalPromisePay++
            : this.trackerIntervalPromisePay--
          const current = this.$moment().unix()
          const end = this.promisePayEnd.unix()
          if (current >= end) {
            clearInterval(this.idIntervalPromisePay)
          }
        }, 1000)
      }
    }
  }
}
