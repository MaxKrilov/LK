import { ClickOutside } from '@/directives/index'
import OrderCard from './components/OrderCard'
import { mapGetters, mapMutations } from 'vuex'
import { GET_ORDERS } from '@/store/actions/orders'
import { ALL_CITIES, IN_PROGRESS, ALL_STATUSES, ACCEPTED, WAIT, COMPLITED } from '@/constants/orders'

import { dataLayerPush } from '@/functions/analytics'

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
    isLoading: false,
    range: '',
    page: 1,
    rowCount: 25,
    orderList: []
  }),
  computed: {
    orders: function () {
      let listOrders = this.orderList
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
      return [ ALL_STATUSES, IN_PROGRESS, ACCEPTED, WAIT, COMPLITED ]
    },
    getCities: function () {
      return [...new Set(this.orders.map(order => order.cities).flat())]
    },
    cities: function () {
      return [ ALL_CITIES, ...this.getCities ]
    },
    isEndOfList: function () {
      const matches = this.range.match(/(\d+)-(\d+)\/(\d+|\*)/)
      if (matches) {
        const last = parseInt(matches[2])
        const length = parseInt(matches[3])
        return length === last
      }
      return true
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
      this.page = 1
      this.$store.dispatch(`orders/${GET_ORDERS}`,
        {
          statuses: this.getStatusesForRequest(status),
          api: this.$api,
          rowCount: this.rowCount,
          page: this.page
        })
        .then((data) => {
          this.range = data.range
          this.orderList = [...data.orders]
        })
    },
    isLoading (val) {
      this.changeLoadingStatus(val)
    }
  },
  methods: {
    getStatusesForRequest (status) {
      switch (status) {
        case IN_PROGRESS:
          return ['Точка невозврата пройдена', 'В исполнении', 'В процессе согласования']
        case ACCEPTED:
          return ['Ввод данных']
        case WAIT:
          return ['Договор подписан', 'Согласование с Клиентом', 'Согласовано с Клиентом']
        case COMPLITED:
          return ['Завершен', 'Выполнено']
        default:
          return ['Точка невозврата пройдена', 'В исполнении', 'В процессе согласования', 'Ввод данных', 'Договор подписан', 'Согласование с Клиентом',
            'Согласовано с Клиентом', 'Завершен', 'Выполнено']
      }
    },
    loadMore () {
      this.page = this.page + 1
      this.$store.dispatch(`orders/${GET_ORDERS}`,
        {
          statuses: this.getStatusesForRequest(this.selectedStatus),
          api: this.$api,
          rowCount: this.rowCount,
          page: this.page
        })
        .then((data) => {
          this.range = data.range
          this.orderList = [...this.orderList, ...data.orders]
        })
    },
    async init () {
      this.$store.dispatch(`orders/${GET_ORDERS}`,
        {
          statuses: ['Точка невозврата пройдена', 'В исполнении', 'В процессе согласования'],
          api: this.$api,
          rowCount: this.rowCount,
          page: this.page
        })
        .then((data) => {
          this.range = data.range
          this.orderList = [...this.orderList, ...data.orders]
        })
    },
    ...mapMutations({
      changeLoadingStatus: 'loading/loadingOrders'
    }),
    dataLayerPush
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
