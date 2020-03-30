import BreakpointMixin from '@/mixins/BreakpointMixin'
import ErChat from 'er-chat/dist/er-chat.esm'

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
    active (val) {
      if (val) {
        this.chat.connect()
      }
    }
  },
  computed: {
    modalSide () {
      return this.isMinBreakpoint('XL') ? 'right' : 'bottom'
    }
  },
  mounted () {
    this.chat = new ErChat({
      nickname: 'Максим Бредоносов',
      subject: 'Вопросы по ЛК',
      city: 'Пропердольск',
      onlineStatusHook: (isOnline) => {
        this.isOnline = isOnline
      }
    })
    this.chat.attach(this.$refs.chatWrap)
  },
  methods: {
    onClickClose () {
      this.$emit('close')
    }
  }
}
