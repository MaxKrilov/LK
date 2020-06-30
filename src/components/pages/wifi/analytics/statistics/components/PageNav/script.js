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
      })

      if (!result.includes(this.items[0]) || !result.includes(this.items[this.items.length - 1])) {
        result.reverse()
      }
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
