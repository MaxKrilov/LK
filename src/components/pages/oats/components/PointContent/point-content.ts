import { Vue, Component } from 'vue-property-decorator'

import PhoneRow from '../PhoneRow/index.vue'
import { CHARS } from '@/constants/videocontrol'

const DATE_FORMAT = 'DD.MM.YYYY'
const props = {
  value: {},
  purchasedPrices: {},
  name: String,
  actualStartDate: String,
  services: Array,
  phones: {}
}

const components = { PhoneRow }

@Component({ props, components })
export default class OATSPointContent extends Vue {
  get activeFrom () {
    return this.$moment(this.$props.actualStartDate).format(DATE_FORMAT)
  }

  get tariffName () {
    return this.$props.value?.chars[CHARS.NAME_IN_INVOICE]
  }

  get price () {
    return this.$props.value?.purchasedPrices?.recurrentTotal?.value
  }

  get oatsPortalLink () {
    return '#oats-portal-link'
  }

  onClickConfig () {
    this.$emit('config')
  }

  onClickSuspend () {
    this.$emit('suspend')
  }
}
