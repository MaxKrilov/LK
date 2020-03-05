import { Vue, Component, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  ...mapState({
    loadingClientInfo: (state: any) => state.loading.clientInfo
  })
})
export default class ErPage extends Vue {
  loadingClientInfo!: boolean

  @Watch('loadingClientInfo')
  async onLoadingClientInfo (val: boolean) {
    if (!val) {
      await this.init()
    }
  }

  async init () {
    throw new Error('Method must be override')
  }

  async created () {
    if (!this.loadingClientInfo) {
      await this.init()
    }
  }
}
