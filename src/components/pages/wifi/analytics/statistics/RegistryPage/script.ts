import Header from '../components/Header/index.vue'
import PageNav from '../components/PageNav/index.vue'
import UserRow from '../components/UserRow/index.vue'
import UserCard from '../components/UserCard/index.vue'
import ErTableFilter from '@/components/blocks/ErTableFilter'
import ErButton from '@/components/UI/ErButton'
import ErIcon from '@/components/UI/ErIcon'
import ErDialog from '@/components/UI/ErDialog'
import { UsersRegistryComponent, User } from '../types'
import {USERS_LIST, USERS_MAX, USERS_MORE} from '../mock'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG, BREAKPOINT_XL } from '@/constants/breakpoint'

import Window from './window'

export default {
  name: 'wifi-users-registry',
  components: {
    'stat-header': Header,
    'page-nav': PageNav,
    'user-row': UserRow,
    'user-card': UserCard,
    'er-table-filter': ErTableFilter,
    'er-button': ErButton,
    'er-icon': ErIcon,
    'er-dialog': ErDialog
  },
  computed: {
    hasLastRow () {
      return this.lastRow != null
    },
    fixedHeader () {
      let header
      if (Window.innerWidth < BREAKPOINT_SM) {
        header = 56
      } else if (Window.innerWidth < BREAKPOINT_LG) {
        header = 64
      } else if (Window.innerWidth < BREAKPOINT_XL) {
        header = 72
      } else {
        header = 96
      }
      const top = Window.scrollY + header
      return this.$refs?.thead && this.$refs.thead.offsetTop < top
    },
    ...mapState({
      getTotalText (state: any) {
        return state.variables[SCREEN_WIDTH] < BREAKPOINT_LG ? 'Всего автор.' : 'Всего авториз.'
      },
      isFullscreenDialog (state: any) {
        return state.variables[SCREEN_WIDTH] < BREAKPOINT_MD
      },
      isDialogShow (state: any) {
        return state.variables[SCREEN_WIDTH] < BREAKPOINT_XL
      },
      getWidth (state: any) {
        return state.variables[SCREEN_WIDTH] < BREAKPOINT_MD ? '100%' : '485px'
      }
    })
  } as Partial<UsersRegistryComponent>,
  methods: {
    showMore (count: number) {
      if (!this.rows) {
        return
      }
      const total = Math.min(this.rows.length + count, USERS_MAX)
      let index = this.rows.length
      while (index <= total) {
        for (let item of USERS_LIST) {
          index++
          if (index > total) {
            break
          }
          this.rows.push({
            ...item,
            number: index.toLocaleString()
          })
        }
      }
      this.moreCounts = USERS_MORE.filter(i => i + index < USERS_MAX)
      if (this.moreCounts.length === 0) {
        const length = USERS_MAX - index + 1;
        this.moreCounts = length > 0 ? [length] : [];
      }
      if (index > USERS_MAX) {
        this.lastRow = null
      }
    },
    scrollTop () {
      this.$scrollTo('.page-header')
    },
    toggleCardDialog () {
      this.showDialog = this.isDialogShow && !this.showDialog
    },
    selectRow (row: User) {
      this.currentRow = row
      this.toggleCardDialog()
    }
  } as Partial<UsersRegistryComponent>,
  props: {
    sortField: {
      type: String,
      default: 'authorization'
    },
    sortOrder: {
      type: String,
      default: 'asc'
    }
  },
  data: () => ({
    pre: 'stat-template',
    rows: USERS_LIST.slice(0, -1),
    lastRow: USERS_LIST.slice(-1)[0],
    currentRow: null,
    showDialog: false,
    moreCounts: USERS_MORE
  })
}
