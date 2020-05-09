import { Vue, Component, Prop } from 'vue-property-decorator'
import PhoneStatistic from './components/PhoneStatistic/index.vue'
import PhoneFolder from './components/PhoneFolder/index.vue'
import { MockupPhoneList, MockupAddressList } from './mockupData'

const components = {
  PhoneFolder,
  PhoneStatistic
}

@Component({ components })
export default class TelephonyStatisticPage extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly list!: any[]

  currentAddress = 0
  hasNewFile = true
  showFiles = false
  pointList = this.$store.state.telephony.points
  phoneList = MockupPhoneList
  currentPhone = this.phoneList[0]
  filterList = [
    'Вся статистика',
    ...MockupPhoneList
  ]

  data = []

  get addressList () {
    return this.pointList.map((el: any) => {
      console.log('address', el)
      const newEl = {
        id: el.id,
        title: el.name,
        type: el.offer.name
      }
      return newEl
    })
  }

  fetchPoints () {
    return this.$store.dispatch('telephony/fetchPoints', { api: this.$api })
  }

  waitingForBillingAccountId () {
    // TODO: переделать
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2100)
    })
  }

  mounted () {
    this.waitingForBillingAccountId()
      .then(() => {
        this.fetchPoints()
      })
  }
}
