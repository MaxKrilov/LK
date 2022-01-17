import Vue from 'vue'
import Component from 'vue-class-component'
import { formatPhone } from '@/functions/filters'
import { ErtForm, ErtTextField } from '@/components/UI2'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

import Inputmask from 'inputmask'

import head from 'lodash/head'

import { DAYS_ARRAY, DAYS_OF_WEEK, LIST_TYPE_REDIRECTION } from '../../constants'
import { ITelephonyRedirection } from '@/interfaces/telephony'
import { mapActions } from 'vuex'
import { ISaleOrder, IUpdateElement } from '@/tbapi'
import { CODE_CALLFORWRD } from '@/constants/product-code'
import { STATUS_ACTIVE } from '@/constants/status'

const CHAR_HOURS = 'Часы'
const CHAR_TYPE = 'Тип Переадресации'
const CHAR_TO = 'Переадресация на'

interface IRedirection {
  fromNumber: null | { id: string, phone: string, redirectionOfferId: string }
  toNumber: string
  type: string
  date: string[]
  timeFrom: string
  timeTo: string

  isErrorCrossing: boolean
  isErrorDate: boolean

  isErrorTime: boolean
  errorTimeText: string
}

type tRule = (v: any) => boolean | string

@Component<InstanceType<typeof ErtRedirectionAddForm>>({
  components: {
    ErActivationModal
  },
  props: {
    listPhone: {
      type: Array,
      default: () => ([])
    },
    listRedirection: {
      type: Array,
      default: () => ([])
    },
    locationId: String,
    marketId: String
  },
  watch: {
    isOpenForm (val) {
      if (val) {
        this.defineFirstRedirection()
        setTimeout(() => {
          this.defineMask()
        })
      }
    }
  },
  methods: {
    ...mapActions({
      createSaleOrder: 'salesOrder/create',
      addOrderItem: 'salesOrder/addElement',
      updateOrderItems: 'salesOrder/updateNewElements',
      saveSaleOrder: 'salesOrder/save',
      acceptSaleOrder: 'salesOrder/send'
    })
  }
})
export default class ErtRedirectionAddForm extends Vue {
  // Options
  $refs!: Vue & {
    'add-form': InstanceType<typeof ErtForm>,
    'to-phone': InstanceType<typeof ErtTextField>
  }

  // Props
  readonly listPhone!: { id: string, phone: string, redirectionOfferId: string, status: string }[]
  readonly listRedirection!: ITelephonyRedirection[]
  readonly locationId!: string
  readonly marketId!: string

  // Data
  isOpenForm: boolean = false
  timeFrom: number = 0
  timeTo: number = 25

  /// Models
  listModel: IRedirection[] = []

  /// Rules
  rulesFromPhone: tRule[] = [v => !!v || 'Поле обязательно к заполнению']
  rulesToPhone: tRule[] = [
    v => !!v || 'Поле обязательно к заполнению',
    v => String(v).replace(/\D+/g, '').length === 11 || 'Некорректный номер'
  ]
  rulesType: tRule[] = [v => !!v || 'Поле обязательно к заполнению']

  /// Flags
  isAddRequest: boolean = false
  isAddSuccess: boolean = false
  isAddError: boolean = false

  isWarningDialog: boolean = false

  // Computed
  get getListPhone () {
    return this.listPhone.map(item => ({
      id: item.id,
      phone: formatPhone(item.phone),
      redirectionOfferId: item.redirectionOfferId
    }))
  }

  get getIsTheSameTime () {
    return this.timeFrom === this.timeTo
  }

  get getListTypeRedirection () {
    return LIST_TYPE_REDIRECTION
  }

  get getDaysOfWeek () {
    return DAYS_OF_WEEK
  }

  get getListPhoneInProgressModification () {
    return this.listModel.filter(model => {
      return this.listPhone.find(phone => phone.id === model.fromNumber?.id)?.status !== STATUS_ACTIVE ||
        this.listRedirection.filter(redirection => redirection.phoneId === model.fromNumber?.id)
          .some(redirection => redirection.redirectionStatus !== STATUS_ACTIVE)
    })
  }

  get formatListPhoneInProgressModification () {
    return [...new Set(this.getListPhoneInProgressModification.map(item => item.fromNumber?.phone))].join(', ')
  }

  get isActiveConnectButton () {
    return this.listModel.every(model => {
      return model.fromNumber != null &&
        model.toNumber &&
        model.type &&
        !model.isErrorCrossing &&
        model.date.length > 0 &&
        model.timeFrom &&
        model.timeTo &&
        !model.isErrorDate &&
        !model.isErrorTime
    })
  }

