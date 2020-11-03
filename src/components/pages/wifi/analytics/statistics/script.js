import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent'
import Submenu from './components/Submenu'
import { mapActions } from 'vuex'
import { head } from 'lodash'
// import { transformListPoint } from '../../../../blocks/ErListPoints/script'
import Page from '../../../../helpers/Page'

export default {
  name: 'wifi-analytics-statistics',
  components: {
    ListPointComponent,
    Submenu
  },
  mixins: [ResponsiveMixin, Page],
  props: {},
  data: () => ({
    pre: 'statistics',
    subpage: '',
    listPoint: [],
    activePoint: null,
    vlan: '',
    cityId: '',
    productType: 'Wi-Fi',
    customerProduct: null,
    isLoadingListPoint: true,
    isLoadingCustomerProduct: true,
    isLoadingWifiData: true,
    isErrorLoad: false
  }),
  computed: {
    isMobile () {
      return this.isXS || this.isSM
    }
  },
  watch: {
    listPoint () {
      this.$nextTick(() => {
        this.isLoadingListPoint = false
      })
    },
    customerProduct (val) {
      val && this.$nextTick(() => {
        this.isLoadingCustomerProduct = false
      })
    },
    activePoint (newVal, oldVal) {
      Page.options.watch.activePoint.call(this, newVal, oldVal)
      if (newVal && oldVal) {
        this.isLoadingCustomerProduct = true
        this.isLoadingWifiData = true
        this.isErrorLoad = false
      }
      newVal && this.getResource({ bpi: newVal.bpi })
        .then(response => {
          const vlan = head(response).vlan
          if (vlan && typeof head(vlan) !== 'undefined') {
            this.cityId = head(vlan).cityId
            this.vlan = head(vlan).number
          }
        })
        .catch(() => {
          this.isErrorLoad = true
          this.isLoadingCustomerProduct = false
          this.isLoadingWifiData = false
        })
    }
  },
  methods: {
    selectSubpage (name) {
      const routeName = this.$router.currentRoute.name
      if (routeName !== name) {
        this.$router.push({ name: name })
        this.subpage = name
      }
    },
    getListPoint () {
      return new Promise((resolve, reject) => {
        Page.options.methods.getListPoint.call(this)
          .then(() => {
            this.listPoint = this.listPoint.filter(point => ~point.offerName.toLowerCase().indexOf('mono'))
            this.activePoint = head(this.listPoint) || null
            resolve(this.listPoint)
          })
          .catch(error => {
            this.isErrorLoad = true
            this.isLoadingListPoint = false
            this.isLoadingCustomerProduct = false
            this.isLoadingWifiData = false
            reject(error)
          })
      })
    },
    ...mapActions({
      getResource: 'wifi/getResource',
      getData: 'wifi/getData'
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.subpage = to.name
    next()
  }
}
