import { Vue, Component, Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { ITVPacketPage, IModuleInfo } from '@/components/pages/tv/tv.d.ts'

@Component({
  components: {},
  computed: {
    ...mapGetters('user', ['getAddressList'])
  }
})
export default class TVPackagesPage extends Vue {
  @Prop() readonly line: IModuleInfo | undefined

  loading: boolean = true
  packages:any = []

  mounted () {
    this.$store.dispatch('tv/packs', { api: this.$api })
      .then((answer: ITVPacketPage[]) => {
        if (answer) {
          const packetsName: string[] = [...new Set(answer.map((el:ITVPacketPage) => el.title))]
          this.packages = packetsName
            .map((el:string) => answer.find((_el:ITVPacketPage) => _el.title === el))
          this.packages = this.packages.map((el:any) => {
            const _el = el
            try {
              _el.img = _el?.backgroundMobile ? require(`@/assets/images/tv/${_el?.backgroundMobile}.png`) : ''
            } catch {
              _el.img = ''
            }
            return _el
          })
        }
      })
      .finally(() => {
        this.loading = false
      })
  }
}