  /// Vuex actions
  createSaleOrder!: (payload: { locationId: string, marketId: string }) => Promise<ISaleOrder>
  addOrderItem!: (payload: { productId: string, productCode: string, offerId?: string }) => Promise<ISaleOrder>
  updateOrderItems!: (payload: { updateElements: IUpdateElement[] }) => Promise<ISaleOrder>
  saveSaleOrder!: (payload: { isReturnPrice? : boolean, productId? : string }) => Promise<ISaleOrder>
  acceptSaleOrder!: (payload: { offerAcceptedOn?: string }) => Promise<ISaleOrder>

  // Methods
  onOpenFormHandler () {
    this.isOpenForm = true
  }

  onCloseFormHandler () {
    this.isOpenForm = false
  }

  onAddRedirectionHandler () {
    this.listModel.push({
      fromNumber: null,
      toNumber: '',
      type: '',
      date: [],
      timeFrom: '',
      timeTo: '',

      isErrorCrossing: false,
      isErrorDate: false,

      isErrorTime: false,
      errorTimeText: ''
    })

    setTimeout(() => {
      this.defineMask()
    })
  }

  onBlurTimeFromHandler (model: IRedirection, idx: number) {
    if (!model.timeFrom) {
      model.isErrorTime = true
      model.errorTimeText = 'Поля обязательны к заполнению'

      return
    }

    const nTimeFrom = Number(head(model.timeFrom.split(':')))
    this.timeFrom = nTimeFrom

    if (
      isNaN(nTimeFrom) ||
      (nTimeFrom < 0 || nTimeFrom >= 24) ||
      this.getIsTheSameTime
    ) {
      model.isErrorTime = true
      model.errorTimeText = 'Некорректное значение'

      return
    }

    if (
      model.timeTo && Number(head(model.timeTo.split(':'))) < nTimeFrom
    ) {
      model.isErrorTime = true
      model.errorTimeText = 'Время «С» должно быть меньше «До»'

      return
    }

    model.isErrorTime = false
    model.errorTimeText = ''

    this.crossingValidate(model, idx)
  }

  onBlurTimeToHandler (model: IRedirection, idx: number) {
    if (!model.timeTo) {
      model.isErrorTime = true
      model.errorTimeText = 'Поля обязательны к заполнению'

      return
    }

    const nTimeTo = Number(head(model.timeTo.split(':')))
    this.timeTo = nTimeTo

    if (
      isNaN(nTimeTo) ||
      (nTimeTo <= 0 || nTimeTo > 24) ||
      this.getIsTheSameTime
    ) {
      model.isErrorTime = true
      model.errorTimeText = 'Некорректное значение'

      return
    }

    if (
      model.timeFrom && Number(head(model.timeFrom.split(':'))) > nTimeTo
    ) {
      model.isErrorTime = true
      model.errorTimeText = 'Время «До» должно быть больше «С»'

      return
    }

    model.isErrorTime = false
    model.errorTimeText = ''

    this.crossingValidate(model, idx)
  }

  onValidateHandler () {
    // Валидируем поля форм
    let isValid = true

    for (let idx = 0; idx < this.listModel.length; idx++) {
      if (!(this.$refs as any)[`add-form-${idx}`][0].validate()) {
        isValid = false
        break
      }
    }

    // Проверим по заполненности дней недели (проверяем отдельно по той причине, чтобы вывести ошибку)
    const notFilledRedirectionByDays = this.listModel.filter(model => !model.date.length)

    if (notFilledRedirectionByDays.length > 0) {
      notFilledRedirectionByDays.forEach(item => {
        item.isErrorDate = true
      })
    } else {
      this.listModel.forEach(item => { item.isErrorDate = false })
    }

    // Полная валидация (по всем параметрам)
    return !(!isValid ||
      !this.listModel.every(model => !model.isErrorDate && !model.isErrorTime && !model.isErrorCrossing))
  }

  async onConnectRedirectionHandler () {
    if (!this.onValidateHandler()) return
    // Выполняем подключение
    this.isAddRequest = true
    // Создаём заявку на подключение
    try {
      await this.createSaleOrder({ locationId: this.locationId, marketId: this.marketId })

      // Убираем переадресации для номеров, которые находятся в неактивном статусе
      const filterListModel = this.listModel.filter(model => {
        return this.listPhone.find(phone => phone.id === model.fromNumber!.id)?.status === STATUS_ACTIVE
      })

      for (let idx = 0; idx < filterListModel.length; idx++) {
        await this.addOrderItem({
          productId: filterListModel[idx].fromNumber!.id,
          productCode: CODE_CALLFORWRD,
          offerId: filterListModel[idx].fromNumber!.redirectionOfferId
        })
      }

      await this.updateOrderItems({
        updateElements: filterListModel.map(model => {
          return {
            productId: model.fromNumber!.id,
            chars: {
              [CHAR_HOURS]: `с ${head(model.timeFrom.split(':'))} по ${head(model.timeTo.split(':'))}`,
              [CHAR_TYPE]: model.type,
              [CHAR_TO]: model.toNumber.replace(/\D+/g, ''),
              ...DAYS_ARRAY.reduce((acc, item) => {
                acc[item] = model.date.includes(item) ? 'Да' : 'Нет'

                return acc
              }, {} as Record<string, string>)
            }
          }
        })
      })

      await this.saveSaleOrder({})
      try {
        await this.acceptSaleOrder({})
      } catch (e) {
        this.isAddError = true
        this.$store.dispatch('salesOrder/cancel')
        return
      }

      // this.isAddSuccess = true
      this.isOpenForm = false

      this.$emit('success', true)
    } catch (e) {
      console.error(e)
      this.isAddError = true
    } finally {
      this.isAddRequest = false
      this.isWarningDialog = false
    }
  }

