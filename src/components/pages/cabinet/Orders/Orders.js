import { ClickOutside } from '@/directives/index'
import OrderCard from './components/OrderCard'
import { mapGetters, mapMutations } from 'vuex'
import { GET_ORDERS } from '@/store/actions/orders'
import { ALL_CITIES, IN_PROGRESS, ALL_STATUSES, CANCELLED, ACCEPTED, WAIT, COMPLITED } from '@/constants/orders'

export default {
  name: 'orders',
  components: {
    OrderCard
  },
  directives: {
    ClickOutside
  },
  data: () => ({
    pre: 'orders',
    isFiltersVisible: false,
    isSearchActive: false,
    selectedCity: ALL_CITIES,
    selectedStatus: IN_PROGRESS,
    isLoading: false
  }),
  computed: {
    orders: function () {
      let listOrders = this.getListOrders
      if (this.selectedCity !== ALL_CITIES) {
        listOrders = listOrders.filter(el => el.cities.includes(this.selectedCity))
      }

      return listOrders.map(item => {
        const itemCopy = { ...item }
        itemCopy.orderItems = itemCopy.orderItems.map(_item => {
          _item.fullAddress = this.addresses?.[_item.locationId] || 'Адрес уточняется'
          return _item
        })
        return itemCopy
      })
    },
    isNoOrders: function () {
      return !this.orders.length
    },
    ...mapGetters({
      getListOrders: 'orders/getListOrders',
      getStatuses: 'orders/getStatuses',
      getCities: 'orders/getCities',
      loadingClientInfo: 'loading/clientInfo',
      loadingOrders: 'loading/loadingOrders',
      getAddressList: 'user/getAddressList'
    }),
    addresses: function () {
      if (!this.getAddressList && !this.getAddressList.length) {
        return {}
      }
      return this.getAddressList.reduce((acc, address) => {
        acc[address.locationId] = address.value
        return acc
      }, {})
    },
    statuses: function () {
      return [ ALL_STATUSES, IN_PROGRESS, ACCEPTED, WAIT, COMPLITED, CANCELLED ]
    },
    cities: function () {
      return [ ALL_CITIES, ...this.getCities ]
    },
    selectedFilters: function () {
      if (this.selectedStatus === ALL_STATUSES && this.selectedCity === ALL_CITIES) {
        return false
      }
      return [this.selectedStatus, this.selectedCity]
        .filter(el => ![ALL_CITIES, ALL_STATUSES].includes(el))
        .join(', ')
    }
  },
  watch: {
    async loadingClientInfo (val) {
      if (!val) {
        this.init()
      }
    },
    selectedStatus (status) {
      const getStatuses = (status) => {
        switch (status) {
          case IN_PROGRESS:
            return ['Точка невозврата пройдена', 'В исполнении', 'В процессе согласования']
          case ACCEPTED:
            return ['Ввод данных']
          case WAIT:
            return ['Договор подписан', 'Согласование с Клиентом', 'Согласовано с Клиентом']
          case COMPLITED:
            return ['Завершен', 'Выполнено']
          case CANCELLED:
            return ['Отменено', 'Заменено']
          default:
            return []
        }
      }

      this.$store.dispatch(`orders/${GET_ORDERS}`, { statuses: getStatuses(status), api: this.$api })
    },
    isLoading (val) {
      this.changeLoadingStatus(val)
    }
  },
  methods: {
    async init () {
      this.$store.dispatch(`orders/${GET_ORDERS}`,
        {
          statuses: ['Точка невозврата пройдена', 'В исполнении', 'В процессе согласования'],
          api: this.$api
        })
    },
    ...mapMutations({
      changeLoadingStatus: 'loading/loadingOrders'
    })
  },
  async created () {
    if (!this.loadingClientInfo) {
      this.init()
    }
  },
  destroyed () {
    this.changeLoadingStatus(true)
  }
}
