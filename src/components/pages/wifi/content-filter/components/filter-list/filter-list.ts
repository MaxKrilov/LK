import { Component, Watch, Prop } from 'vue-property-decorator'
import ErListPoints from '@/components/blocks/ErListPoints/index.vue'
import { IPointItem } from '@/interfaces/point'
import { ISimpleSubscription, IVLANItem } from '@/interfaces/wifi-filter'
import { FILTER_TYPES } from '@/constants/wifi-filter'
import FilterItem from '../filter-item/index.vue'
import { StoreGetter } from '@/functions/store'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { ErtPageWithDialogsMixin } from '@/mixins2/ErtPageWithDialogsMixin'
import { STATUS_ACTIVE } from '@/constants/status'

import ErDisconnectProduct from '@/components/blocks/ErDisconnectProduct/index.vue'

import ErPlugFilter from '../plug-filter/index.vue'
import ErPromo from '../promo/index.vue'

const components = {
  ErListPoints,
  FilterItem,
  ErActivationModal,
  ErPlugFilter,
  ErPromo,
  ErDisconnectProduct
}

const ACTIVE_TO = '01.01.3000'

const MESSAGES = {
  ENABLE_FILTER_ERROR: 'При подключении возникла ошибка. Попробуйте позже.'
}

@Component<InstanceType<typeof WifiFilterListPage>>({
  components
})
export default class WifiFilterListPage extends ErtPageWithDialogsMixin {
  currentPoint: IPointItem | null = null
  currentVlan: IVLANItem | null = null
  isFilterListLoaded: Boolean = true
  addendaList: [] = []

  subscriptionInfo: Record<string, any> = {}
  subscriptionInfoLoad: Record<string, any> = {}

  allFilterList: [] = []

  filterEnabledRegistry: Record<string, boolean> = {}

  @StoreGetter('wifiFilter/pointList')
  pointList: any

  dialogTitle: string = ''
  isDialogVisible: boolean = false
  dialogMessage: string = ''

  isDisableRequest: boolean = false
  isDisableSuccess: boolean = false
  isDisableError: boolean = false

  isPluging: boolean = false

  @Prop({ type: String })
  readonly productId!: string

  @Prop({ type: String })
  readonly productsStatus!: string

  get isVlanLoaded (): boolean {
    return this.$store.state.wifiFilter.isVlanLoaded
  }

  get addendaIdList () {
    return this.addendaList.map((el:any) => {
      return el['subscription_id']
    })
  }

  get isActiveProduct () {
    return [STATUS_ACTIVE].includes(this.productsStatus)
  }

  get filterList () {
    return [
      ...this.allFilterList.filter(el => !this.addendaIdList.includes(el['subscription_id'])),
      ...this.addendaList
    ]
  }

  get filterIdList () {
    return this.filterList.map((el:any) => {
      return el['subscription_id']
    })
  }

  get enabledFilters () {
    const enabled = this.addendaList.reduce((acc:any, el: any) => {
      return { ...acc, [el['subscription_id']]: true }
    }, {})

    const disabled = this.allFilterList.reduce((acc:any, el: any) => {
      return { ...acc, [el['subscription_id']]: false }
    }, {})

    return {
      ...disabled,
      ...enabled
    }
  }

  get disconnectData () {
    if (!this.currentPoint) return {}
    const { id: locationId, bpi, marketId } = this.currentPoint!
    return {
      bpi,
      locationId,
      marketId,
      disconnectDate: this.$moment().format(),
      productId: this.productId,
      title: `Вы действительно хотите отключить фильтрацию на адресе "${this.currentPoint!.fulladdress}"?`
    }
  }

  pullSubscriptionInfo (el: ISimpleSubscription) {
    return this.$store.dispatch('wifiFilter/pullSubscriptionInfo', el['subscription_id'])
  }

  getSubInfo (subscriptionId:string) {
    const data = this.$store.state.wifiFilter.subscriptionInfo[subscriptionId] || {}

    const subInfo = { ...data, typeLabel: '' }
    const subTypeId: number = parseInt(data['subscription_type_id'], 10)
    subInfo.typeLabel = FILTER_TYPES[subTypeId]

    return subInfo
  }

  getClientSubscrsByVLAN (payload: any) {
    return this.$store.dispatch('wifiFilter/getClientSubscrsByVLAN', payload)
  }

  created () {
    if (this.pointList.length) {
      this.$set(this, 'currentPoint', this.pointList[0])
    }
  }

  @Watch('isVlanLoaded')
  onVlanIsLoaded (status: boolean) {
    if (status) {
      this.onCurrentPointSelected(this.currentPoint)
    }
  }

  @Watch('currentPoint')
  onCurrentPointSelected (point: IPointItem | null) {
    this.addendaList = []

    if (point !== null) {
      const pointBpi = point?.bpi?.toString() || ''
      const vlan = this.$store.getters['wifiFilter/vlanByBPI'](pointBpi)?.[0]?.vlan?.[0]
      this.$set(
        this,
        'currentVlan',
        vlan
      )

      if (this.currentVlan) {
        this.fetchSubscriptions()
        this.fetchAvailableSubscriptions()
      }

      this.$emit('change', point)
    }
  }

