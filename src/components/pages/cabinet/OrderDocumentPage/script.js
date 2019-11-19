import OrderDocumentFormWrap from './components/OrderFormWrap'
import BreakpointMixin from '@/mixins/BreakpointMixin'

export default {
  name: 'order-document-page',
  components: {
    OrderDocumentFormWrap
  },
  mixins: [BreakpointMixin],
  data () {
    return {
      fromTime: '12:00',
      toTime: '13:00',
      description: '',
      isFormSended: false,
      successEmail: 'konstantinopolsky@company.ru'
    }
  },
  computed: {
    textareaRows () {
      if (this.isMobile) {
        return 1
      } else {
        return 12
      }
    },
    classObject () {
      return {
        'er-document-order--mobile': this.isMobile,
        'er-document-order--success': this.isFormSended
      }
    }
  },
  methods: {
    currentComponent () {
      return this.isMobile ? 'er-dialog' : 'order-document-form-wrap'
    },
    onFormSend () {
      this.$set(this, 'isFormSended', true)
    }
  }
}
