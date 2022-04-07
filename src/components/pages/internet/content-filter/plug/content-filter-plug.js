/**
 * Компонент для подключения КФ
 */
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { mapGetters } from 'vuex'
import { CODE_CONTENT_FILTER } from '@/constants/internet.ts'
import BreakpointMixin from '@/mixins/BreakpointMixin'
import ErActivationModal from '@/components/blocks/ErActivationModal/index'

export default {
  name: 'content-filter-plug-page',
  components: {
    ListPointComponent,
    ErActivationModal
  },
  props: {
    points: {
      default: []
    }
  },
  mixins: [BreakpointMixin],
  data () {
    return {
      detail: false,
      hideButtons: true,
      hoveredColumn: null,
      isShowDifferent: true,
      pre: 'content-filter-plug-page',
      prices: [],
      activePoint: {},
      offerId: '',
      isLoadingProduct: false,
      isShowModal: false,
      isShowErrorModal: false,
      isShowSuccessModal: false,
      selectedTariff: {},
      availableFunds: 0,
      offer: false,
      offerAcceptedOn: null,
      creatingOrder: false,
      sendingOrder: false,
      isShowMoneyModal: false,
      tariffs: [
        {
          id: 101161,
          name: 'Бизнес',
          price: '0',
          profileCount: '5',
          networkCount: '5',
          schedule: true,
          exportStatistics: true,
          personalPageLock: true,
          perodStorageStatistics: '1 год',
          modeAdblock: true,
          whiteListMode: true,
          advancedListMode: true,
          editCodePageLock: true,
          whiteListModeCount: '500',
          blackListModeCount: '500',
          safeModeSearch: true,
          chars: {},
          description: 'Стандартный Тариф для бизнеса. Позволяет сделать то и другое и может ещё и третье.',
          analyticLabel: 'cftarifbusinessselect'
        },
        {
          id: 101170,
          name: 'Бизнес+',
          price: '0',
          profileCount: '100',
          networkCount: '9',
          schedule: true,
          exportStatistics: true,
          personalPageLock: true,
          perodStorageStatistics: '2 года',
          modeAdblock: true,
          whiteListMode: true,
          advancedListMode: true,
          editCodePageLock: true,
          whiteListModeCount: '9999',
          blackListModeCount: '9999',
          chars: {},
          safeModeSearch: true,
          description: 'Расширенный Тариф для бизнеса. Позволяет сделать то и другое и может ещё и третье четвертое и пятое.',
          analyticLabel: 'cftarifbusinessplusselect'
        },
        {
          id: 101169,
          name: 'Школа',
          price: '0',
          profileCount: '10',
          networkCount: '10',
          schedule: true,
          exportStatistics: true,
          personalPageLock: true,
          perodStorageStatistics: '1 год',
          modeAdblock: true,
          whiteListMode: true,
          advancedListMode: true,
          editCodePageLock: false,
          whiteListModeCount: '200',
          blackListModeCount: '200',
          chars: {},
          safeModeSearch: true,
          description: 'Тариф для учебных заведений и школ. Одним из преимуществ «Поддержка белого списка для школ», согласно которому будет открыт доступ только для ресурсов образовательных учреждений. Сайты школ, ВУЗов, библиотек и т.д.',
          analyticLabel: 'cftarifschoolselect'
        }
      ]
    }
  },
  watch: {
    activePoint (val) {
      if (val) {
        this.getProduct(val.bpi)
      }
    },
    offer (val) {
      this.offerAcceptedOn = val ? this.$moment().format() : null
    }
  },
  computed: {
    ...mapGetters({
      billingAccountId: 'payments/getActiveBillingAccount'
    }),
    selectedPrice () {
      return this.selectedTariff.price || 0
    },
    selectedTariffName () {
      return this.selectedTariff?.chars?.['Имя тарифного плана'] || ''
    },
    transformTariffs () {
      if (this.tariffs.length < 1) {
        return [
          {
            propertyType: '',
            property: [],
            propertyName: ''
          }
        ]
      }
      const result = [
        {
          propertyType: 'name',
          propertyName: this.getTextOfProperty('name'),
          property: this.tariffs.map(e => e.name)
        },
        {
          propertyType: 'schedule',
          propertyName: this.getTextOfProperty('schedule'),
          property: this.tariffs.map(e => e.schedule)
        },
        {
          propertyType: 'personalPageLock',
          property: this.tariffs.map(e => e.personalPageLock),
          propertyName: this.getTextOfProperty('personalPageLock')
        },
        {
          propertyType: 'exportStatistics',
          property: this.tariffs.map(e => e.exportStatistics),
          propertyName: this.getTextOfProperty('exportStatistics')
        },
        {
          propertyType: 'modeAdblock',
          property: this.tariffs.map(e => e.modeAdblock),
          propertyName: this.getTextOfProperty('modeAdblock')
        },
        {
          propertyType: 'safeModeSearch',
          property: this.tariffs.map(e => e.safeModeSearch),
          propertyName: this.getTextOfProperty('safeModeSearch')
        },
        {
          propertyType: 'whiteListMode',
          property: this.tariffs.map(e => e.whiteListMode),
          propertyName: this.getTextOfProperty('whiteListMode')
        },
        {
          propertyType: 'advancedListMode',
          property: this.tariffs.map(e => e.advancedListMode),
          propertyName: this.getTextOfProperty('advancedListMode')
        },
        {
          propertyType: 'profileCount',
          propertyName: this.getTextOfProperty('profileCount'),
          property: this.tariffs.map(e => e.profileCount)
        },
        {
          propertyType: 'editCodePageLock',
          propertyName: this.getTextOfProperty('editCodePageLock'),
          property: this.tariffs.map(e => e.editCodePageLock)
        },
        {
          propertyType: 'networkCount',
          property: this.tariffs.map(e => e.networkCount),
          propertyName: this.getTextOfProperty('networkCount')
        },
        {
          propertyType: 'price',
          property: this.tariffs.map(e => e.price),
          propertyName: this.getTextOfProperty('price')
        }
      ]
      if (!this.isShowDifferent) {
        return result.filter(el => Array.from(new Set(el.property)).length !== 1)
      }
      return result
    }
  },
  methods: {
    getTextOfProperty (property) {
      switch (property) {
        case 'name':
          return 'Тариф'
        case 'price':
          return 'Абонентская плата, с НДС'
        case 'profileCount':
          return 'Количество профилей'
        case 'exportStatistics':
          return 'Экспорт статистики'
        case 'networkCount':
          return 'Количество сетей (IP-адресов)'
        case 'schedule':
          return 'Расписание'
        case 'personalPageLock':
          return 'Персональная страница блокировки'
        case 'perodStorageStatistics':
          return 'Период хранения статистики'
        case 'modeAdblock':
          return 'Режим антибаннера'
        case 'whiteListMode':
          return 'Режим белого списка'
        case 'advancedListMode':
          return 'Расширенное управление ч/б списками'
        case 'editCodePageLock':
          return 'Редактирование кода страницы блокировки'
        case 'whiteListModeCount':
          return 'Размер белого списка'
        case 'blackListModeCount':
          return 'Размер чёрного списка'
        case 'safeModeSearch':
          return 'Режим безопасного поиска'
        default:
          return ''
      }
    },
    mouseover (index) {
      this.hoveredColumn = index
    },
    mouseleave (index) {
      this.hoveredColumn = null
    },
    handleScroll () {
      if (this.isMobile) {
        const staticButtonsTop = this.$refs.sbuttons.getBoundingClientRect().top
        const buttonsTop = this.$refs.buttons.getBoundingClientRect().top
        this.hideButtons = staticButtonsTop < buttonsTop + 50
      }
    },
    getProduct (bpi) {
      this.isLoadingProduct = true
      this.$store.dispatch('productnservices/customerProduct', {
        api: this.$api,
        parentId: bpi,
        marketId: this.activePoint.marketId,
        code: CODE_CONTENT_FILTER
      })
        .then(answer => {
          const contentFilter = answer?.slo.find(el => el?.code === CODE_CONTENT_FILTER)
          if (contentFilter) {
            this.prices = contentFilter?.prices || []
            this.offerId = contentFilter?.id
            if (this.prices) {
              this.prices.forEach(el => {
                const tariff = this.tariffs.find(t => t.name === el.chars['Имя тарифного плана'])
                tariff.price = el.amount
                tariff.chars = el.chars
              })
            }
          }
        })
        .finally(() => {
          this.isLoadingProduct = false
        })
    },
    plugContentFilter (chars, price) {
      this.selectedTariff = {
        chars,
        price
      }
      this.creatingOrder = true
      this.$store.dispatch('salesOrder/getAvailableFunds')
        .then((response) => {
          this.availableFunds = response.availableFundsAmt
          if (this.availableFunds - price < 0) {
            this.creatingOrder = false
            this.isShowMoneyModal = true
          } else {
            this.createOrder(chars)
          }
        })
        .catch(() => {
          this.createOrder(chars)
        })
    },
    createOrder (chars) {
      this.$store.dispatch('salesOrder/createSaleOrder',
        {
          locationId: this.activePoint.id,
          bpi: this.activePoint.bpi,
          marketId: this.activePoint.marketId,
          productCode: CODE_CONTENT_FILTER,
          chars,
          tomsId: '301000014'
        })
        .then((e) => {
          this.isShowModal = true
        })
        .catch(() => {
          this.isShowErrorModal = true
        })
        .finally(() => {
          this.creatingOrder = false
        })
    },
    cancelOrder () {
      this.offer = false
      this.$store.dispatch('salesOrder/cancel')
    },
    sendOrder () {
      this.sendingOrder = true
      this.$store.dispatch('salesOrder/send', { offerAcceptedOn: this.offerAcceptedOn })
        .then(() => {
          this.sendingOrder = false
          this.isShowSuccessModal = true
          this.isShowModal = false
        })
        .catch(() => {
          this.isShowModal = false
          this.isShowErrorModal = true
        })
        .finally(() => {
          this.sendingOrder = false
          this.offer = false
        })
    }
  },
  mounted () {
    if (this.points) {
      this.activePoint = this.points[0]
    }
  },
  created: function () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
