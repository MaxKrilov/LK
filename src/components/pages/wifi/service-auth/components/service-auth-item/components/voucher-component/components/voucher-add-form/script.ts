import Vue from 'vue'
import Component from 'vue-class-component'

import { Prop } from 'vue-property-decorator'

import { ErtForm } from '@/components/UI2'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

import { mapActions, mapGetters } from 'vuex'

import { ResultManagerResult as ManagerResult } from '@/tbapi/voucher_manager'

import { logError } from '@/functions/logging'
import { printData } from '../../_print'

const generatePassword = require('password-generator')

@Component<InstanceType<typeof ErtAuthVoucherAddForm>>({
  components: {
    ErActivationModal
  },
  watch: {
    isOpenForm (val) {
      !val && this.resetModelData()
    }
  },
  computed: {
    ...mapGetters({
      userId: 'auth/getTOMS'
    })
  },
  methods: {
    ...mapActions({
      managerCreate: 'wifi/managerCreate'
    })
  }
})
export default class ErtAuthVoucherAddForm extends Vue {
  /// Options
  $refs!: {
    'add-user-form': InstanceType<typeof ErtForm>,
    'info-block': HTMLDivElement
  }

  // Props
  @Prop({ type: String })
  readonly cityId!: string

  @Prop({ type: String })
  readonly vlan!: string

  // Data
  isOpenForm: boolean = false

  /// Models
  mFullName: string = ''
  mPassword: string = ''

  typePassword: 'password' | 'text' = 'password'

  isAddRequest: boolean = false
  isAddSuccess: boolean = false
  isAddError: boolean = false

  managerID: number = 0

  /// Vuex getters
  readonly userId!: string

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
    return `${this.userId}_${this.managerID}`
  }

  /// Vuex actions
  managerCreate!: <
    P = { vlan: string, cityId: string, password: string, fullName: string },
    R = Promise<ManagerResult>
    >(args: P) => R

  onOpenForm () {
    this.isOpenForm = true
  }

  onCloseForm () {
    this.isOpenForm = false
  }

  onChangeTypePassword () {
    this.typePassword = this.typePassword === 'password'
      ? 'text'
      : 'password'
  }

  onGeneratePassword () {
    this.mPassword = generatePassword(8, false, /[A-Za-z0-9]/)
    this.typePassword = 'text'
  }

  async onCreateManager () {
    if (!this.$refs['add-user-form'].validate()) {
      return
    }

    this.isAddRequest = true

    const managerCreateData = {
      cityId: this.cityId,
      fullName: this.mFullName,
      password: this.mPassword,
      vlan: this.vlan
    }
    try {
      const managerCreateResponse = await this.managerCreate(managerCreateData)
      this.isAddSuccess = true

      this.managerID = managerCreateResponse.manager_id

      this.$emit('add', managerCreateResponse)
    } catch (e) {
      logError(e)
      this.isAddError = true
    } finally {
      this.isAddRequest = false
    }
  }

  resetModelData () {
    this.mFullName = ''
    this.mPassword = ''
  }

  onPrintHandler () {
    printData(this.$refs['info-block'])
  }
}
