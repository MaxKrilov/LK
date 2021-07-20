import { Vue, Component, Prop } from 'vue-property-decorator'
import { IPhone } from '@/components/pages/telephony/telephony'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import Validators from '@/mixins/ValidatorsMixin'
import { CODE_CALLFORWRD } from '@/constants/product-code'

const components = { ErActivationModal }

const isValidTimes = (from: number, to: number) => from <= 24 && to <= 24 && from < to

@Component({
  name: 'add-redirection-form',
  components,
  mixins: [Validators]
})
export default class AddRedirectionForm extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly phonesList!: IPhone[]
  @Prop() readonly locationId: string | undefined
  @Prop() readonly marketId: string | undefined
  periodList: string[] = []
  creatingOrder: boolean = false
  isShowPlugModal: boolean = false
  isShowErrorModal: boolean = false
  isShowSuccessModal: boolean = false
  sendingOrder: boolean = false
  timeRule = [
    (v: string) => {
      const timeFrom = Number(v.split('-')[0].split(':')[0])
      const timeTo = Number(v.split('-')[1].split(':')[0])

      return isValidTimes(timeFrom, timeTo) || 'Неверное время'
    }
  ]

  dayOfWeek = [
    { name: 'ПН', value: 'Понедельник' },
    { name: 'ВТ', value: 'Вторник' },
    { name: 'СР', value: 'Среда' },
    { name: 'ЧТ', value: 'Четверг' },
    { name: 'ПТ', value: 'Пятница' },
    { name: 'СБ', value: 'Суббота' },
    { name: 'ВС', value: 'Воскресенье' }
  ]
  phoneTo = ''
  time = ''
  slectedPhone = ''
  redirectionTypes = ['Безусловная', 'По неответу', 'По занятости', 'По недоступности']
  selectedRedirectionType = ''

  get phoneToFormated () {
    return this.phoneTo.replace(/\D+/g, '')
  }

  get hourFrom () {
    return this.time
      ? Number(this.time.split('-')[0].split(':')[0])
      : 0
  }

  get hourTo () {
    return this.time
      ? Number(this.time.split('-')[1].split(':')[0])
      : 0
  }

  get disabledPlug () {
    return !(this.slectedPhone && this.phoneTo && this.selectedRedirectionType && isValidTimes(this.hourFrom, this.hourTo))
  }

  createOrder () {
    this.creatingOrder = true
    if (!this.locationId) return
    this.$store.dispatch('salesOrder/createSaleOrder',
      {
        locationId: this.locationId,
        bpi: this.selectedPhoneId,
        marketId: this.marketId || '',
        productCode: CODE_CALLFORWRD,
        chars: this.chars
      })
      .then(() => {
        this.isShowPlugModal = true
      })
      .catch(() => {
        this.cancelOrder()
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.creatingOrder = false
      })
  }

  cancelOrder () {
    this.$store.dispatch('salesOrder/cancel')
  }
  sendOrder () {
    this.sendingOrder = true
    this.$store.dispatch('salesOrder/send')
      .then(() => {
        this.sendingOrder = false
        this.isShowSuccessModal = true
        this.isShowPlugModal = false
      })
      .catch(() => {
        this.cancelOrder()
        this.isShowPlugModal = false
        this.isShowErrorModal = true
      })
      .finally(() => {
        this.sendingOrder = false
      })
  }

  get phones () {
    return this.phonesList.map(el => el.phone)
  }
  get selectedPhoneId () {
    return this.phonesList.find(el => el.phone === this.slectedPhone)?.id
  }

  get chars () {
    const chars = Object.values(this.dayOfWeek)
      .map(el => { return { [el.value]: this.periodList.includes(el.value) ? 'Да' : 'Нет' } })
      .reduce((acc, el) => {
        return { ...acc, ...el }
      }, {})
    if (this.hourFrom.toString() && this.hourTo.toString()) chars['Часы'] = `с ${this.hourFrom.toString().replace(/\D+/g, '')} по ${this.hourTo.toString().replace(/\D+/g, '')}`
    if (this.selectedRedirectionType) chars['Тип Переадресации'] = this.selectedRedirectionType
    if (this.phoneTo) chars['Переадресация на'] = this.phoneToFormated
    return chars
  }

  onCancel () {
    this.$emit('cancel')
  }
}
