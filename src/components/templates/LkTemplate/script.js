import MenuComponent from './components/MenuComponent/index'
import ErFooter from '@/components/blocks/ErFooter'
import { mapGetters, mapState, mapMutations } from 'vuex'
import ErErrorModal from '@/components/blocks/ErErrorModal'

import ChatWrap from './components/ChatWrap'
import ChatButton from './components/ChatButton'
import NotificationPanel from './components/NotificationPanel'

export default {
  name: 'lk-template',
  components: {
    ChatWrap,
    ChatButton,
    ErErrorModal,
    ErFooter,
    MenuComponent,
    NotificationPanel
  },
  data: () => ({
    pre: 'lk-template',
    showNotificationPanel: false,
    showChatPanel: false
  }),
  methods: {
    ...mapMutations('chat', [
      'openChat', 'closeChat'
    ]),
    onOpenChat () {
      this.openChat()
    },
    onCloseChat () {
      this.closeChat()
    },
    onCloseNotificationPanel () {
      this.showNotificationPanel = false
    },
    onOpenNotifications () {
      this.showNotificationPanel = true
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapGetters('chat', [
      'isOpenChat'
    ]),
    ...mapState({
      'auth': state => state.auth
    })
  },
  mounted () {}
}