  onRemoveRedirectionItem (idx: number) {
    if (this.listModel.length !== 1) {
      this.listModel.splice(idx, 1)
    }
  }

  onClickHandler () {
    if (this.getListPhoneInProgressModification.length === 0) {
      this.onConnectRedirectionHandler()
    } else if (this.onValidateHandler()) {
      this.isWarningDialog = true
    }
  }

  defineFirstRedirection () {
    this.listModel = [{
      fromNumber: null,
      toNumber: '',
      type: '',
      date: [],
      timeFrom: '',
      timeTo: '',

      isErrorCrossing: false,
      isErrorDate: false,

      isErrorTime: false,
      errorTimeText: ''
    }]
  }

  defineMask () {
    const index = this.listModel.length - 1

    const toPhone = (this.$refs as any)[`to-phone-${index}`][0] as InstanceType<typeof ErtTextField>
    const timeFrom = (this.$refs as any)[`time-from-${index}`][0] as InstanceType<typeof ErtTextField>
    const timeTo = (this.$refs as any)[`time-to-${index}`][0] as InstanceType<typeof ErtTextField>

    if (!toPhone || !timeFrom || !timeTo) return

    const toPhoneMask = new Inputmask('+7 (999) 999-99-99', { jitMasking: true })
    const timeFromMask = new Inputmask('99:00')
    const timeToMask = new Inputmask('99:00')

    toPhoneMask.mask(toPhone.$refs.input)
    timeFromMask.mask(timeFrom.$refs.input)
    timeToMask.mask(timeTo.$refs.input)
  }

  crossingValidate (model: IRedirection, idx: number) {
    // Находим все переадресации, которые есть на указанном номере
    const foundRedirectionList = [
      ...this.listRedirection.filter(redirectionItem => redirectionItem.phoneId === model.fromNumber?.id),
      ...this.listModel.filter((_model, _idx) =>
        _idx !== idx &&
        model.fromNumber?.id === _model.fromNumber?.id
      )
    ]

    if (!foundRedirectionList.length) {
      // Ничего не найдено
      model.isErrorCrossing = false
      return
    }

    // Есть переадресации с данным номером - проверяем на пересечение дней
    const foundRedirectionListWithDaysCrossing = foundRedirectionList.filter(foundRedirection => {
      const foundRedirectionDays = foundRedirection.hasOwnProperty('period')
        ? Object.keys((foundRedirection as ITelephonyRedirection).period)
          .filter(item => (foundRedirection as ITelephonyRedirection).period[item])
        : (foundRedirection as IRedirection).date

      return model.date.filter(item => foundRedirectionDays.includes(item)).length
    })

    if (!foundRedirectionListWithDaysCrossing.length) {
      // Не найдены пересечения по дням
      model.isErrorCrossing = false
      return
    }

    // Пересечения нашли. Сравниваем время. Следует убедиться, что время уже установлено и оно корректно
    const modelTimeFrom = Number(head(model.timeFrom.split(':')))
    const modelTimeTo = Number(head(model.timeTo.split(':')))

    if (
      isNaN(modelTimeFrom) ||
      isNaN(modelTimeTo) ||
      (modelTimeFrom < 0 || modelTimeFrom > 24) ||
      (modelTimeTo < 0 || modelTimeTo > 24) ||
      (modelTimeFrom > modelTimeTo)
    ) {
      return
    }

    model.isErrorCrossing = foundRedirectionListWithDaysCrossing.some(foundRedirection => {
      return foundRedirection.hasOwnProperty('hoursFrom')
        ? modelTimeFrom < Number((foundRedirection as ITelephonyRedirection).hoursTo) &&
          Number((foundRedirection as ITelephonyRedirection).hoursFrom) < modelTimeTo
        : modelTimeFrom < Number(head((foundRedirection as IRedirection).timeTo.split(':'))) &&
          Number(head((foundRedirection as IRedirection).timeFrom.split(':'))) < modelTimeTo
    })
  }
}
