export default {
  name: 'company-card',
  data: () => ({
    pre: 'company-card'
  }),
  props: {
    name: { type: String, default: '-' },
    inn: { type: String, default: '-' },
    kpp: { type: String, default: '-' },
    ogrn: { type: String, default: '-' },
    address: { type: String, default: '-' },
    filled: { type: Boolean, default: true }
  }
}
