import ResponsiveMixin from '@/mixins/ResponsiveMixin'
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent'
import Submenu from './components/Submenu'

export default {
  name: 'wifi-analytics-statistics',
  components: {
    ListPointComponent,
    Submenu
  },
  mixins: [ResponsiveMixin],
  props: {},
  data: () => ({
    pre: 'statistics'
  }),
  computed: {
    isMobile () {
      return this.isXS || this.isSM
    }
  },
  methods: {
    selectSubpage (name) {
      this.$router.push({ name: name })
    }
  }
}
