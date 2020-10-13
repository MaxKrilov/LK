import BreakpointMixin from '@/mixins/BreakpointMixin'
import { CODE_PHONE_CHANNEL, ARRAY_SHOWN_PHONES } from '@/constants/product-code.ts'

export default {
  name: 'connected-phone',
  mixins: [BreakpointMixin],
  props: {
    phone: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      pre: 'connected-phone',
      isOpen: false,
      ksi: 0
    }
  },
  computed: {
    number () {
      return this.phone?.number || ''
    },
    price () {
      return this.phone?.price || ''
    }
  },
  methods: {
    remove () {
      this.$emit('disconnect')
    },
    getMoreInfo () {
      if (this.isOpen) {
        this.isOpen = false
      } else {
        this.$store.dispatch('productnservices/customerProducts', {
          api: this.$api,
          parentIds: [this.phone?.productId]
        }).then(answer => {
          this.isOpen = true
          this.ksi = answer[this.phone.productId]?.slo
            .find(el => el?.offer?.code === CODE_PHONE_CHANNEL)
            ?.chars?.['Дополнительные каналы серийного искания'] ||
            answer[this.phone.productId]?.slo
            .find(el => ARRAY_SHOWN_PHONES.includes(el?.offer?.code))?.chars?.['Количество каналов серийного искания по умолчанию']
        }).catch(() => {
        })
      }
    }
  }
}
