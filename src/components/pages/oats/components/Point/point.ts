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
  loading: Boolean
}

@Component({ props })
export default class OATSPoint extends Vue {
  get isStopped () {
    return this.$props.status === POINT_STOPPED
  }

  get oatsPortalLink () {
    return { name: 'go-to-oats-portal' }
  }

  get restoreLink () {
    return '#restore-link'
  }

  get serviceCountPlural () {
    return getNoun(this.$props.serviceCount, '', 'а', 'ов')
  }
}
