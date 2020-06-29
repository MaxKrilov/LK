import { SUBPAGES } from '../../subpages'

export default {
  name: 'PageNav',
  data: () => ({
    pre: 'page-nav',
    items: SUBPAGES
  }),
  computed: {
    navItems () {
      const routeName = this.$router.currentRoute
      const result = this.items.filter((item) => {
        return item.value !== routeName.name
      }).reverse()
      return result
    }
  },
  methods: {
    onSelect (val, idx, e) {
      this.currentItemIdx = idx
      this.$emit('input', val)
    }
  }
}
