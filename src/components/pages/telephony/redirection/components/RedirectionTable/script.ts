import { Vue, Component, Prop } from 'vue-property-decorator'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

const components = {
  ErActivationModal
}
@Component({
  name: 'redirection-table',
  components
})
export default class RedirectionTable extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly list!: any[]
  deleting:boolean = false
  isShowDeletModal: boolean = false
  isShowErrorModal: boolean = false
  isShowSuccessModal: boolean = false
  sendingOrderDeleteRedirection: boolean = false

  onDelete (item: any) {
    this.deleting = true
    this.$store.dispatch('salesOrder/createDisconnectOrder',
      {
        locationId: item?.tlo?.locationId,
        bpi: item?.tlo?.bpi,
        marketId: item?.tlo?.marketId,
        productId: item?.id,
        disconnectDate: this.$moment().format()
      })
      .then(() => {
        this.isShowDeletModal = true
      })
      .catch(() => {
        this.isShowErrorModal = true
        this.cancelOrder()
      })
      .finally(() => {
        this.deleting = false
      })
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }

  sendDeleteOrder () { // отправка заказа в раоту на удаление услуги пеедадресация
    this.sendingOrderDeleteRedirection = true
    this.$store.dispatch('salesOrder/send')
      .then(() => {
        this.isShowDeletModal = false
        this.isShowSuccessModal = true
        this.sendingOrderDeleteRedirection = false
        this.$emit('update')
      })
      .catch(() => {
        this.cancelOrder()
        this.isShowDeletModal = false
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.isShowDeletModal = false
        this.sendingOrderDeleteRedirection = false
      })
  }
}
