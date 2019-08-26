import { eachArray } from '../functions/helper'

/**
 * @param {Array} children
 * @return {Array}
 */
function searchChildren (children) {
  const result = []
  eachArray(children, child => {
    if (child.isActive && child.isDependent) {
      result.push(child)
    } else {
      result.push(...searchChildren(child.$children))
    }
  })
  return result
}

export default {
  name: 'dependent',
  data: () => ({
    closeDependents: true,
    isActive: false,
    isDependent: true
  }),
  watch: {
    isActive (val) {
      if (val) return
      const openDependents = this.getOpenDependents()
      eachArray(openDependents, item => {
        item.isActive = false
      })
    }
  },
  methods: {
    getOpenDependents () {
      if (this.closeDependents) {
        return searchChildren(this.$children)
      }
      return []
    },
    getClickableDependentElements () {
      const result = [this.$el]
      if (this.$refs.content) {
        result.push(this.$refs.content)
      }
      if (this.overlay) {
        result.push(this.overlay)
      }
      result.push(...this.getOpenDependentElements())
      return result
    },
    getOpenDependentElements () {
      const result = []
      const openDependents = this.getOpenDependents()
      eachArray(openDependents, item => {
        result.push(...item.getClickableDependentElements())
      })
      return result
    }
  }
}
