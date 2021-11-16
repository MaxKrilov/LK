import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'

import { Manager } from '@/tbapi/voucher_manager'

import moment from 'moment'

import { mapActions, mapGetters } from 'vuex'

import { logError } from '@/functions/logging'

import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { ErtForm } from '@/components/UI2'
import { printData } from '@/components/pages/wifi/service-auth/components/service-auth-item/components/voucher-component/_print'

const generatePassword = require('password-generator')

@Component<InstanceType<typeof ErtAuthVoucherItem>>({
  components: {
    ErActivationModal
  },
  filters: {
    dateTimeFormatted: (val: string) => moment(val).format('DD.MM.YYYY HH:mm')
  },
  computed: {
    ...mapGetters({
      userId: 'auth/getTOMS'
    })
  },
  methods: {
    ...mapActions({
      managerDelete: 'wifi/managerDelete',
      managerUpdate: 'wifi/managerUpdate',
      managerRestore: 'wifi/managerRestore'
    })
  }
})
export default class ErtAuthVoucherItem extends Vue {
  // Options
  $refs!: {
    'update-form': InstanceType<typeof ErtForm>,
    'info-block': HTMLDivElement
  }

  // Props
  @Prop({ type: Object, default: () => ({}) })
  readonly manager!: Manager

  @Prop({ type: String })
  readonly cityId!: string

  @Prop({ type: String })
  readonly vlan!: string

  // Data
  isOpenEditForm: boolean = false

  isUpdateRequest: boolean = false
  isUpdateSuccess: boolean = false
  isUpdateError: boolean = false

  isDeleteRequest: boolean = false
  isDeleteSuccess: boolean = false
  isDeleteError: boolean = false

  isRestoreRequest: boolean = false
  isRestoreSuccess: boolean = false
  isRestoreError: boolean = false

  lazyMFullName: string = this.manager.full_name
  lazyMPassword: string = ''

  typePassword: 'password' | 'text' = 'password'

  isResetPassword: boolean = false

  // Computed
  get getRulesFullName () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполению',
      (v: string) => v.length >= 2 || 'Значение должно быть не менее 2 символов',
      (v: string) => v.length <= 96 || 'Значение должно быть не более 96 символов'
    ]
  }

  get getRulesPassword () {
    return [
      (v: string) => !!v || 'Поле обязательно к заполению',
      (v: string) => v.length >= 6 || 'Значение должно быть не менее 6 символов',
      (v: string) => v.length <= 24 || 'Значение должно быть не более 24 символов',
      (v: string) => /^[\x21-\x7e]+$/.test(v) ||
        'Значение должно состоять из символов латинского алфавита, цифр и/или символов !"#$%\'()*+,-./:;<>=?@[]\\^_`{}|~'
    ]
  }

  get getPasswordIcon () {
    return this.typePassword === 'password'
      ? 'eye_close'
      : 'eye_open'
  }

  get getManagerLogin () {
    return `${this.userId}_${this.manager.manager_id}`
  }

  /// Vuex getters
  readonly userId!: string

  /// Vuex actions
  managerDelete!: <
    P = { vlan: string, cityId: string, managerId: number },
    R = Promise<boolean>
    >(args: P) => R

  managerUpdate!: <
    P = { vlan: string, cityId: string, password?: string, fullName: string, managerId: number },
    R = Promise<Manager>
    >(args: P) => R

  managerRestore!: <
    P = { vlan: string, cityId: string, managerId: number },
    R = Promise<Manager>
    >(args: P) => R

  // Methods
  onOpenEditForm () {
    this.isOpenEditForm = true
  }

  onCloseEditForm () {
    this.isOpenEditForm = false
  }

  onOpenPasswordForEdit () {
    this.isResetPassword = true
  }

  onClosePasswordForEdit () {
    this.isResetPassword = false
  }

  onChangeTypePassword () {
    this.typePassword = this.typePassword === 'password'
      ? 'text'
      : 'password'
  }

  resetLazyData () {
    this.lazyMPassword = ''
  }

  async onDeleteHandler () {
    this.isDeleteRequest = true

    const managerDeleteData = {
      cityId: this.cityId,
      managerId: this.manager.manager_id,
      vlan: this.vlan
    }

    try {
      const managerDeleteResponse = await this.managerDelete(managerDeleteData)

      if (managerDeleteResponse) {
        this.isDeleteSuccess = true
        this.$emit('delete', this.manager.manager_id)
      } else {
        this.isDeleteError = true
      }
    } catch (e) {
      logError(e)
      this.isDeleteError = true
    } finally {
      this.isDeleteRequest = false
    }
  }

  async onRestoreHandler () {
    this.isRestoreRequest = true

    const managerRestoreData = {
      cityId: this.cityId,
      managerId: this.manager.manager_id,
      vlan: this.vlan
    }

    try {
      const managerRestoreResponse = await this.managerRestore(managerRestoreData)
      this.isRestoreSuccess = true
      this.$emit('restore', managerRestoreResponse.manager_id)
    } catch (e) {
      logError(e)
      this.isRestoreError = true
    } finally {
      this.isRestoreRequest = false
    }
  }

  async onUpdateHandler () {
    if (!this.$refs['update-form'] || !this.$refs['update-form'].validate()) return

    this.isUpdateRequest = true

    const managerUpdateData: Record<string, string | number> = {
      cityId: this.cityId,
      fullName: this.lazyMFullName,
      managerId: this.manager.manager_id,
      vlan: this.vlan
    }

    if (this.isResetPassword) {
      managerUpdateData.password = this.lazyMPassword
    }

    try {
      const managerUpdateResponse = await this.managerUpdate(managerUpdateData)
      this.$emit('update', {
        managerId: managerUpdateResponse.manager_id,
        fullName: managerUpdateResponse.full_name
      })

      this.isUpdateSuccess = true
    } catch (e) {
      logError(e)
      this.isUpdateError = true
    } finally {
      this.isUpdateRequest = false
    }
  }

  onGeneratePassword () {
    this.lazyMPassword = generatePassword(8, false, /[A-Za-z0-9]/)
    this.typePassword = 'text'
  }

  onSuccessClose () {
    this.isUpdateSuccess = false
    this.onClosePasswordForEdit()
    this.onCloseEditForm()
    this.resetLazyData()
  }

  onPrintHandler () {
    printData(this.$refs['info-block'])
  }
}
