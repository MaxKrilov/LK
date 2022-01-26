import Vue from 'vue'
import Component from 'vue-class-component'

// Components
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

// Filters
import { formatPhone } from '@/functions/filters'

// Constants
import * as CONST from '../../constants'
import { mapActions } from 'vuex'
import { ISaleOrder } from '@/tbapi'
import moment from 'moment'
import { logInfo } from '@/functions/logging'
import head from 'lodash/head'
import { ErtTextField } from '../../../../../UI2/ErtTextField'
import Inputmask from 'inputmask'
import { ITelephonyRedirection } from '@/interfaces/telephony'
import {
  STATUS_ACTIVATION_IN_PROGRESS,
  STATUS_ACTIVE,
  STATUS_DISCONNECTION_IN_PROGRESS,
  STATUS_DISCONNECTION_PASSED_PONR
} from '@/constants/status'

const CHAR_HOURS = 'Часы'
const CHAR_TYPE = 'Тип Переадресации'

// Functions-helpers
const transformDayOfWeek = (day: string) => {
  switch (day) {
    case CONST.MONDAY:
      return 'Пн'
    case CONST.TUESDAY:
      return 'Вт'
    case CONST.WEDNESDAY:
      return 'Ср'
    case CONST.THURSDAY:
      return 'Чт'
    case CONST.FRIDAY:
      return 'Пт'
    case CONST.SATURDAY:
      return 'Сб'
    case CONST.SUNDAY:
      return 'Вс'
  }
}

@Component<InstanceType<typeof ErtRedirectionItemComponent>>({
  components: {
    ErActivationModal
  },
  props: {
    id: String,
    phoneId: String,
    fromPhone: String,
    toPhone: String,
    type: String,
    hoursFrom: String,
    hoursTo: String,
    period: {
      type: Object,
      default: () => ({})
    },
    parent: {
      type: Object,
      default: () => ({})
    },
    status: String,
    redirectionStatus: String,
    listPhone: {
      type: Array,
      default: () => ([])
    },
    listRedirection: {
      type: Array,
      default: () => ([])
    }
  },
  filters: {
    formatPhone,
    formatPeriodDays: (val: Record<string, boolean>) =>
      CONST.DAYS_ARRAY.filter(item => val[item]).map(transformDayOfWeek).join(', ')
  },
  watch: {
    internalType (val, oldVal) {
      if (val.length > 1) {
        this.internalType = val.slice(1)
      } else if (val.length === 0) {
        this.$nextTick(() => {
          this.internalType = oldVal
        })
      }
    },
    internalPeriod (val) {
      this.isErrorSettingsDays = val.length === 0
    },
    isShowSettingsDialog (val) {
      val && this.$nextTick(() => {
        this.defineMask()
      })
    }
  },
  methods: {
    ...mapActions({
      createDisconnectOrder: 'salesOrder/createDisconnectOrder',
      acceptSaleOrder: 'salesOrder/send',
      createModifyOrder: 'salesOrder/createModifyOrder'
    })
  }
})
export default class ErtRedirectionItemComponent extends Vue {
  // Options
  $refs!: {
    'time-from': InstanceType<typeof ErtTextField>,
    'time-to': InstanceType<typeof ErtTextField>
  }
  // Props
  readonly id!: string
  readonly phoneId!: string
  readonly fromPhone!: string
  readonly toPhone!: string
  readonly type!: string
  readonly hoursFrom!: string
  readonly hoursTo!: string
  readonly period!: Record<string, boolean>
  readonly parent!: {
    bpi: string,
    locationId: string,
    marketId: string
  }
  readonly status!: string
  readonly redirectionStatus!: string
  readonly listPhone!: { id: string, phone: string, redirectionOfferId: string, status: string }[]
  readonly listRedirection!: ITelephonyRedirection[]

  // Data
  /// Flags
  isNotAccessChange: boolean = false

  isDeleteRequest: boolean = false
  isDeleteSuccess: boolean = false
  isDeleteError: boolean = false
  isDeleteConfirm: boolean = false

  isUpdateRequest: boolean = false
  isUpdateSuccess: boolean = false
  isUpdateError: boolean = false

