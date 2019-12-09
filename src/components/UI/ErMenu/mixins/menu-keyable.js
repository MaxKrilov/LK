import { addClass, removeClass } from '../../../../functions/helper'
import { keyCode } from '../../../../functions/keyCode'

export default {
  data: () => ({
    listIndex: -1,
    tiles: []
  }),
  props: {
    disableKeys: Boolean
  },
  watch: {
    isActive (val) {
      if (!val) {
        this.listIndex = -1
      }
    },
    listIndex (next, prev) {
      if (next in this.tiles) {
        const tile = this.tiles[next]
        addClass(tile, 'er-list__tile--highlighted')
        this.$refs.content.scrollTop = tile.offsetTop - tile.clientHeight
      }
      prev in this.tiles && removeClass(this.tiles[prev], 'er-list__tile--highlighted')
    }
  },
  methods: {
    onKeyDown (e) {
      if (e.keyCode === keyCode.DOM_VK_ESCAPE) {
        setTimeout(() => {
          this.isActive = false
        })
        const activator = this.getActivator()
        this.$nextTick(() => {
          activator && activator.focus()
        })
      } else if (e.keyCode === keyCode.DOM_VK_TAB) {
        setTimeout(() => {
          if (!this.$refs.content.contains(document.activeElement)) {
            this.isActive = false
          }
        })
      } else {
        this.changeListIndex(e)
      }
      this.$emit('keydown', e)
    },
    changeListIndex (e) {
      this.getTiles()
      if (e.keyCode === keyCode.DOM_VK_DOWN && this.listIndex < this.tiles.length - 1) {
        this.listIndex++
      } else if (e.keyCode === keyCode.DOM_VK_UP && this.listIndex > -1) {
        this.listIndex--
      } else if (e.keyCode === keyCode.DOM_VK_ENTER && this.listIndex !== -1) {
        this.tiles[this.listIndex].click()
      } else {
        return false
      }
      e.preventDefault()
    },
    getTiles () {
      this.tiles = this.$refs.content.querySelectorAll('.er-list__tile')
    }
  }
}
