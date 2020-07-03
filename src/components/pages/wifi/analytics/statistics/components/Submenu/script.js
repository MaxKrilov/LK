import findIndex from 'lodash/findIndex'
import { SUBPAGES } from '../../subpages'

export default {
  name: 'Submenu',
  props: {
    subpage: {
      type: String,
      default: SUBPAGES[0].value
    }
  },
  data: () => ({
    items: SUBPAGES,
    pre: 'submenu',
    currentItemIdx: 0
  }),
  computed: {
    activeTabClass () {
      let className = ''
      if (this.currentItemIdx === 0) {
        className = 'is-first-active'
      }
      if (this.currentItemIdx === this.items.length - 1) {
        className = 'is-last-active'
      }
      return className
    }
  },
  mounted () {
    const routeName = this.$router.currentRoute.name
    const index = this.findSubpageIndex(routeName)
    this.onSelect(routeName, index)
  },
  methods: {
    onSelect (val, idx) {
      this.currentItemIdx = idx
      this.$emit('input', val)
    },
    findSubpageIndex (name) {
      return findIndex(this.items, (o) => (o.value === name))
    }
  },
  watch: {
    subpage (val) {
      this.currentItemIdx = this.findSubpageIndex(val)
    }
  }
}
