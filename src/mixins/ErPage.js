import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState({
      menuComponentBillingAccount: state => state.loading.menuComponentBillingAccount
    })
  }
})
export default class ErPage extends Vue {
  @Watch('menuComponentBillingAccount')
  async onMenuComponentBillingAccountChange (val) {
    if (!val) {
      await this.init()
    }
  }

  async init () {
    throw new Error('Method must be override')
  }

  async created () {
    if (!this.menuComponentBillingAccount) {
      await this.init()
    }
  }
}
