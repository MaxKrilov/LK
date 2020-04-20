import BreakpointMixin from '@/mixins/BreakpointMixin'
import ErChat from 'er-chat/dist/er-chat.esm'
import { mapGetters } from 'vuex'

export default {
  name: 'chat-wrap',
  mixins: [BreakpointMixin],
  props: {
    active: Boolean
  },
  data () {
    return {
      isOnline: false,
      operatorName: 'Людмила Закамская'
    }
  },
  watch: {
    isAllDataLoaded (val) {
      if (val) {
        this.startChat()
      }
    }
  },
  computed: {
    modalSide () {
      return this.isMinBreakpoint('XL') ? 'right' : 'bottom'
    },
    isAllDataLoaded () {
      return this.getClientInfo?.name &&
      this.getActiveBillingAccount &&
      this.getActiveBillingAccountNumber &&
      this.getChatToken && this.getTOMS
    },
    ...mapGetters('user', ['getClientInfo', 'getActiveBillingAccount', 'getActiveBillingAccountNumber']),
    ...mapGetters('chat', ['getChatToken']),
    ...mapGetters('auth', ['getTOMS'])
  },
  mounted () {
  },
  methods: {
    onClickClose () {
      this.$emit('close')
    },
    startChat () {
      this.chat = new ErChat({
        nickname: this.getClientInfo.name,
        subject: 'Обращение из ЛК',
        city: 'perm',
        userData: {
          token: this.getChatToken,
          agreementNumber: this.getActiveBillingAccountNumber,
          clientId: this.getTOMS,
          agreementId: this.getActiveBillingAccount,
          billingId: this.getActiveBillingAccount
        }
      })
      this.chat.attach(this.$refs.chatWrap)
    }
  }
}
