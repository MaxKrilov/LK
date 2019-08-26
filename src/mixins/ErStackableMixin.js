import { eachArray, getZIndex, isUndefined } from '../functions/helper'

export default {
  name: 'stackable',
  data: () => ({
    stackClass: 'unpecified',
    stackElement: null,
    stackExclude: null,
    stackMinZIndex: 0,
    isActive: false
  }),
  computed: {
    activeZIndex () {
      if (isUndefined(window)) {
        return 0
      }
      const content = this.stackElement || this.$refs.content
      const index = !this.isActive
        ? getZIndex(content)
        : this.getMaxZIndex(this.stackExclude || [content]) + 2
      if (index === null) {
        return index
      }
      return parseInt(index)
    }
  },
  methods: {
    getMaxZIndex (exclude = []) {
      const base = this.$el
      const zis = [this.stackMinZIndex, getZIndex(base)]
      const activeElements = [...document.getElementsByClassName(this.stackClass)]
      eachArray(activeElements, el => {
        if (exclude.includes(el)) {
          zis.push(getZIndex(el))
        }
      })
      return Math.max(...zis)
    }
  }
}
