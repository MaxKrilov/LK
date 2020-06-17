import { Vue, Component, Watch } from 'vue-property-decorator'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { IPointItem, IPhone, IBlacklistPhone } from '@/components/pages/telephony/telephony'
import { mapGetters } from 'vuex'
import { CODE_PHONE, CODE_PHONE_VPN, CODE_BLACKLIST } from '@/constants/product-code'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import blackListCard from '@/components/pages/telephony/blocks/blackListCard/index.vue'

const components = {
  ListPointComponent,
  ErActivationModal,
  blackListCard
}
@Component({
  components,
  computed: {
    ...mapGetters({ billingAccountId: 'user/getActiveBillingAccount' })
  } })
export default class TelephonyBlacklistPage extends Vue {
  currentAddress: IPointItem | null = null
  phonesList: IPhone[] = []
  selectedNewPhones: string = ''
  freePhonesList: IPhone[] = []
  blackList: IBlacklistPhone[] = []
  addressList: IPointItem[] = []
  billingAccountId!: string | number
  isLoading:boolean = true
  isLoadingPhones:boolean = false
  isConnectNewBlackList: boolean = false
  creatingOrder: boolean = false
  sendingOrder: boolean = false
  isShowModal: boolean = false
  isShowErrorModal: boolean = false
  isShowSuccessModal: boolean = false

  @Watch('billingAccountId')
  onBillingAccountIdChange (val: boolean) {
    if (val) {
      this.getPoints()
    }
  }

  @Watch('currentAddress')
  onCurrentAddressChange (val: any) {
    if (val?.bpi) {
      this.getPhones(val.bpi)
    }
  }

  getPoints () {
    this.isLoading = true
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'Телефония'
    }).then(answer => {
      if (answer.length) {
        this.addressList = answer.map((el: { id: any; fulladdress: any; bpi: any; offer: { name: any } }) => {
          return {
            id: el?.id,
            fulladdress: el?.fulladdress,
            bpi: el?.bpi,
            offerName: el?.offer?.name
          }
        })
        if (this.addressList.length) { this.currentAddress = this.addressList[0] }
      } else {
        this.$router.push('/lk/telephony/promo')
      }
    })
      .finally(() => {
        this.isLoading = false
      })
  }
  getPhones (bpi: string) {
    // добавить проверку на пустоту
    this.isLoadingPhones = true
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      parentId: bpi
    }).then(answer => {
      const phonesIdWithNumbers = answer?.slo.filter((el: any) => el?.code === CODE_PHONE_VPN || el?.code === CODE_PHONE)
        .reduce((acc: any, el: any) => {
          acc[el.productId] = el?.chars?.['Номер телефона']
          return acc
        }, {})
      this.phonesList = Object.keys(phonesIdWithNumbers).map(el => { return { id: el, phone: phonesIdWithNumbers[el] } })

      this.$store.dispatch('productnservices/customerProducts', {
        api: this.$api,
        parentIds: Object.keys(phonesIdWithNumbers),
        code: CODE_BLACKLIST
      })
        .then((answer) => {
          const keys = Object.keys(answer)
          this.blackList = keys
            .map(
              (el: string) => answer[el].slo?.filter((slo:any) => slo.status === 'Active')?.[0] // отфильтровали точки, где нет активных ЧС
            )
            .filter(el => el)
            .map(el => {
              const blackListSlo = el
              return {
                id: blackListSlo.id,
                phoneId: blackListSlo.parentId,
                phoneNumber: phonesIdWithNumbers[blackListSlo.parentId],
                blockedPhones: [blackListSlo.chars?.['Заблокированные номера'] || []].flat(),
                tlo: {
                  bpi: this.currentAddress?.bpi,
                  locationId: this.currentAddress?.id
                }
              }
            })
        })
        .finally(() => {
          this.isLoadingPhones = false

          this.freePhonesList = this.phonesList.filter(el => {
            return !this.blackList.map(_el => _el.phoneId).includes(el.id)
          })

          if (this.freePhonesList.length && !this.blackList.length) {
            this.isConnectNewBlackList = true
          }
        })
      // добавить проверку по статусу disconected так как могут приходить уже отключенные slo
    })
      .finally(() => {
        this.isLoading = false
      })
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }

  plugBlackList () { // подключаем черный список на номер
    this.creatingOrder = true
    if (!this.currentAddress?.id) return
    this.$store.dispatch('salesOrder/createSaleOrder',
      {
        locationId: this.currentAddress?.id,
        bpi: this.selectedNewPhones,
        productCode: CODE_BLACKLIST,
        chars: {
          'Заблокированные номера': ['']
        }
      })
      .then(() => {
        this.isShowModal = true
      })
      .catch(() => {
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.creatingOrder = false
      })
  }

  sendOrder () {
    this.sendingOrder = true
    this.$store.dispatch('salesOrder/send')
      .then(() => {
        this.sendingOrder = false
        this.isShowSuccessModal = true
        this.isShowModal = false
        // this.update() пока не отрабатывает бекенд
      })
      .catch(() => {
        this.isShowModal = false
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.sendingOrder = false
        this.selectedNewPhones = ''
      })
  }
  // update () { // оставим, пока работает с ошибкой
  //   if (this.currentAddress?.bpi) this.getPhones(this.currentAddress?.bpi)
  // }
  mounted () {
    if (this.billingAccountId) {
      this.getPoints()
    }
  }
}
