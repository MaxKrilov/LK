import ErSlideUpDown from '@/components/UI/ErSlideUpDown'
import { dataLayerPush } from '../../../functions/analytics'

export default {
  props: {
    title: String,
    items: Array,
    isExternal: Boolean
  },
  components: {
    ErSlideUpDown
  },
  data () {
    return {
      isExpanded: false
    }
  },
  methods: {
    onClickExpander () {
      this.$set(this, 'isExpanded', !this.isExpanded)
    },
    getLabelByTitle (title) {
      if (title.match(/интернет/ig)) return 'internet'
      if (title.match(/облачный атс/ig)) return 'cloudate'
      if (title.match(/hotspot/ig)) return 'wifihotspot'
      if (title.match(/видеонаблюдение/ig)) return 'cctv'
      if (title.match(/профиль/ig)) return 'account'
      if (title.match(/платежи/ig)) return 'payments'
      if (title.match(/документы/ig)) return 'documents'
      if (title.match(/поддержка/ig)) return 'support'
      if (title.match(/заказы/ig)) return 'orders'
    },
    dataLayerPush (title) {
      dataLayerPush({
        category: 'footer',
        label: this.getLabelByTitle(title)
      })
    }
  }
}
