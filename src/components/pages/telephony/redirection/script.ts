import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import RedirectionTable from './components/RedirectionTable/index.vue'
import AddRedirectionForm from './components/AddRedirectionForm/index.vue'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue'
import { IPointItem, IRedirectionList, IPhone } from '@/components/pages/telephony/telephony'
import { CODE_CALLFORWRD, ARRAY_SHOWN_PHONES } from '@/constants/product-code'
import { STATUS_ACTIVE } from '@/constants/status'

const components = {
  AddRedirectionForm,
  RedirectionTable,
  ListPointComponent
}

@Component({
  name: 'telephony-redirection-page',
  components,
  computed: {
    ...mapGetters({ billingAccountId: 'payments/getActiveBillingAccount' })
  }
})
export default class TelephonyRedirectionPage extends Vue {
  currentAddress: IPointItem | null = null
  addressList = []
  redirectionList: IRedirectionList[] = []
  addRedirectionMode = false
  isLoading:boolean = true
  isLoadingRedirections:boolean = false
  billingAccountId!: string | number
  phonesList: IPhone[] = []
  freePhonesList: IPhone[] = []

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
  update () {
    if (this.currentAddress?.bpi) this.getPhones(this.currentAddress?.bpi)
  }
  get locationId () {
    return this.currentAddress?.id || ''
  }
  get marketId () {
    return this.currentAddress?.marketId || ''
  }
  onShowAddForm () {
    this.addRedirectionMode = true
  }

  onHideAddForm () {
    this.addRedirectionMode = false
  }

  getPoints () {
    this.$store.dispatch('productnservices/locationOfferInfo', {
      api: this.$api,
      productType: 'Телефония'
    }).then(answer => {
      if (answer.length) {
        this.addressList = answer
          .filter((el: { status: string}) => el.status === STATUS_ACTIVE)
          .map((el: { id: any; fulladdress: any; bpi: any; marketId: string; offer: { name: any } }) => {
            return {
              id: el?.id,
              fulladdress: el?.fulladdress,
              bpi: el?.bpi,
              marketId: el?.marketId,
              offerName: el?.offer?.name
            }
          })
        if (this.addressList.length) { this.currentAddress = this.addressList[0] }
      } else {
        this.$router.push('/lk/telephony/promo')
      }
      this.isLoading = false
    })
  }

  getPhones (bpi: string) {
    this.isLoadingRedirections = true
    this.$store.dispatch('productnservices/customerProduct', {
      api: this.$api,
      marketId: this.currentAddress?.marketId,
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
        code: CODE_CALLFORWRD
      })
        .then(answer => {
          const keys = Object.keys(answer)
          const data : IRedirectionList[] = keys
            .map(
              (el: string) => answer[el].slo?.filter((slo:any) => slo.status === 'Active')?.[0] // отфильтровали точки, где нет активных ЧС
            )
            .filter(el => el)
            .map(el => {
              const period = [
                { value: el.chars['Понедельник'], name: 'ПН' },
                { value: el.chars['Вторник'], name: 'ВТ' },
                { value: el.chars['Среда'], name: 'СР' },
                { value: el.chars['Четверг'], name: 'ЧТ' },
                { value: el.chars['Пятница'], name: 'ПТ' },
                { value: el.chars['Суббота'], name: 'СБ' },
                { value: el.chars['Воскресенье'], name: 'ВС' }
              ]

              return {
                id: el.id,
                phoneId: el.parentId,
                from: phonesIdWithNumbers[el.parentId],
                to: el.chars['Переадресация на'],
                status: el.chars['Тип Переадресации'],
                period: period.filter(el => el.value === 'Да').map(el => el.name).join(', '),
                tlo: {
                  bpi: this.currentAddress?.bpi,
                  locationId: this.currentAddress?.id,
                  marketId: this.currentAddress?.marketId
                }
              }
            })
          this.redirectionList = data
          this.freePhonesList = this.phonesList.filter((el:IPhone) =>
            !this.redirectionList.map((el:IRedirectionList) => el.phoneId).includes(el.id)
          )
          this.addRedirectionMode = !data.length
        })
    }).finally(() => {
      this.isLoadingRedirections = false
    })
  }

  mounted () {
    if (this.billingAccountId) {
      this.getPoints()
    }
  }
}
