import { Vue, Component } from 'vue-property-decorator'

import PhoneRow from '../PhoneRow/index.vue'
import { CHARS } from '@/constants/videocontrol'
import { price as priceFormatted } from '@/functions/filters'
import PackageMinuteCard from '@/components/pages/telephony/blocks/packageMinute/index.vue'

const DATE_FORMAT = 'DD.MM.YYYY'
const props = {
  value: {},
  purchasedPrices: {},
  name: String,
  actualStartDate: String,
  services: Array,
  phones: {},
  bpi: String,
  cityId: String,
  inTheProcessOfActivation: Boolean,
  packagesMinutes: Array
}

const components = {
  PhoneRow,
  PackageMinuteCard }

@Component({
  props,
  components,
  filters: {
    priceFormatted
  }
})
export default class OATSPointContent extends Vue {
     limitOfPackageMinutes:number = 0
     minutesLeft:number = 0
     pre:string = 'oats-point-content'

     get activeFrom () {
       return this.$moment(this.$props.actualStartDate).format(DATE_FORMAT)
     }

     get tariffName () {
       return this.$props.value?.chars?.[CHARS.NAME_IN_INVOICE]
     }

     get price () {
       return this.$props.value?.purchasedPrices?.recurrentTotal?.value
     }

     get oatsPortalLink () {
       return '#oats-portal-link'
     }

     get oatsLink () {
       return `/lk/oats/go-to-portal?bpi=${this.$props.bpi}&cityId=${this.$props.cityId}`
     }

     get listOfServices () {
       let services = this.$props.services

       // в задаче WEB-28591 попросили приходящую с бекенда строку 'Подключение офиса' переименовывать в 'Плата за IP-телефон'
       services.forEach((service: { chars: { [x: string]: string } }) => {
         if (service.chars['Имя в счете'] === 'Подключение офиса') service.chars['Имя в счете'] = 'Плата за IP-телефон'
       })

       return services
     }

     onClickConfig () {
       this.$emit('config')
     }

     onClickSuspend () {
       this.$emit('suspend')
     }
}
