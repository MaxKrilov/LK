import MenuComponent from './components/MenuComponent/index'
import ErFooter from '@/components/blocks/ErFooter'
import { mapGetters, mapState } from 'vuex'
import ErErrorModal from '@/components/blocks/ErErrorModal'

import ChatWrap from './components/ChatWrap'
import NotificationPanel from './components/NotificationPanel'

export default {
  name: 'lk-template',
  components: {
    ChatWrap,
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
    onOpenChat () {
      this.showChatPanel = true
    },
    onCloseChat () {
      this.showChatPanel = false
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
    ...mapState({
      'auth': state => state.auth
    })
  },
  mounted () {
    // console.log(this.user)
    // 'customer/account/client-info'
    // this.$api
    //   .setData({
    //     _token: this.auth.accessToken,
    //     id: this.user.tomsId
    //   })
    //   .query('/customer/manager/index')
  }
}
