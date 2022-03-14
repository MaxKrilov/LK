import { mapActions, mapGetters, mapState } from 'vuex'
import { leadingZero } from '@/functions/filters'
import { dataLayerPush } from '../../../../functions/analytics'
import { parseDecimal } from '@/functions/helper2'
import MESSAGES from '@/constants/messages.ts'
import { TYPES as BUNDLE_TYPES } from '@/store/actions/bundles'
import BillingAccountMixin from '@/mixins/BillingAccountMixin.ts'

import ErToastStack from '@/components/blocks/ErToastStack/index'
import ErDocumentViewer from '../../../blocks/ErDocumentViewer/index.vue'
import ErActivationModal from '../../../blocks/ErActivationModal/index'
import PackageItem from './blocks/PackageItem/index.vue'
import ServiceFolder from './blocks/ServiceFolder/index.vue'
import ServiceList from './blocks/ServiceList/index.vue'
import OfficeList from './blocks/OfficeList/index.vue'
import DirectorFeedback from '../SupportPages/blocks/DirectorFeedback/index'

const IS_ENABLED_AUTOPAY = '9149184122213604836'

export default {
  name: 'index-page',
  mixins: [ BillingAccountMixin ],
  components: {
    PackageItem,
    ServiceList,
    OfficeList,
    ServiceFolder,
    ErDocumentViewer,
    ErToastStack,
    ErActivationModal,
    DirectorFeedback
  },
  data: () => ({
    MESSAGES,
    pre: 'index-page',
    isOpenFilter: false,
    isOpenImpressionForm: false,
    isLoadedPackList: false,
    isPointFiltrationRalized: false, // готова ли фильтрация по точкам?
    modelSortService: 'service',
    modelFilterService: '',
    dataFilterSwitch: [
      { label: 'По офисам', value: 'office' },
      { label: 'По пакетам', value: 'packs' },
      { label: 'По услугам', value: 'service' }
    ],
    tmpActive: false,
    isOpenViewer: false,
    trackerIntervalPromisePay: 1,
    idIntervalPromisePay: 0,
    isNotAccessInvPayment: false,
    emptyDocument: {
      id: '',
      bucket: '',
      fileName: '',
      filePath: '',
      type: { id: '', name: '' }
    }
  }),
  computed: {
    currentFilterLabel () {
      return this.dataFilterSwitch?.find(el => el.value === this.modelSortService)?.label || 'без фильтрации'
    },
    getCarouselItem () {
      // todo Переделать после реализации админ-панели
      return [ 'slide_1', 'slide_2' ].map(item => this.$createElement('div', {
        staticClass: `${this.pre}__carousel__item`
      }, [
        this.$createElement('picture', [
          this.$createElement('source', {
            attrs: {
              srcset: require(`@/assets/images/carousel/${item}/1200.png`),
              media: '(min-width: 1200px)'
            }
          }),
          this.$createElement('source', {
            attrs: {
              srcset: require(`@/assets/images/carousel/${item}/960.png`),
              media: '(min-width: 960px)'
            }
          }),
          this.$createElement('source', {
            attrs: {
              srcset: require(`@/assets/images/carousel/${item}/640.png`),
              media: '(min-width: 640px)'
            }
          }),
          this.$createElement('source', {
            attrs: {
              srcset: require(`@/assets/images/carousel/${item}/480.png`),
              media: '(min-width: 480px)'
            }
          }),
          this.$createElement('source', {
            attrs: {
              srcset: require(`@/assets/images/carousel/${item}/320.png`),
              media: '(min-width: 0)'
            }
          }),
          this.$createElement('img', { attrs: { src: require(`@/assets/images/carousel/${item}/1200.png`) } })
        ]),
        this.$createElement('er-button', [ 'Начать чат' ])
      ]))
    },
    ...mapState({
      clientName: state => state.user.clientInfo.name,
      invPaymentsForViewer: state => state.payments.listInvoicePayment,
      isPromisePay: state => state.payments.isHasPromisePayment,
      promisePayStart: state => state.payments.promisePayStart,
      promisePayEnd: state => state.payments.promisePayEnd,
      billingInfo: state => state.payments.billingInfo,
      activeBundleList: state => state.bundles.activeBundleList
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
      getCountUnsignedDocument: 'fileinfo/getCountUnsignedDocument',
      activeBundleGroupList: 'bundles/activeBundleGroupList',
      activeBillingAccount: 'payments/getActiveBillingAccount'
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
      if (!this.isPromisePay || !this.promisePayEnd || !this.promisePayStart) return 0
      const now = this.$moment()
      const start = this.promisePayStart
      const end = this.promisePayEnd
      return this.trackerIntervalPromisePay
        ? (now.unix() - start.unix()) / (end.unix() - start.unix()) * 100
        : 0
    },

    isAutopay () {
      return this.billingInfo?.paymentMethod?.id === IS_ENABLED_AUTOPAY
    },

    balance () {
      return this.billingInfo.hasOwnProperty('balance')
        ? 0 - Number(this.billingInfo.balance)
        : 0
    },
    computedListInvoiceDocument () {
      return [
        this.invPaymentsForViewer[this.activeBillingAccount] || this.emptyDocument
      ]
    }
  },
  methods: {
    ...mapActions({
      pullActiveBundles: `bundles/${BUNDLE_TYPES.PULL_ACTIVE_BUNDLES}`
    }),
    packGroupPrice (acc, el) {
      let price = parseDecimal(el.amount.value)

      if (Object.keys(el).includes('bundleDiscount')) {
        price -= parseDecimal(el.amount.bundleDiscount)
      }

      return acc + price
    },
    onChangeBillingAccountId () {
      this.fetchPackList()
    },
    fetchPackList () {
      this.isLoadedPackList = false
      this.pullActiveBundles()
        .then(() => {
          this.isLoadedPackList = true
        })
    },
    openFilterForm () {
      this.isOpenFilter = true
    },
    closeFilterForm () {
      this.isOpenFilter = false
    },
    clearModelFilterService () {
      this.modelFilterService = ''
    },
    openImpressionForm () {
      this.isOpenImpressionForm = true
    },
    onClickToast (id) {
      // ещё не реализовано
    },
    getEventsForInvPayments (on) {
      if (Number(this.billingInfo.balance) <= 0) {
        return {
          click: (e) => {
            e.preventDefault()
            this.isNotAccessInvPayment = true
          }
        }
      }
      return on
    },
    dataLayerPush (label) {
      dataLayerPush({ 'category': 'mainpage', 'action': 'click', label })
    }
  },
  watch: {
    isOpenViewer (val) {
      if (Number(this.billingInfo.balance) <= 0) {
        this.isNotAccessInvPayment = true
      } else if (
        val &&
        this.activeBillingAccount &&
        !(this.activeBillingAccount in this.invPaymentsForViewer)
      ) {
        this.$store.dispatch(`payments/getInvoicePayment`)
      }
    },
    activeBundleList (value) {
      if (!value.length) {
        this.dataFilterSwitch = this.dataFilterSwitch.filter(el => el.value !== 'packs')
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
        }, 1000 * 60)
      }
    },
    modelSortService (val) {
      dataLayerPush({
        category: 'mainpage',
        label: val === 'service'
          ? 'sortbyservice'
          : val === 'office'
            ? 'sortbyoffice'
            : 'sortbybundle'
      })
    },
    activeBillingAccount () {
      // Очищаем просмотрщик
      // this.$refs.viewer.currentDocumentFile = ''
      // this.$refs.viewer.currentDocument = this.emptyDocument
      // this.$refs.viewer.currentType = { documentId: '', id: '', name: '' }
    }
  }
}
