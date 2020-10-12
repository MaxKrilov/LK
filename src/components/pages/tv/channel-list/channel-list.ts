import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITVChannel, ITVPacketInfo, ITVPacketPage } from '@/components/pages/tv/tv.d.ts'

const components = {}

@Component({ components })
export default class ChannelListPage extends Vue {
  @Prop() readonly packId: string | undefined

  list: ITVChannel[] = []
  loading: boolean = true
  pack: ITVPacketPage = {
    id: 0,
    title: '',
    price: '',
    description: '',
    count: '',
    icon: '',
    ncId: '',
    background: '',
    background2: '',
    background_mobile: '',
    productCode: '',
    created: '',
    updated: ''
  }

  get background () {
    return this.pack?.background2 || ''
  }
  mounted () {
    if (this.packId) {
      this.$store.dispatch('tv/channels', {
        api: this.$api,
        id: this.packId
      })
        .then((response: ITVPacketInfo) => {
          this.list = response.channels
          this.pack = response.packInfo
          this.pack.img = response?.packInfo?.background_mobile ? require(`@/assets/images/tv/${response.packInfo.background_mobile}.png`) : ''
          this.loading = false
        })
        .catch(() => {
          this.$router.push('/lk/tv')
        })
    } else {
      this.$router.push('/lk/tv')
    }
  }
}
