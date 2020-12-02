import { Vue, Component, Prop } from 'vue-property-decorator'
import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

const components = { ErPlugProduct }

@Component({ components })
export default class VpnSlider extends Vue {
  @Prop({ type: String }) readonly bpi: string | undefined
  @Prop({ type: String }) readonly fulladdress: string | undefined
  @Prop({ type: String }) readonly addressId: string | undefined
  loading: boolean = true
  speed: string = ''
  class1: string = ''
  actualStartDate: string = ''
  tariff: string = ''
  webName: string = ''
  isConnectionSpeed: boolean = false
  isConnectionClass: boolean = false

  get requestDataSpeed () {
    return {
      descriptionModal: 'Для увеличения скорости нужно сформировать заявку на вашего персонального менеджера',
      addressId: this.addressId,
      services: 'Увеличение скорости VPN',
      type: 'change',
      fulladdress: this.fulladdress
    }
  }
  get requestDataClass () {
    return {
      descriptionModal: 'Для изменения класса обслуживания нужно сформировать заявку на вашего персонального менеджера',
      addressId: this.addressId,
      services: 'Изменения класса обслуживания ',
      type: 'change',
      fulladdress: this.fulladdress
    }
  }
  get date () {
    return this.actualStartDate ? this.$moment(this.actualStartDate).format('DD.MM.YYYY') : ''
  }

  mounted () {
    this.$store.dispatch('productnservices/customerProducts', {
      api: this.$api,
      parentIds: [this.bpi]
    })
      .then((response) => {
        if (response?.[this.bpi!]) {
          this.speed = response[this.bpi!]?.tlo?.chars?.['Полоса пропускания, Мбит/с']
          this.class1 = response[this.bpi!]?.tlo?.chars?.['Класс обслуживания']
          this.webName = response[this.bpi!]?.tlo?.chars?.['Наименование VPN cети']
          this.actualStartDate = response[this.bpi!]?.tlo?.actualStartDate
          this.tariff = response[this.bpi!]?.tlo?.name
        }
        this.loading = false
      })
      .catch(() => {})
  }
}
