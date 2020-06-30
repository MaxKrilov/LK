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
    pre: 'statistics',
    subpage: ''
  }),
  computed: {
    isMobile () {
      return this.isXS || this.isSM
    }
  },
  methods: {
    selectSubpage (name) {
      const routeName = this.$router.currentRoute.name
      if (routeName !== name) {
        this.$router.push({ name: name })
        this.subpage = name
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.subpage = to.name
    next()
  }
}
