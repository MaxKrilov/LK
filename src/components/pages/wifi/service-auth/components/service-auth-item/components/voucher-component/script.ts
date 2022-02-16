import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'

import ErtAuthVoucherItem from './components/voucher-item-component/index.vue'
import ErtAuthVoucherAddForm from './components/voucher-add-form/index.vue'

import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

import { mapActions } from 'vuex'

import { IWifiResourceInfo } from '@/tbapi'
import { Manager, Result as IVoucherManager } from '@/tbapi/voucher_manager'

import head from 'lodash/head'

import moment from 'moment'
import { InternalServiceStatuses } from '@/components/pages/wifi/service-auth/components/service-auth-item/script'

@Component<InstanceType<typeof ErtAuthVoucherComponent>>({
  components: {
    ErtAuthVoucherItem,
    ErtAuthVoucherAddForm,
    ErActivationModal
  },
  methods: {
    ...mapActions({
      getResource: 'wifi/getResource',
      voucherView: 'wifi/voucherView',
      pointCreate: 'wifi/pointCreate',
      pointUpdate: 'wifi/pointUpdate',
      createClient: 'wifi/createClient'
    })
  },
  watch: {
    voucherManagerInfo (val) {
      val && ('login_prefix' in val) && this.$emit('change:login-prefix', val.login_prefix)
    },
    loginPrefix (val) {
      this.$emit('change:login-prefix', val)
    }
  }
})
export default class ErtAuthVoucherComponent extends Vue {
  // Props
  @Prop({ type: String })
  readonly bpi!: string

  // @Prop({ type: String, default: '' })
  // readonly loginPrefix!: string

  @Prop({ type: String })
  readonly status!: string

  // Data
  cityId: string = ''
  vlan: string = ''

  voucherManagerInfo: IVoucherManager | null = null

  loginPrefix: string = ''

  /* Произошла ошибка при получении данных о точке (т.е. точка не создана) */
  /* Следует показать пользователю сообщение о том, что точку необходимо создать */
  isWasError: boolean = false

  isLoadingData: boolean = true

  isChangingRequest: boolean = false

  isSuccessChangeLoginPrefix: boolean = false

  isErrorChangeLoginPrefix: boolean = false

  // Computed
  get getListManager (): Manager[] {
    return this.voucherManagerInfo == null
      ? []
      : this.voucherManagerInfo.managers
  }

  get prefixRules () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполнению',
      (v: string) => /^[a-z0-9]+$/g.test(v) || 'Префикс может содержать только латинские буквы нижнего регистра и/или цифры'
    ]
  }

  get getStatuses () {
    return InternalServiceStatuses
  }

  /// Vuex actions
  readonly getResource!: <
    P = { bpi: string },
    R = Promise<IWifiResourceInfo[]>
    >(args: P) => R

  readonly voucherView!: <
    P = { vlan: string, cityId: string },
    R = Promise<IVoucherManager>
    >(args: P) => R

  readonly pointCreate!: ({ vlan, cityId, loginPrefix }: { vlan: string, cityId: string, loginPrefix: string }) => Promise<any>
  readonly pointUpdate!: ({ vlan, cityId, loginPrefix }: { vlan: string, cityId: string, loginPrefix: string }) => Promise<any>
  readonly createClient!: () => Promise<void>

  async initComponent () {
    const getResourceResponse = await this.getResource({ bpi: this.bpi })
    const vlanElement = head(getResourceResponse)

    if (typeof vlanElement === 'undefined') return

    const vlanInfo = vlanElement.vlan

    if (typeof vlanInfo === 'undefined' || !vlanInfo.length) return

    this.cityId = head(vlanInfo)!.cityId
    this.vlan = head(vlanInfo)!.number

    try {
      this.voucherManagerInfo = await this.voucherView({ vlan: this.vlan, cityId: this.cityId })
      this.loginPrefix = this.voucherManagerInfo?.login_prefix || ''
    } catch (ex) {
      const status = ex?.response?.status
      if (status !== 400) return

      this.isWasError = true
      //
      // // Компонент инициализируется тогда и только тогда, когда услуга "Авторизация по ваучерам" активна.
      // // Но активация может быть выполнена на стороне BSS - в этом случае клиент и точка не создаются.
      // // Следует создать их для корректной работы
      // const data = {
      //   vlan: this.vlan,
      //   cityId: this.cityId,
      //   loginPrefix: this.voucherManagerInfo!.login_prefix
      // }
      //
      // await this.createClient()
      // await this.pointCreate(data)
      // this.voucherManagerInfo = await this.voucherView({ vlan: this.vlan, cityId: this.cityId })
    } finally {
      this.isLoadingData = false
    }
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

  async onChangeHandler () {
    const data = {
      vlan: this.vlan,
      cityId: this.cityId,
      loginPrefix: this.loginPrefix
    }

    this.isChangingRequest = true

    try {
      if (this.isWasError) {
        /* Точка не была создана */
        await this.createClient()
        await this.pointCreate(data)

        this.isWasError = false
      } else {
        /* Точка была создана ранее */
        await this.pointUpdate(data)
      }

      this.isSuccessChangeLoginPrefix = true
    } catch (ex) {
      console.error(ex)
      this.isErrorChangeLoginPrefix = true
    } finally {
      this.isChangingRequest = false
    }
  }

  mounted () {
    this.initComponent()
  }
}
