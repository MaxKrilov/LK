
import { SUBPAGES } from '../../subpages'

export default {
  name: 'Submenu',
  data: () => ({
    items: SUBPAGES,
    pre: 'submenu',
    currentItemIdx: 0
  }),
  methods: {
    onSelect (val, idx, e) {
      this.currentItemIdx = idx
      this.$emit('input', val)
    }
  }
}
