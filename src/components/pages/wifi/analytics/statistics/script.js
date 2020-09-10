import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent'
import Submenu from './components/Submenu'
import { mapState } from 'vuex'
import { head } from 'lodash'
import { transformListPoint } from '../../../../blocks/ErListPoints/script'

export default {
  name: 'wifi-analytics-statistics',
  components: {
    ListPointComponent,
    Submenu
  },
  mixins: [ResponsiveMixin],
  props: {},
  data: () => ({
    pre: 'statistics',
    subpage: '',
    listPoint: [],
    activePoint: null,
    vlanInfo: null
  }),
  computed: {
    isMobile () {
      return this.isXS || this.isSM
    },
    ...mapState({
      loadingBillingAccount: state => state.loading.menuComponentBillingAccount,
      billingAccountId: state => state.user.activeBillingAccount
    })
  },
  watch: {
    loadingBillingAccount (val) {
      !val && this.init()
    },
    billingAccountId (newVal, oldVal) {
      oldVal && this.init()
    },
    activePoint (val) {
      if (!val) return
      this.$store.dispatch('wifi/getResource', {
        bpi: val.bpi
      })
        .then(response => {
          this.vlanInfo = head(response)
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
    init () {
      this.$store.dispatch('productnservices/locationOfferInfo', {
        api: this.$api,
        productType: 'Wi-Fi'
      })
        .then(response => {
          this.listPoint = transformListPoint(response)
          if (response.length > 0) {
            this.activePoint = head(this.listPoint)
          }
        })
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.subpage = to.name
    next()
  },
  created () {
    if (!this.loadingBillingAccount) {
      this.init()
    }
  }
}
