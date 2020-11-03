import Vue from 'vue'
import Component from 'vue-class-component'

import StatHeader from '../components/Header/index.vue'
import PageFooter from '../components/PageFooter/index.vue'
import UserRow from '../components/UserRow/index.vue'
import UserCard from '../components/UserCard/index.vue'
import ErTableFilter from '@/components/blocks/ErTableFilter'
import UserDialog from '../components/UserDialog/index.vue'
import { User } from '../types'
import { USERS_MAX, USERS_MORE } from '../mock'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_LG, BREAKPOINT_XL } from '@/constants/breakpoint'

import moment from 'moment'
import { head } from 'lodash'

import Window from './window'
import { IWifiResourceInfo, IWifiStatUser } from '@/tbapi'

const DATE_FORMAT = 'DD.MM.YYYY'
const DATE_FORMAT_REQUEST = 'YYYYMMDDHH'

const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = 60 * 60

const getTraffic = (bytes: number) => {
  const tb = 2 ** 40
  const gb = 2 ** 30
  const mb = 2 ** 20
  const kb = 2 ** 10
  if (bytes >= tb) return { value: (bytes / tb).toFixed(1).toString(), units: 'ТБ' }
  if (bytes >= gb) return { value: (bytes / gb).toFixed(1).toString(), units: 'ГБ' }
  if (bytes >= mb) return { value: (bytes / mb).toFixed(1).toString(), units: 'МБ' }
  if (bytes >= kb) return { value: (bytes / mb).toFixed(1).toString(), units: 'КБ' }
  return { value: bytes.toString(), units: 'Б' }
}

const parseDuration = (duration: number) => {
  let hours: number = duration / SECONDS_IN_HOUR
  hours = hours > 1 ? Math.floor(hours) : 0
  duration = duration - hours * SECONDS_IN_HOUR

  let minutes: number = duration / SECONDS_IN_MINUTE
  minutes = minutes > 1 ? Math.floor(minutes) : 0

  return { hours: hours.toString(), minutes: minutes.toString() }
}

const parseLastSession = (input: string) => {
  let [firstDate, secondDate] = input.split('-')
  const firstDateMoment = moment(firstDate.trim(), 'DD.MM.YYYY HH:mm')
  secondDate = secondDate.trim()
  let secondDateMoment

  if (secondDate.length === 5) {
    secondDateMoment = moment(`${firstDateMoment.format('DD.MM.YYYY')} ${secondDate}`, 'DD.MM.YYYY HH:mm')
  } else {
    secondDateMoment = moment(secondDate, 'DD.MM.YYYY HH:mm')
  }

  const duration = moment.duration(secondDateMoment.diff(firstDateMoment)).asSeconds()

  return {
    datetime: { date: firstDateMoment.format('DD.MM.YYYY'), time: firstDateMoment.format('HH:mm') },
    duration: parseDuration(duration)
  }
}

const transformData = (data: IWifiStatUser[]) => {
  return data.map((dataItem, idx: number) => {
    const number = (idx + 1).toString()
    const phone = dataItem.user_name.replace(/(\d{1})(\d{3})(\d{2})(\d{3})(\d{2})/, '+$1 ($2) $3-$4-$5')
    const mac = dataItem.mac_address
    const authorization = dataItem.count_auth.toString()
    const traffic = getTraffic(dataItem.output_bytes)
    const parsedLastSession = parseLastSession(dataItem.last_session)
    const datetime = parsedLastSession.datetime
    const duration = parsedLastSession.duration
    const dateRegistration = dataItem.date_reg

    return {
      number,
      phone,
      mac,
      authorization,
      traffic,
      datetime,
      duration,
      dateRegistration
    }
  })
}

@Component<InstanceType<typeof WifiUsersRegistry>>({
  // @ts-ignore
  components: { StatHeader, PageFooter, UserRow, UserCard, ErTableFilter, UserDialog },
  props: {
    sortField: {
      type: String,
      default: 'authorization'
    },
    sortOrder: {
      type: String,
      default: 'asc'
    },
    vlanInfo: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
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
  },
  watch: {
    vlanInfo () {
      (this as any).init()
    },
    periodType () {
      (this as any).$nextTick(() => {
        (this as any).init()
      })
    }
  }
})
export default class WifiUsersRegistry extends Vue {
  // Vuex
  getTotalText!: string
  isFullscreenDialog!: boolean
  isDialogShow!: boolean
  getWidth!: string

  // Props
  readonly sortField!: string
  readonly sortOrder!: string
  readonly vlanInfo!: IWifiResourceInfo

  // Data
  pre = 'stat-template'
  rows: User[] = []
  lastRow: User| null = null
  currentRow: User | null = null
  showDialog = false
  moreCounts = USERS_MORE
  period = ''
  periodDate = {
    from: '',
    to: ''
  }

  // Computed
  get hasLastRow () {
    return this.lastRow != null
  }
  get fixedHeader () {
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
    return this.$refs?.thead && (this.$refs.thead as any).offsetTop < top
  }

  // Methods
  showMore (count: number) {
    if (!this.rows) {
      return
    }
    const total = Math.min(this.rows.length + count, USERS_MAX)
    let index = this.rows.length
    while (index <= total) {
      for (let item of this.rows) {
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
      const length = USERS_MAX - index + 1
      this.moreCounts = length > 0 ? [length] : []
    }
    if (index > USERS_MAX) {
      this.lastRow = null
    }
  }
  scrollTop () {
    this.$scrollTo('.page-header')
  }
  toggleCardDialog () {
    this.showDialog = this.isDialogShow && !this.showDialog
  }
  selectRow (row: User) {
    this.currentRow = row
    this.toggleCardDialog()
  }
  setPeriod (val: Date[]) {
    if (!Array.isArray(val) || val.length !== 2) return
    this.periodDate.from = moment(val[0]).format(DATE_FORMAT_REQUEST)
    this.periodDate.to = moment(val[1]).format(DATE_FORMAT_REQUEST)
    this.period = `${moment(val[0]).format(DATE_FORMAT)} - ${moment(val[1]).format(DATE_FORMAT)}`
    this.$nextTick(() => {
      this.init()
    })
    return this.period
  }
  init () {
    if (!this.vlanInfo || !this.vlanInfo.hasOwnProperty('vlan')) return
    const { cityId, number } = head(this.vlanInfo.vlan)!
    this.$store.dispatch('wifi/bigDataStatUser', {
      vlan: number,
      cityId,
      dateFrom: this.periodDate.from,
      dateTo: this.periodDate.to
    })
      .then(response => {
        this.rows = transformData(response)
        this.lastRow = this.rows.slice(-1)[0]
      })
  }

  beforeMount () {
    this.init()
  }
}
