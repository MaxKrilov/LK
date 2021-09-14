import { BREAKPOINT_MD, BREAKPOINT_LG } from '@/constants/breakpoint'
import Responsive from '@/mixins/ResponsiveMixin'
import { mapGetters } from 'vuex'
import AccessItem from '../access-item'
import ForpostAccessForm from '../forpost-access-form'
import OatsAccessForm from '../oats-access-form'
import ForpostAccessTable from '../forpost-access-table'
import OatsAccessTable from '../oats-access-table'
import { copyObject } from '@/functions/helper'
import { SYSTEM_NAMES } from '@/constants/profile'

export default {
  name: 'access-section',
  components: {
    AccessItem,
    ForpostAccessForm,
    ForpostAccessTable,
    OatsAccessForm,
    OatsAccessTable
  },
  mixins: [ Responsive ],
  data: () => ({
    pre: 'access-section',
    currentPortal: null,
    currentAccessRight: null,
    windowWidth: null,
    isShowAccessRight: false,
    isShowAddAccessRights: false,
    currSelectedMenuItem: {},
    forpostUsers: {}, // tmp storage for forpost users,
    oatsUsers: {}, // tmp storage for oats users,
    oatsUser: {},
    SYSTEM_NAMES
  }),
  mounted () {
    if (this.isSelectFirst) {
      this.$nextTick(() => {
        this.showFirstTab()
      })
    }
  },
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
  methods: {
    // Helpers
    showFirstTab () {
      const currData = this.value
      const first = currData[Object.keys(currData)[0]]
      if (!first) return
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

      if (currData[SYSTEM_NAMES.OATS] && Object.keys(this.oatsUser).length > 0) {
        this.oatsUsers[Object.keys(this.oatsUser)[0]] = Object.values(this.oatsUser)[0]
      }

      if (currData[SYSTEM_NAMES.OATS] && Object.keys(this.oatsUsers).length) {
        currData[SYSTEM_NAMES.OATS].content = [
          currData[SYSTEM_NAMES.OATS].accessRights.find(el => el.access === true)
        ]
        currData[SYSTEM_NAMES.OATS].users = {
          ...currData[SYSTEM_NAMES.OATS].users,
          ...this.oatsUsers
        }
      } else if (currData[SYSTEM_NAMES.OATS]) {
        currData[SYSTEM_NAMES.OATS].content = [
          currData[SYSTEM_NAMES.OATS]
            .accessRights
            .find(el => el.access === false)
        ]
      }

      if (currData[SYSTEM_NAMES.FORPOST] && Object.keys(this.forpostUsers).length) {
        currData[SYSTEM_NAMES.FORPOST].content = [
          currData[SYSTEM_NAMES.FORPOST].accessRights.find(el => el.access === true)
        ]
        currData[SYSTEM_NAMES.FORPOST].users = {
          ...currData[SYSTEM_NAMES.FORPOST].users,
          ...this.forpostUsers
        }
      } else if (currData[SYSTEM_NAMES.FORPOST]) {
        // нет пользователей - нет доступа
        currData[SYSTEM_NAMES.FORPOST].content = [currData[SYSTEM_NAMES.FORPOST].accessRights.find(el => el.access === false)]
      }

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
    onRemoveAccessItem ({ access }) {
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
    },
    onForpostUserSelected (data) {
      this.$set(this.forpostUsers, data.ID, data)
    },
    onOatsUserSelected (data) {
      if (Object.keys(this.oatsUser).length > 0) {
        this.oatsUser = {}
      }
      this.$set(this.oatsUser, `${data.domain}-${data.login}`, data)
    },
    onForpostUserDelete (data) {
      delete this.forpostUsers[data]

      let result = copyObject(this.value)

      if (!Object.keys(this.forpostUsers).length) {
        const newAccessRight = {
          id: 2,
          access: false,
          label: 'Без доступа'
        }
        result[this.currSelectedMenuItem.code].content = [newAccessRight]
      }
      result[SYSTEM_NAMES.FORPOST].users = copyObject(this.forpostUsers)
      this.$emit('input', result)
    },
    onOatsUserDelete (data) {
      delete this.oatsUsers[`${data.domain}-${data.login}`]

      let result = copyObject(this.value)

      if (!Object.keys(this.oatsUsers).length) {
        const newAccessRight = {
          id: 2,
          access: false,
          label: 'Без доступа'
        }
        result[this.currSelectedMenuItem.code].content = [newAccessRight]
      }

      result[SYSTEM_NAMES.OATS].users = copyObject(this.oatsUsers)
      this.$emit('input', result)
    }
  },
  watch: {
    value: {
      handler (val) {
        if (val?.[SYSTEM_NAMES.FORPOST]?.users) {
          this.forpostUsers = { ...val[SYSTEM_NAMES.FORPOST].users }
        }
        if (val?.[SYSTEM_NAMES.OATS]?.users) {
          this.oatsUsers = { ...val[SYSTEM_NAMES.OATS].users }
        }
      },
      deep: true
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
    forpostUserList () {
      return this.value[SYSTEM_NAMES.FORPOST].users || {}
    },
    oatsUserList () {
      return this.value[SYSTEM_NAMES.OATS].users || {}
    },
    isForpostSelected () {
      return this.currentPortal.code === SYSTEM_NAMES.FORPOST
    },
    isOatsSelected () {
      return this.currentPortal.code === SYSTEM_NAMES.OATS
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
