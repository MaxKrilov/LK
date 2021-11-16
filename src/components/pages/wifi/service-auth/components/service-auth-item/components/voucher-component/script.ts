import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'

import ErtAuthVoucherItem from './components/voucher-item-component/index.vue'
import ErtAuthVoucherAddForm from './components/voucher-add-form/index.vue'

import { mapActions } from 'vuex'

import { IWifiResourceInfo } from '@/tbapi'
import { Manager, Result as IVoucherManager } from '@/tbapi/voucher_manager'

import head from 'lodash/head'

import moment from 'moment'

@Component<InstanceType<typeof ErtAuthVoucherComponent>>({
  components: {
    ErtAuthVoucherItem,
    ErtAuthVoucherAddForm
  },
  methods: {
    ...mapActions({
      getResource: 'wifi/getResource',
      voucherView: 'wifi/voucherView'
    })
  }
})
export default class ErtAuthVoucherComponent extends Vue {
  // Props
  @Prop({ type: String })
  readonly bpi!: string

  // Data
  cityId: string = ''
  vlan: string = ''

  voucherManagerInfo: IVoucherManager | null = null

  // Computed
  get getListManager (): Manager[] {
    return this.voucherManagerInfo == null
      ? []
      : this.voucherManagerInfo.managers
  }

  /// Vuex actions
  getResource!: <
    P = { bpi: string },
    R = Promise<IWifiResourceInfo[]>
    >(args: P) => R

  voucherView!: <
    P = { vlan: string, cityId: string },
    R = Promise<IVoucherManager>
    >(args: P) => R

  async initComponent () {
    const getResourceResponse = await this.getResource({ bpi: this.bpi })
    const vlanElement = head(getResourceResponse)

    if (typeof vlanElement === 'undefined') return

    const vlanInfo = vlanElement.vlan

    if (typeof vlanInfo === 'undefined' || !vlanInfo.length) return

    this.cityId = head(vlanInfo)!.cityId
    this.vlan = head(vlanInfo)!.number

    this.voucherManagerInfo = await this.voucherView({ vlan: this.vlan, cityId: this.cityId })
  }

  onAddManagerHandler (e: Manager) {
    if (this.voucherManagerInfo === null) return

    this.voucherManagerInfo.managers.push(e)
  }

  onDeleteManagerHandler (managerId: number) {
    if (this.voucherManagerInfo === null) return

    const managerIndex = this.voucherManagerInfo
      .managers.findIndex(manager => manager.manager_id === managerId)

    if (managerIndex < 0) return

    this.voucherManagerInfo.managers[managerIndex].removed_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
    this.voucherManagerInfo.managers[managerIndex].updated_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
  }

  onRestoreManagerHandler (managerId: number) {
    if (this.voucherManagerInfo === null) return

    const managerIndex = this.voucherManagerInfo
      .managers.findIndex(manager => manager.manager_id === managerId)

    if (managerIndex < 0) return

    this.voucherManagerInfo.managers[managerIndex].removed_at = null
    this.voucherManagerInfo.managers[managerIndex].updated_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
  }

  onUpdateManagerHandler (managerInfo: { managerId: number, fullName: string }) {
    if (this.voucherManagerInfo === null) return

    const managerIndex = this.voucherManagerInfo
      .managers.findIndex(manager => manager.manager_id === managerInfo.managerId)

    if (managerIndex < 0) return

    this.voucherManagerInfo.managers[managerIndex].full_name = managerInfo.fullName
    this.voucherManagerInfo.managers[managerIndex].updated_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
  }

  mounted () {
    this.initComponent()
  }
}
