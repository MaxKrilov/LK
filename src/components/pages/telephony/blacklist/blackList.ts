import { Vue, Component, Watch } from 'vue-property-decorator'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { IPointItem, IPhone, IBlacklistPhone } from '@/components/pages/telephony/telephony'
import { mapGetters } from 'vuex'
import { CODE_BLACKLIST, ARRAY_SHOWN_PHONES } from '@/constants/product-code'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import blackListCard from '@/components/pages/telephony/blocks/blackListCard/index.vue'
import { ARRAY_STATUS_SHOWN } from '@/constants/status.ts'
import { PATTERN_RUSSIAN_PHONE } from '@/constants/regexp'
import { ErtTextField } from '@/components/UI2'
import Inputmask from 'inputmask'

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
  $refs!: {
    'black-list-phone': InstanceType<typeof ErtTextField>
  }
  currentAddress: IPointItem | null = null
  phonesList: IPhone[] = []
  selectedNewPhones: string = ''
  newNumber: string = ''
  freePhonesList: IPhone[] = []
  blackList: IBlacklistPhone[] = []
  addressList: IPointItem[] = []
  newBlackList: string[] = []
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
  @Watch('selectedNewPhones')
  onSelectedNewPhones (val: any) {
    if (val && this.$refs['black-list-phone']) {
      const inputMask = new Inputmask(
        '+7 (999) 999-99-99'
      )
      inputMask.mask(this.$refs['black-list-phone'].$refs.input)
    }
  }
  validPhone (phone: string) {
    if (PATTERN_RUSSIAN_PHONE.test(phone) || !phone) {
      return true
    } else {
      return 'Неверный формат телефонного номера'
    }
  }
  get phoneRule () {
    return [this.validPhone]
  }
  get numbersForOrder () {
    return this.newBlackList.map((el) => el.replace(/[^\d]/g, ''))
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
      const phonesIdWithNumbers = answer?.slo.filter((el: any) => ARRAY_SHOWN_PHONES.includes(el?.code))
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
              (el: string) => answer[el].slo?.filter((slo:any) => ARRAY_STATUS_SHOWN.includes(slo.status))?.[0] // отфильтровали точки, где нет активных ЧС
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
          this.isConnectNewBlackList = !!this.freePhonesList.length && !this.blackList.length
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
  addPhoneToBlock () {
    this.newBlackList.push(this.newNumber)
    this.newNumber = ''
  }
  deleteNumber (number: string) {
    this.newBlackList = this.newBlackList.filter((el: string) => el !== number)
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
          'Заблокированные номера': this.numbersForOrder
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
        this.isShowModal = false

        setTimeout(() => {
          this.isShowSuccessModal = true
        }, 1000)
        this.update() // пока не отрабатывает бекенд
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
  update () { // оставим, пока работает с ошибкой
    if (this.currentAddress?.bpi) this.getPhones(this.currentAddress?.bpi)
  }
  mounted () {
    if (this.billingAccountId) {
      this.getPoints()
    }
  }
}
