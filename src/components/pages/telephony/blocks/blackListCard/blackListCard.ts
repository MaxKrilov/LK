import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PhoneHint from '@/components/pages/telephony/blacklist/components/PhoneHint/index.vue'
import { IBlacklistPhone } from '@/components/pages/telephony/telephony'
import { mapGetters } from 'vuex'
import Validators from '@/mixins/ValidatorsMixin'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { PATTERN_RUSSIAN_PHONE, PATTERN_NUMBERS } from '@/constants/regexp'

const components = {
  PhoneHint,
  ErActivationModal
}
@Component({
  components,
  mixins: [Validators],
  computed: {
    ...mapGetters({ billingAccountId: 'user/getActiveBillingAccount' })
  } })
export default class TelephonyBlacklistCard extends Vue {
  @Prop({ type: Object }) readonly data!: IBlacklistPhone
  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean
  isOpen:boolean = false
  isAddRecord:boolean = false
  newNumber:string = ''
  isShowDeletBlackListModal: boolean = false
  isShowErrorModal: boolean = false
  isShowSuccessModal: boolean = false
  creatingOrderDeleteBlackList: boolean = false
  sendingOrderDeleteBlackList: boolean = false
  modifyingOrder: boolean = false
  addedPhones: string[] = []
  checkedNumbersForDelete: string[] = []
  pre = 'black-list-card'
  get phoneRules () {
    return [(v: string) => !!v || 'Field is required']
  }
  get countBlockedPhones () : number {
    return this.data?.blockedPhones.length
  }
  get phoneNumber () : string {
    return this.data?.phoneNumber || ''
  }
  get blockedPhones () : string[] {
    return this.data?.blockedPhones || []
  }
  get isCorrectPhone () : boolean {
    if (PATTERN_NUMBERS.test(this.newNumber) && PATTERN_RUSSIAN_PHONE.test(this.newNumber) && this.newNumber) {
      return true
    } else {
      return false
    }
  }
  @Watch('blockedPhones')
  onBlockedPhonesChange (blockedPhones: string[]) {
    if (!blockedPhones.length) {
      this.isAddRecord = true
    }
  }
  addNewNumber () {
    this.addedPhones.push(this.newNumber)
    this.newNumber = ''
  }
  cancelAdded () {
    this.isAddRecord = false
    this.addedPhones = []
  }
  get formatedAddedPhones () {
    return [...this.data.blockedPhones, ...this.addedPhones.map(el => el.replace(/\D+/g, ''))]
  }
  deleteAddedNumber (val:string) {
    this.addedPhones = this.addedPhones.filter((el) => el !== val)
  }
  deleteBlackList () { // создание заказа на удаление услуги черный список
    this.creatingOrderDeleteBlackList = true
    this.$store.dispatch('salesOrder/createDisconnectOrder',
      {
        locationId: this.data.tlo.locationId,
        bpi: this.data.tlo.bpi,
        productId: this.data.id,
        disconnectDate: this.$moment().format()
      })
      .then(() => {
        this.isShowDeletBlackListModal = true
      })
      .finally(() => {
        this.creatingOrderDeleteBlackList = false
      })
  }
  addNewNumbersOrder () {
    this.modify(this.formatedAddedPhones)
  }
  deleteNumbersOrder () {
    this.modify(this.data.blockedPhones.filter(el => !this.checkedNumbersForDelete.includes(el)))
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }

  modify (numbers: string[]) { // изменение списка заблокированных номеров
    this.modifyingOrder = true
    this.$store.dispatch('salesOrder/createModifyOrder',
      {
        locationId: this.data.tlo.locationId,
        bpi: this.data.id,
        chars: {
          'Заблокированные номера': numbers
        }
      })
      .then(() => {
        this.$store.dispatch('salesOrder/send')
          .then(() => {
            this.$emit('update')
          })
          .catch(() => {
            this.isShowErrorModal = true
          })
          .finally(() => {
            this.modifyingOrder = false
            this.isAddRecord = false
            this.addedPhones = []
            this.checkedNumbersForDelete = []
          })
      })
      .catch(() => {
        this.isShowErrorModal = true
        this.checkedNumbersForDelete = []
        this.modifyingOrder = false
        this.isAddRecord = false
        this.addedPhones = []
      })
  }
  sendDeleteBlackListOrder () { // отправка заказа в раоту на удаление услуги черный список
    this.sendingOrderDeleteBlackList = true
    this.$store.dispatch('salesOrder/send')
      .then(() => {
        this.sendingOrderDeleteBlackList = false
        this.isShowSuccessModal = true
        this.isShowDeletBlackListModal = false
      })
      .catch(() => {
        this.isShowDeletBlackListModal = false
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.sendingOrderDeleteBlackList = false
      })
  }
  mounted () {
    if (!this.blockedPhones.length) {
      this.isAddRecord = true
    }
  }
}
