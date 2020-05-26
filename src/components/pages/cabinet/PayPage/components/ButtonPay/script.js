import { mapState } from 'vuex'
import ErDocumentViewer from '../../../../../blocks/ErDocumentViewer/index'

export default {
  name: 'button-pay',
  components: {
    ErDocumentViewer
  },
  props: ['timer'],
  data: () => ({
    pre: 'button-pay',
    day: '2',
    hour: '23',
    minute: '59',
    isOpenViewer: false
  }),
  computed: {
    ...mapState({
      id: state => state.user.activeBillingAccount,
      invPaymentsForViewer: state => state.payments.invPaymentsForViewer
    })
  },
  watch: {
    invPaymentsForViewer () {
      this.$emit('isOpenView', this.invPaymentsForViewer)
    }
  },
  methods: {
    invPayment () {
      this.$store.dispatch('payments/invPayment', { api: this.$api, id: this.id })
    }
  }
}
