import { Vue, Component } from 'vue-property-decorator'

import PhoneRow from '../PhoneRow/index.vue'
import { CHARS } from '@/constants/videocontrol'
import { price as priceFormatted } from '@/functions/filters'
import PackageMinuteCard from '@/components/pages/telephony/blocks/packageMinute/index.vue'
import { cloneDeep } from 'lodash'
import { IOATSService } from '@/interfaces/oats'

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

     get packagesMinutesList () {
       return this.$props.packagesMinutes.filter((item: { status: string }) => item.status !== 'Disconnected')
     }

     get oatsPortalLink () {
       return '#oats-portal-link'
     }

     get oatsLink () {
       return `/lk/oats/go-to-portal?bpi=${this.$props.bpi}&cityId=${this.$props.cityId}`
     }

     get listOfServices () {
       const services: IOATSService[] = cloneDeep(this.$props.services)

       let listOfServices: IOATSService[] = []

       /* попросили не выводить сервис, если не приходит следующая информация с бекенда
       1)chars?.['Имя в счете']
       2)description
       3)purchasedPrices.recurrentTotal.value
       */
       services.forEach(service => {
         if (service.chars?.['Имя в счете'] && service.description && service.purchasedPrices?.recurrentTotal?.value) listOfServices.push(service)
       })

       // в задаче WEB-28591 попросили приходящую с бекенда строку 'Подключение офиса' переименовывать в 'Плата за IP-телефон'
       listOfServices.forEach(service => {
         if (service.chars?.['Имя в счете'] === 'Подключение офиса') service.chars['Имя в счете'] = 'Плата за IP-телефон'
       })

       return listOfServices
     }

     onClickConfig () {
       this.$emit('config')
     }

     onClickSuspend () {
       this.$emit('suspend')
     }
}
