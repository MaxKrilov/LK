import { Vue, Component } from 'vue-property-decorator'

import PhoneRow from '../PhoneRow/index.vue'
import { CHARS } from '@/constants/videocontrol'
import PackageMinuteCard from '../packageMinute/index.vue'
import { price as priceFormatted } from '@/functions/filters'

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
  packagesMinutes: []
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

     onClickConfig () {
       this.$emit('config')
     }

     onClickSuspend () {
       this.$emit('suspend')
     }
}
