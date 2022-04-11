import BreakpointMixin from '@/mixins/BreakpointMixin'
import ErChat from 'er-chat/dist/er-chat.esm'
import { mapGetters } from 'vuex'
import { isCombat } from '@/functions/helper'

export default {
  name: 'chat-wrap',
  mixins: [BreakpointMixin],
  props: {
    active: Boolean
  },
  data () {
    return {
      isOnline: false,
      operatorName: ''
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
      this.getChatToken && this.getTOMS && this.getChatTokenTimeStapm
    },
    ...mapGetters('user', ['getClientInfo']),
    ...mapGetters('chat', ['getChatToken', 'getChatTokenTimeStapm', 'getChatTokenError']),
    ...mapGetters('auth', ['getTOMS']),
    ...mapGetters({
      getActiveBillingAccount: 'payments/getActiveBillingAccount',
      getActiveBillingAccountNumber: 'payments/getActiveBillingAccountNumber'
    })
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
        isProd: isCombat(),
        channelButtons: false,
        userData: {
          token: this.getChatToken,
          agreementNumber: this.getActiveBillingAccountNumber,
          clientId: this.getTOMS,
          agreementId: this.getActiveBillingAccount,
          userType: 'bss'
        },
        operatorNameHook: (name) => { if (name) this.operatorName = name },
        closeChatHook: () => { this.onClickClose() },
        onlineStatusHook: (status) => { this.isOnline = status }
      })
      this.chat.attach(this.$refs.chatWrap)
    }
  }
}
