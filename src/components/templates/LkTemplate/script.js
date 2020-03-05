import MenuComponent from './components/MenuComponent/index'
import ErFooter from '@/components/blocks/ErFooter'
import { mapGetters, mapState } from 'vuex'
import ErErrorModal from '@/components/blocks/ErErrorModal'

export default {
  name: 'lk-template',
  components: {
    MenuComponent,
    ErFooter,
    ErErrorModal
  },
  data: () => ({
    pre: 'lk-template'
  }),
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