  fetchAvailableSubscriptions () {
    const payload = {
      city_id: this.currentVlan?.cityId
    }

    this.$store.dispatch('wifiFilter/fetchClientSubscriptions', payload)
      .then(data => {
        this.allFilterList = data
        this.filterEnabledRegistry = data.reduce((acc: any, el:any) => {
          return { ...acc, [el.subscription_id]: false }
        }, {})
        this.allFilterList.forEach(this.pullSubscriptionInfo)
      })
  }

  fetchSubscriptions () {
    if (this.currentVlan && this.currentVlan.cityId) {
      this.getClientSubscrsByVLAN({
        city_id: this.currentVlan.cityId,
        vlan: this.currentVlan.number
      })
        .then(data => {
          this.addendaList = data['terminal_resource']?.row || []
          this.addendaList.forEach(this.pullSubscriptionInfo)
          this.isFilterListLoaded = true
        })
    }
  }

  resetDialog () {
    this.dialogMessage = ''
    this.dialogTitle = ''
  }

  refreshSubscriptions () {
    this.addendaList = []
    this.allFilterList = []
    this.fetchSubscriptions()
    this.fetchAvailableSubscriptions()
  }

  confirmDialog (params: {title: string, message: string}) {
    this.isDialogVisible = true
    this.dialogTitle = params.title
    this.dialogMessage = params.message

    return new Promise((resolve, reject) => {
      const oldConfirmFunction = this.onConfirmDialog
      this.onConfirmDialog = () => {
        oldConfirmFunction()
        this.onConfirmDialog = oldConfirmFunction
        resolve()
      }

      const oldCancelFunction = this.onCancelDialog
      this.onCancelDialog = () => {
        oldCancelFunction()
        reject()
        this.onCancelDialog = oldCancelFunction
      }
    })
  }

  isSubInfoLoaded (subscriptionId: string) {
    return this.$store.state.wifiFilter.subscriptionInfoLoad[subscriptionId] || false
  }

  onDeleteSubscription (subscriptionId: string) {
    const payload = {
      'city_id': this.currentVlan?.cityId,
      'subscription_id': subscriptionId
    }

    const subscription = this.filterList.find(el => el['subscription_id'] === subscriptionId)
    const subscriptionName = subscription?.['subscription_name']
    this.confirmDialog({
      title: 'Удалить фильтр?',
      message: `Вы действительно хотите удалить фильтр "${subscriptionName}"? Обратите внимание, что в случае,&nbsp;
если данный фильтр подключен на других точках, он также будет удалён и для них!`
    })
      .then(() => {
        this.$store.dispatch('wifiFilter/deleteSubscription', payload)
          .then(() => {
            this.refreshSubscriptions()
          })
      })
  }

  onToggleSubscription (subscriptionId: string) {
    const filterName = this.filterList.find(
      el => el['subscription_id'] === subscriptionId
    )?.['subscription_name']

    if (this.addendaIdList.includes(subscriptionId)) {
      // отключение
      this.filterEnabledRegistry[subscriptionId] = false

      const message = `Вы действительно хотите отключить фильтр «${filterName}»`
      this.confirmDialog({ title: 'Отключить фильтр?', message })
        .then(() => {
          const payload = {
            city_id: this.currentVlan?.cityId,
            subscription_id: subscriptionId,
            vlan: this.currentVlan?.number,
            active_from: this.$moment().format('DD.MM.YYYY'),
            active_to: this.$moment().format('DD.MM.YYYY')
          }

          this.$store.dispatch('wifiFilter/addSubscriptionToVLAN', payload)
            .then(() => {
              this.refreshSubscriptions()
              this.filterEnabledRegistry[subscriptionId] = false
            })
        })
        .catch(() => {
          this.filterEnabledRegistry[subscriptionId] = true
        })
    } else {
      // подключение
      const message = `Вы действительно хотите подключить «${filterName}»?`
      this.filterEnabledRegistry[subscriptionId] = true

      this.confirmDialog({ title: 'Подключить фильтр?', message })
        .then(() => {
          if (this.currentVlan) {
            const payload = {
              city_id: this.currentVlan.cityId,
              subscription_id: subscriptionId,
              vlan: this.currentVlan.number,
              active_from: this.$moment().format('DD.MM.YYYY'),
              active_to: ACTIVE_TO
            }

            this.$store.dispatch('wifiFilter/addSubscriptionToVLAN', payload)
              .catch(() => {
                this.onError({ title: '', message: MESSAGES.ENABLE_FILTER_ERROR })
                throw new Error()
              })
              .then(() => {
                this.refreshSubscriptions()
              })
          } else {
            this.filterEnabledRegistry[subscriptionId] = false
          }
        })
        .catch(() => {
          this.filterEnabledRegistry[subscriptionId] = false
        })
    }
  }

  onClickDisableFiltration () {
    if (this.currentPoint && this.currentVlan) {
      this.isDisableRequest = true
    }
  }

  onConfirmDialog () {
    this.isDialogVisible = false
    this.resetDialog()
  }

  onSuccessOrder () {
    this.isDisableRequest = false
    this.$emit('disconnect')
  }

  onCancelDialog () {
    this.resetDialog()
  }
}
