import { Vue, Component } from 'vue-property-decorator'
import { POINT_STOPPED } from '@/components/pages/oats/types'
import { getNoun } from '@/functions/helper'

const props = {
  address: String,
  status: String,
  price: String,
  name: String,
  actualStartDate: String,
  serviceCount: Number,
  value: Object,
  loading: Boolean,
  inTheProcessOfActivation: Boolean,
  tariff: String,
  bpi: String,
  cityId: String
}

@Component({ props })
export default class OATSPoint extends Vue {
  // data
  isOpen: boolean = false;

  get isStopped () {
    return this.$props.status === POINT_STOPPED
  }

  get oatsPortalLink () {
    return `/lk/oats/go-to-portal?bpi=${this.$props.bpi}&cityId=${this.$props.cityId}`
  }

  get restoreLink () {
    return '#restore-link'
  }

  get serviceCountPlural () {
    return getNoun(this.$props.serviceCount, '', 'а', 'ов')
  }
}