  isRequestSuccess: boolean = false
  isRequestError: boolean = false

  isShowSettingsDialog: boolean = false

  isErrorSettingsDays: boolean = false
  isErrorSettingsTime: boolean = false
  isErrorSettingsCrossing: boolean = false

  errorSettingsTimeText: string = ''

  /// Internal Data
  internalType = [this.type]
  internalPeriod: string[] = Object.keys(this.period).filter(item => this.period[item])
  internalHoursFrom: string = `${('0' + this.hoursFrom).slice(-2)}:00`
  internalHoursTo: string = `${('0' + this.hoursTo).slice(-2)}:00`

  // Computed
  get disconnectData () {
    return {
      locationId: this.parent.locationId,
      bpi: this.parent.bpi,
      productId: this.id,
      marketId: this.parent.marketId,
      disconnectDate: moment().format()
    }
  }

  get listTypeRedirection () {
    return CONST.LIST_TYPE_REDIRECTION
  }

  get getDaysOfWeek () {
    return CONST.DAYS_OF_WEEK
  }

  get getIsActive () {
    return !!this.listPhone.find(phone => phone.id === this.phoneId && phone.status === STATUS_ACTIVE) &&
      this.status === STATUS_ACTIVE &&
      this.listRedirection
        .filter(redirection => redirection.phoneId === this.phoneId)
        .every(redirection => redirection.redirectionStatus === STATUS_ACTIVE)
  }

  get isActiveRedirection () {
    return this.redirectionStatus === STATUS_ACTIVE
  }

  get isDisconnectInProgress () {
    return this.redirectionStatus === STATUS_DISCONNECTION_IN_PROGRESS || this.redirectionStatus === STATUS_DISCONNECTION_PASSED_PONR
  }

  get isActivationInProgress () {
    return this.redirectionStatus === STATUS_ACTIVATION_IN_PROGRESS
  }

  /// Vuex actions
  readonly createDisconnectOrder!: (
    payload: {
      locationId: string,
      bpi: string,
      productId?: string,
      disconnectDate: string,
      marketId: string
    }) => Promise<ISaleOrder>
  readonly acceptSaleOrder!: (payload: { offerAcceptedOn?: string }) => Promise<ISaleOrder>
  readonly createModifyOrder!: (
    payload: {
      locationId: string,
      marketId: string,
      bpi: string,
      chars?: Record<string, string> | Record<string, string>[]
    }) => Promise<ISaleOrder>

  // Methods
  async onDeleteHandler () {
    this.isDeleteRequest = true
    try {
      await this.createDisconnectOrder(this.disconnectData)
      try {
        await this.acceptSaleOrder({})
      } catch (e) {
        this.isRequestError = true
        this.$store.dispatch('salesOrder/cancel')
        return
      }

      // this.isRequestSuccess = true
      this.$emit('success')
    } catch (e) {
      logInfo(e)
      this.isRequestError = true
    } finally {
      this.isDeleteRequest = false
      this.isDeleteConfirm = false
    }
  }

  async onUpdateHandler () {
    if (this.isErrorSettingsDays || this.isErrorSettingsTime || this.isErrorSettingsCrossing) return
    this.isUpdateRequest = true

    try {
      await this.createModifyOrder({
        locationId: this.parent.locationId,
        marketId: this.parent.marketId,
        bpi: this.id,
        chars: {
          [CHAR_HOURS]: `с ${Number(head(this.internalHoursFrom.split(':')))} по ${Number(head(this.internalHoursTo.split(':')))}`,
          [CHAR_TYPE]: head(this.internalType)!,
          ...CONST.DAYS_ARRAY.reduce((acc, item) => {
            acc[item] = this.internalPeriod.includes(item) ? 'Да' : 'Нет'

            return acc
          }, {} as Record<string, string>)
        }
      })
      try {
        await this.acceptSaleOrder({})
      } catch (e) {
        this.isRequestError = true
        this.$store.dispatch('salesOrder/cancel')
        return
      }

      // this.isRequestSuccess = true

      this.$emit('success', true)
    } catch (e) {
      logInfo(e)
      this.isRequestError = true
    } finally {
      this.isUpdateRequest = false
      this.isShowSettingsDialog = false
    }
  }

