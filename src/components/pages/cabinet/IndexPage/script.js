import { mapState, mapGetters } from 'vuex'
import { price } from '../../../../functions/filters'
import ProductItemComponent from './blocks/ProductItemComponent/index.vue'
import ErDocumentViewer from '../../../blocks/ErDocumentViewer/index.vue'
import ErToastStack from '@/components/blocks/ErToastStack/index'

export default {
  name: 'index-page',
  components: {
    ProductItemComponent,
    ErDocumentViewer,
    ErToastStack
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
    isOpenViewer: false
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
      promisePayInterval: state => state.payments.promisePayInterval,
      isPromisePay: state => state.payments.isPromisePay
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
      const dateTo = this.$moment(this.promisePayInterval)
      const current = this.$moment()
      return {
        day: dateTo.diff(current, 'days'),
        hour: dateTo.diff(current, 'hours'),
        minute: dateTo.diff(current, 'minutes')
      }
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
    }
  },
  watch: {
    isOpenViewer (val) {
      if (val && this.invPaymentsForViewer[0].filePath === '') {
        this.$store.dispatch(`payments/invPayment`, { api: this.$api })
      }
    }
  }
}
