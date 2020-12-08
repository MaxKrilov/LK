import { Vue, Component, Watch } from 'vue-property-decorator'
import VpnSlider from '@/components/pages/vpn/components/slider-content/index.vue'
import { mapGetters } from 'vuex'

const components = { VpnSlider }

@Component({
  components,
  computed: {
    ...mapGetters({ billingAccountId: 'user/getActiveBillingAccount' })
  } })
export default class VPNMainPage extends Vue {
  addressList: any = []
  billingAccountId!: string | number
  isLoading: boolean = false
  @Watch('billingAccountId')
  onBillingAccountIdChange (val: boolean) {
    if (val) {
      this.getPoints()
    }
  }
  get amountPrice () {
    return Number(this.addressList.reduce((acc: number, el: any) => acc + Number(el.amount), 0)).toFixed(2)
  }
  getPoints () {
    this.isLoading = true
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: ['L1', 'L3', 'L2 Передача данных', 'L2 Канал связи']
    }).then(answer => {
      if (Object.keys(answer).length) {
        const points = []
        if (answer?.['L1'] && Array.isArray(answer['L1'])) {
          points.push(...answer['L1'])
        }
        if (answer?.['L3'] && Array.isArray(answer['L3'])) {
          points.push(...answer['L3'])
        }
        if (answer?.['L2 Передача данных'] && Array.isArray(answer['L2 Передача данных'])) {
          points.push(...answer['L2 Передача данных'])
        }
        this.addressList = points.map((el: { id: string; fulladdress: string; bpi: string; status: string; amount: {value: string}, offer: {name: string}, address: {id: string} }) => {
          return {
            fulladdress: el?.fulladdress,
            addressId: el?.address.id,
            bpi: el?.bpi,
            status: el?.status,
            name: el?.offer?.name,
            amount: el?.amount?.value
          }
        })
        if (!this.addressList.length) this.$router.push('/lk/vpn/promo')
      } else {
        this.$router.push('/lk/vpn/promo')
      }
    })
      .finally(() => {
        this.isLoading = false
      })
  }

  mounted () {
    if (this.billingAccountId) {
      this.getPoints()
    }
  }
}
