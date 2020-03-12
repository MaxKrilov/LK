import { mapState, mapGetters } from 'vuex'
import { price } from '../../../../functions/filters'
import ProductItemComponent from './blocks/ProductItemComponent/index.vue'

export default {
  name: 'index-page',
  components: {
    ProductItemComponent
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
    tmpActive: false
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
      balanceInfo: state => state.user.paymentInfo
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
      getCountRequestInWork: 'request/getCountRequestInWork',
      getCountUnsignedDocument: 'fileinfo/getCountUnsignedDocument'
    }),

    isEmptyListProduct () {
      return this.listProductByAddress.length === 0
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
    }
  }
}
