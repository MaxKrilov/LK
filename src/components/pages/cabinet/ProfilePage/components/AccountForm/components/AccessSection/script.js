import { BREAKPOINT_MD, BREAKPOINT_LG } from '@/constants/breakpoint'
import Responsive from '@/mixins/ResponsiveMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'access-section',
  mixins: [ Responsive ],
  data: () => ({
    pre: 'access-section',
    currentPortal: null,
    currentAccessRight: null,
    windowWidth: null,
    isShowAccessRight: false,
    isShowAddAccessRights: false,
    currSelectedMenuItem: {}
  }),
  props: {
    value: { type: null },
    isLPR: {
      type: Boolean,
      default: false
    },
    isChanged: {
      type: Boolean,
      default: false
    },
    isSelectFirst: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    if (this.isSelectFirst) {
      this.$nextTick(() => {
        this.showFirstTab()
      })
    }
  },
  methods: {
    // Helpers
    showFirstTab () {
      const currData = this.value
      const first = currData[Object.keys(currData)[0]]
      currData[first.code].menu.selected = true
      this.currSelectedMenuItem = first
      this.$emit('input', { ...this.value, ...currData })
    },
    addAccessRight () {
      const currData = this.value
      const newAccessRight = {
        access: this.currentAccessRight.access,
        label: this.currentAccessRight.value
      }
      currData[this.currentPortal.code].content = [newAccessRight]
      this.$emit('input', { ...this.value, ...currData })
    },
    removeAccessRight () {
      const currData = this.value
      // TODO: remove hard data and use remote data
      const newAccessRight = {
        id: 2,
        access: false,
        label: 'Без доступа'
      }
      currData[this.currSelectedMenuItem.code].content = [newAccessRight]
      this.$emit('input', { ...this.value, ...currData })
    },
    isCurrentBreakpoint (bp) {
      switch (bp) {
        case 'sm':
          return this.windowWidth < BREAKPOINT_MD
        case 'md':
          return this.windowWidth >= BREAKPOINT_MD && this.windowWidth < BREAKPOINT_LG
        case 'lg':
          return this.windowWidth >= BREAKPOINT_LG
        default:
          return false
      }
    },
    reset () {
      this.currentPortal = null
      this.currentAccessRight = null
      this.isShowAddAccessRights = false
    },
    showActiveTab (index) {
      const target = document.getElementById(index)
      if (target) {
        target.parentNode.scrollLeft = target.offsetLeft
      }
    },
    // Handlers
    handleMenuItemClick (item) {
      const { code } = item

      this.$nextTick(() => { this.showActiveTab(`${code}-${this._uid}`) })

      const currSelectedId = code
      const prevSelectedId = this.currSelectedMenuItem?.code

      if (currSelectedId === prevSelectedId) return

      const currData = this.value
      const currSelected = currData[currSelectedId]
      const prevSelected = currData[prevSelectedId]

      this.currSelectedMenuItem = currSelected

      if (prevSelected) {
        currData[prevSelectedId].menu.selected = false
      }
      currData[currSelectedId].menu.selected = true
      this.$emit('input', { ...this.value, ...currData })
    },
    handleContentItemBtnClick ({ access }) {
      if (access) {
        this.removeAccessRight()
      }
    },
    handleAddClick () {
      if (this.isShowAddAccessRights) {
        if (!this.currentPortal || !this.currentAccessRight) return
        this.addAccessRight()
        this.reset()
      } else {
        this.isShowAddAccessRights = true
      }
    },
    handleCancelClick () {
      this.reset()
    },
    handlePortalChange () {
      const { content, code } = this.value[this.currentPortal.code]
      this.$nextTick(() => {
        this.currentAccessRight = {
          code: `${code}-${content[0].id}`,
          access: content[0].access,
          value: content[0].label
        }
      })
    }
  },
  computed: {
    ...mapGetters('directories', [
      'systemsDirectory'
    ]),
    portalsCount () {
      return Object.keys(this.value).length
    },
    portalLabels () {
      return Object.values(this.value).map(item => ({
        id: item.id,
        code: item.code,
        value: item.menu.label,
        accessRights: item.accessRights
      }))
    },
    accessRightsLabels () {
      if (this.currentPortal) {
        const { accessRights, code } = this.value[this.currentPortal.code]
        return accessRights.map(item => ({
          code: `${code}-${item.id}`,
          access: item.access,
          value: item.label
        }))
      }
      return []
    },
    contents () {
      if (this.currSelectedMenuItem.content) {
        return this.currSelectedMenuItem.content
      }
      return ''
    }
  }
}
