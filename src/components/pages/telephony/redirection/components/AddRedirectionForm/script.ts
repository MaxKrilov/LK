import { Vue, Component, Prop } from 'vue-property-decorator'
import { IPhone } from '@/components/pages/telephony/telephony'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import Validators from '@/mixins/ValidatorsMixin'

const components = {
  ErActivationModal

}

@Component({
  name: 'add-redirection-form',
  components,
  mixins: [Validators]
})
export default class AddRedirectionForm extends Vue {
  @Prop({ type: Array, default: () => ([]) }) readonly phonesList!: IPhone[]
  @Prop() readonly locationId: string | undefined
  periodList: string[] = []
  creatingOrder: boolean = false
  isShowPlugModal: boolean = false
  isShowErrorModal: boolean = false
  isShowSuccessModal: boolean = false
  sendingOrder: boolean = false
  timeRule = [
    (v:any) => !!v || 'Ошибка'
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
  timeFrom = ''
  timeTo = ''
  slectedPhone = ''
  redirectionTypes = ['Абсолютная', 'Безусловная', 'По неответу', 'По занятости', 'По недоступности']
  selectedRedirectionType = ''
  get phoneToFormated () {
    return this.phoneTo.replace(/\D+/g, '')
  }
  get disabledPlug () {
    return !(this.slectedPhone && this.phoneTo && this.selectedRedirectionType)
  }
  createOrder () {
    this.creatingOrder = true
    if (!this.locationId) return
    this.$store.dispatch('salesOrder/createSaleOrder',
      {
        locationId: this.locationId,
        bpi: this.selectedPhoneId,
        offerId: '5850',
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
    if (this.timeFrom && this.timeTo) chars['Часы'] = `с ${this.timeFrom.slice(0, 2).replace(/\D+/g, '')} по ${this.timeTo.slice(0, 2).replace(/\D+/g, '')}`
    if (this.selectedRedirectionType) chars['Тип Переадресации'] = this.selectedRedirectionType
    if (this.phoneTo) chars['Переадресация на'] = this.phoneToFormated
    return chars
  }

  onCancel () {
    this.$emit('cancel')
  }
}
