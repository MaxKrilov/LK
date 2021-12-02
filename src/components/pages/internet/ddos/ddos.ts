import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { IDdosItem, IPointItem } from '@/components/pages/internet/ddos/ddos.d.ts'
import PlugDdos from '@/components/pages/internet/ddos/plug/index.vue'
import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'
import { SERVICE_DDOS_PROTECT } from '@/constants/internet'
import { IDeleteOrderData } from '@/constants/er-plug'

import { dataLayerPush } from '@/functions/analytics'

const components = {
  ErActivationModal,
  ErDisconnectProduct,
  PlugDdos
}
@Component({
  components,
  computed: {
    ...mapGetters({ billingAccountId: 'payments/getActiveBillingAccount' })
  } })
export default class DdosPage extends Vue {
  billingAccountId!: string | number
  pre:string = 'ddos-page'
  isOpen:boolean = false
  data:IDdosItem[] = []
  isLoading:boolean = true
  isShowConnection = false
  freePoints: IPointItem[] = []
  isDisconnection: boolean = false
  deleteData: IDeleteOrderData = {
    bpi: '',
    locationId: '',
    productId: '',
    marketId: '',
    title: ''
  }
  get amountPrice () {
    return this.data.reduce((acc, el) => acc + +el.price, 0)
  }

  @Watch('billingAccountId')
  onBillingAccountIdChange (val: boolean) {
    if (val) {
      this.getDdosData()
    }
  }
  getDdosData () {
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'Интернет'
    }).then(answer => {
      if (!answer.length) this.$router.push('/lk')
      const points = answer.reduce((acc: any, el: any) => {
        acc[el.bpi] = el.fulladdress
        return acc
      }, {})
      this.freePoints = answer.map((el: any) => {
        return {
          id: el.id,
          fulladdress: el.fulladdress,
          bpi: el.bpi,
          marketId: el.marketId,
          offerName: el.offer.name
        }
      })
      const bpis = answer.map((el:any) => el.bpi)
      this.$store.dispatch('productnservices/customerProducts', {
        api: this.$api,
        parentIds: bpis,
        code: SERVICE_DDOS_PROTECT
      })
        .then(answer => {
          const data = Object.values(answer)
          this.data = data
            .reduce((acc: IDdosItem[], el: any) => {
              const ddosSlo = el.slo.filter((el: any) => el.status === 'Active')?.[0]
              if (ddosSlo) {
                const _el: IDdosItem = {
                  fulladdress: points[ddosSlo.parentId],
                  date: this.$moment(ddosSlo.actualStartDate).format('DD.MM.YY'),
                  price: ddosSlo.purchasedPrices.recurrentTotal.value,
                  bpi: el.tlo.id,
                  productId: ddosSlo.id,
                  isDisconnected: false,
                  link: '',
                  deleteData: {
                    locationId: el.tlo.locationId,
                    bpi: el.tlo.id,
                    marketId: el.tlo.market.id,
                    productId: ddosSlo.id,
                    title: 'Вы уверены, что хотите отключить защиту?'
                  }
                }
                return [...acc, _el]
              } else {
                return acc
              }
            }, [])
          if (this.data.length) {
            this.$store.dispatch('internet/getDDoSLink', { productIds: this.data.map((el) => el.productId) })
              .then((links) => {
                this.data = this.data.map((el) => {
                  if (links?.[el.productId] && links?.[el.productId].status === 'ok' && links?.[el.productId]?.redirect_url) {
                    el.link = links[el.productId].redirect_url
                  }
                  return el
                })
              })
          }

          this.freePoints = this.freePoints.filter(el => !this.data.map((el: IDdosItem) => el.bpi).includes(el.bpi))
          if (this.freePoints.length && !this.data.length) this.isShowConnection = true
          this.isLoading = false
        })
    })
  }

  deleteDdos (deleteData: IDeleteOrderData) {
    this.deleteData = deleteData
    this.isDisconnection = true
  }
  cancelConnection () {
    if (this.data.length) {
      this.isShowConnection = false
    } else {
      this.$router.push('/lk/internet')
    }
  }

  dataLayerPush = dataLayerPush

  mounted () {
    if (this.billingAccountId) {
      this.getDdosData()
    }
  }
}
