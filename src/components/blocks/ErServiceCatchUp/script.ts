import Vue from 'vue'
import Component from 'vue-class-component'

import { ServiceStatus } from '@/constants/status'

const props = {
  code: String,
  description: String,
  price: String,
  status: String,
  statusSwitcherAfterSendingOrder: String,
  isStatusSwitcherAfterSendingOrder: Boolean,
  isSuccessStatusSwitcherAfterSendingOrder: Boolean,
  isConnection: Boolean,
  isDisconnection: Boolean
}

class ConditionsInitial extends Vue {
  readonly code!: string
  readonly description!: string
  readonly price!: string
  readonly status!: string
  protected readonly isSuccessStatusSwitcherAfterSendingOrder!: boolean
  protected readonly isStatusSwitcherAfterSendingOrder!: boolean
  protected readonly isConnection!: boolean
  protected readonly isDisconnection!: boolean
  public toStartingPosition:boolean = false
  public statusCatchUp: string = this.status
}

class ServiceCatchUpStatuses extends ServiceStatus {
  public static readonly INTERNAL_STATUS_CONNECTING = 'Connecting'
  public static readonly INTERNAL_STATUS_DISCONNECTING = 'Disconnecting'
}
class SwitcherCatchUpAfterSending extends ConditionsInitial {}
const stateSwitcherDisconnected = {
  get stageDisconnected (): string {
    return 'Disconnected'
  }
}
const stateSwitcherActive = {
  get stageActive (): string {
    return 'Active'
  }
}
const sDisconnecting = {
  sDisconnecting (status: string) {
    if (status === 'Disconnecting') {
      return !!status
    }
  }
}
const sConnecting = {
  sConnecting (status: string) {
    if (status === 'Connecting') {
      return !!status
    }
  }
}
Object.assign(SwitcherCatchUpAfterSending.prototype, stateSwitcherDisconnected, stateSwitcherActive, sDisconnecting, sConnecting)
const desiredPosition: SwitcherCatchUpAfterSending | any = new SwitcherCatchUpAfterSending()
const sDisconnectingPos = desiredPosition['sDisconnecting']
const sConnectingPos = desiredPosition['sConnecting']
const aStageActive = desiredPosition['stageActive']
const dStageDisconnected = desiredPosition['stageDisconnected']
@Component<InstanceType<typeof ConditionsInitial>>({
  props,
  watch: {
    isStatusSwitcherAfterSendingOrder () {
      this.$emit('cancelLoaderSwitcher')
      const sDisc = sDisconnectingPos(this.statusCatchUp)
      const sConnect = sConnectingPos(this.statusCatchUp)
      const activeAfterSending = sDisc && (this.statusCatchUp = aStageActive)
      const disconnectedAfterSending = sConnect && (this.statusCatchUp = dStageDisconnected)
      console.log(activeAfterSending, disconnectedAfterSending, this.statusCatchUp)
    },
    isSuccessStatusSwitcherAfterSendingOrder () {
      this.$emit('cancelLoaderAfterSendingOrder')
      const activeAfterSendingSuccess = sDisconnectingPos(this.statusCatchUp) && (this.statusCatchUp = dStageDisconnected)
      const disconnectedAfterSendingSuccess = sConnectingPos(this.statusCatchUp) && (this.statusCatchUp = aStageActive)
      console.log(activeAfterSendingSuccess, disconnectedAfterSendingSuccess, this.statusCatchUp)
    }

  }
})
export default class ErServiceCatchUp extends ConditionsInitial {
  get isOnSwitch () {
    return [
      ServiceCatchUpStatuses.STATUS_ACTIVE,
      ServiceCatchUpStatuses.INTERNAL_STATUS_CONNECTING
    ].includes(this.statusCatchUp)
  }
  get statusTextSwitcher () {
    return this.statusCatchUp === 'Active' ? 'Подключен'
      : this.isDisabledSwitch ? 'Услуга недоступна' : 'Выключен'
  }
  get isLoadingSwitch () {
    return (this.statusCatchUp === ServiceCatchUpStatuses.INTERNAL_STATUS_CONNECTING) ||
      this.statusCatchUp === ServiceCatchUpStatuses.INTERNAL_STATUS_DISCONNECTING
  }
  get isCheckStatusLoadingSwitch () {
    return this.isLoadingSwitch
  }

  get isDisabledSwitch () {
    if (this.isDisconnection || this.isConnection) return this.isLoadingSwitch
    return false
  }

  getCurrentStatus (status:any, clickEv: boolean) {
    let accStatus: any
    const CONNECTING: any = clickEv && status === ServiceCatchUpStatuses.STATUS_DISCONNECTED ? 'connecting' : null
    const DISCONNECTING: any = status === ServiceCatchUpStatuses.STATUS_ACTIVE ? 'disconnecting' : null
    const DISCONNECTED: any = !clickEv && status === ServiceCatchUpStatuses.INTERNAL_STATUS_CONNECTING ? 'disconnected' : null
    if (CONNECTING) {
      accStatus = CONNECTING
      this.$emit('connect')
      this.toStartingPosition = false
    } else if (DISCONNECTING) {
      accStatus = DISCONNECTING
      this.$emit('disconnect')
      this.toStartingPosition = false
    } else accStatus = DISCONNECTED

    return {
      [CONNECTING]: ServiceCatchUpStatuses.INTERNAL_STATUS_CONNECTING,
      [DISCONNECTING]: ServiceCatchUpStatuses.INTERNAL_STATUS_DISCONNECTING,
      [DISCONNECTED]: ServiceCatchUpStatuses.STATUS_DISCONNECTED
    }[accStatus]
  }

  onChange (e: boolean) {
    this.statusCatchUp = this.getCurrentStatus(this.statusCatchUp, e)
    return this.statusCatchUp
  }
}