  onCloseSettingsDialogHandler () {
    this.isShowSettingsDialog = false
  }

  onBlurTimeFromHandler () {
    if (!this.internalHoursFrom) {
      this.isErrorSettingsTime = true
      this.errorSettingsTimeText = 'Поля обязательны к заполнению'

      return
    }

    const nTimeFrom = Number(head(this.internalHoursFrom.split(':')))

    if (
      isNaN(nTimeFrom) ||
      (nTimeFrom < 0 || nTimeFrom > 24)
    ) {
      this.isErrorSettingsTime = true
      this.errorSettingsTimeText = 'Некорректное значение'

      return
    }

    if (
      this.internalHoursTo && Number(head(this.internalHoursTo.split(':'))) < nTimeFrom
    ) {
      this.isErrorSettingsTime = true
      this.errorSettingsTimeText = 'Время «С» должно быть меньше «До»'

      return
    }

    this.isErrorSettingsTime = false
    this.errorSettingsTimeText = ''

    this.crossingValidate()
  }

  onBlurTimeToHandler () {
    if (!this.internalHoursTo) {
      this.isErrorSettingsTime = true
      this.errorSettingsTimeText = 'Поля обязательны к заполнению'

      return
    }

    const nTimeTo = Number(head(this.internalHoursTo.split(':')))

    if (
      isNaN(nTimeTo) ||
      (nTimeTo < 0 || nTimeTo > 24)
    ) {
      this.isErrorSettingsTime = true
      this.errorSettingsTimeText = 'Некорректное значение'

      return
    }

    if (
      this.internalHoursFrom && Number(head(this.internalHoursFrom.split(':'))) > nTimeTo
    ) {
      this.isErrorSettingsTime = true
      this.errorSettingsTimeText = 'Время «До» должно быть больше «С»'

      return
    }

    this.isErrorSettingsTime = false
    this.errorSettingsTimeText = ''

    this.crossingValidate()
  }

  defineMask () {
    const timeFrom = this.$refs['time-from']
    const timeTo = this.$refs['time-to']

    if (!timeFrom || !timeTo) return

    const timeFromMask = new Inputmask('99:00')
    const timeToMask = new Inputmask('99:00')

    timeFromMask.mask(timeFrom.$refs.input)
    timeToMask.mask(timeTo.$refs.input)
  }

  crossingValidate () {
    // Находим все переадресации, которые есть на указанном номере
    const foundRedirectionList = this.listRedirection.filter(redirectionItem => redirectionItem.phoneId === this.id)

    if (!foundRedirectionList.length) {
      this.isErrorSettingsCrossing = false
      return
    }

    // Есть переадресации с данным номером - проверяем на пересечение дней
    const foundRedirectionListWithDaysCrossing = foundRedirectionList.filter(foundRedirection => {
      const foundRedirectionDays = Object.keys(foundRedirection.period)
        .filter(item => foundRedirection.period[item])

      return this.internalPeriod.filter(item => foundRedirectionDays.includes(item)).length
    })

    if (!foundRedirectionListWithDaysCrossing.length) {
      this.isErrorSettingsCrossing = false
      return
    }

    // Пересечения нашли. Сравниваем время. Следует убедиться, что время уже установлено и оно корректно
    const modelTimeFrom = Number(head(this.internalHoursFrom.split(':')))
    const modelTimeTo = Number(head(this.internalHoursTo.split(':')))

    if (
      isNaN(modelTimeFrom) ||
      isNaN(modelTimeTo) ||
      (modelTimeFrom < 0 || modelTimeFrom > 24) ||
      (modelTimeTo < 0 || modelTimeTo > 24) ||
      (modelTimeFrom > modelTimeTo)
    ) {
      return
    }

    this.isErrorSettingsCrossing = foundRedirectionListWithDaysCrossing.some(foundRedirection => {
      return modelTimeFrom < Number(foundRedirection.hoursTo) &&
        Number(foundRedirection.hoursFrom) < modelTimeTo
    })
  }
}
