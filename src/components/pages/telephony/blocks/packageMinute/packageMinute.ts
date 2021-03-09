import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

const components = {
  ErActivationModal
}
@Component({
  components,
  computed: {
    ...mapGetters({ billingAccountId: 'payments/getActiveBillingAccount' })
  } })
export default class PackageMinuteCard extends Vue {
  @Prop({ type: Object }) readonly slo!: any
  @Prop({ type: Array }) readonly phones!: any[]
  @Prop({ type: String, default: 'Пакет минут' }) readonly name!: string
  @Prop({ type: String, default: '' }) readonly char!: string

  limit: number = 0
  changed: number = 0
  spent: number = 0

  isCreatingDeletePackage: boolean = false
  isCreatingUpdatePackage: boolean = false

  shadowIcon:any = {
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      x: '-4px',
      y: '4px'
    },
    shadowRadius: '4px'
  }
  isChanging: boolean = false
  isShowSuccessModal: boolean = false
  isShowErrorModal: boolean = false

  isShowDeletePackageModal: boolean = false
  sendingOrderDeletePackage: boolean = false

  sendingOrderUpdatePackage: boolean = false
  isShowChangeModal: boolean = false

  plus () {
    this.changed = Math.floor(this.changed / 100) * 100 + 500
  }

  minus () {
    if (this.changed > 500) {
      this.changed = Math.floor(this.changed / 100) * 100 - 500
    }
  }
  changePackage () {
    this.isChanging = true
  }

  disconnect () {
    this.isCreatingDeletePackage = true
    this.$store.dispatch('salesOrder/create',
      {
        locationId: this.slo.locationId
      })
      .then(() => {
        this.$store.dispatch('salesOrder/deleteElement',
          {
            disconnectDate: this.$moment().format(),
            productId: this.slo.productId
          })
          .then(() => {
            this.$store.dispatch('salesOrder/updateElement',
              {
                updateElements: this.phones.map(el => {
                  return {
                    productId: el.productId,
                    chars: { [this.char]: null }
                  }
                })
              })
              .then(() => {
                this.$store.dispatch('salesOrder/save')
                  .then(() => {
                    this.isShowDeletePackageModal = true
                    this.isCreatingDeletePackage = false
                  })
                  .catch(() => {
                    this.isCreatingDeletePackage = false
                    this.isShowErrorModal = true
                  })
              })
          })
          .catch(() => {
            this.isCreatingDeletePackage = false
            this.isShowErrorModal = true
          })
      })
      .catch(() => {
        this.isCreatingDeletePackage = false
        this.isShowErrorModal = true
      })
  }

  sendDeletePackageOrder () {
    this.sendingOrderDeletePackage = true
    this.$store.dispatch('salesOrder/send', { offerAcceptedOn: this.$moment().toISOString() })
      .then(() => {
        this.sendingOrderDeletePackage = false
        this.isShowSuccessModal = true
        this.isShowDeletePackageModal = false
      })
      .catch(() => {
        this.isShowDeletePackageModal = false
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.sendingOrderDeletePackage = false
      })
  }
  sendUpdatePackageOrder () {
    this.sendingOrderUpdatePackage = true
    this.$store.dispatch('salesOrder/send', { offerAcceptedOn: this.$moment().toISOString() })
      .then(() => {
        this.sendingOrderUpdatePackage = false
        this.isShowSuccessModal = true
        this.isShowChangeModal = false
      })
      .catch(() => {
        this.isShowChangeModal = false
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.sendingOrderUpdatePackage = false
      })
  }

  updatePackage () {
    this.isCreatingUpdatePackage = true
    this.$store.dispatch('salesOrder/createModifyOrder',
      {
        locationId: this.slo.locationId,
        bpi: this.slo.productId,
        chars: { 'Стоимость пакета': this.changed }
      }
    )
      .then(() => {
        this.isCreatingUpdatePackage = false
        this.isShowChangeModal = true
      })
      .catch(() => {
        this.isCreatingUpdatePackage = false
        this.isShowErrorModal = true
      })
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }

  mounted () {
    this.$store.dispatch('productnservices/billingPacket', {
      api: this.$api,
      product: this.slo.productId
    })
      .then(answer => {
        if (answer?.limit && answer?.spent) {
          this.limit = Math.round(answer.limit)
          this.changed = this.limit
          this.spent = Math.round(answer.spent)
        }
      })
  }
}
