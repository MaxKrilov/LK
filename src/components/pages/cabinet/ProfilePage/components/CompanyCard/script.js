import { NON_FILLED } from '../../../../../../constants/symbols'

export default {
  name: 'company-card',
  data: () => ({
    pre: 'company-card',
    emptyField: NON_FILLED
  }),
  props: {
    name: { type: String, default: NON_FILLED },
    inn: { type: String, default: NON_FILLED },
    kpp: { type: String, default: NON_FILLED },
    ogrn: { type: String, default: NON_FILLED },
    address: { type: String, default: NON_FILLED }
  },
  computed: {
    filled () {
      return this.inn && this.inn !== NON_FILLED
    }
  }
}
