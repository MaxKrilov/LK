import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

@Component({
  computed: {
    ...mapGetters({
      isLoadingManagerInfo: 'loading/menuComponentManager',
      managerInfo: 'user/getManagerInfo'
    })
  }
})
export default class ErtManagerComponent extends Vue {
  /// Data
  isOpenMenu: boolean = false

  /// Vuex getters
  readonly isLoadingManagerInfo!: boolean
  readonly managerInfo!: { name: string, phone: string, email: string }

  /// Computed
  get getManagerName () {
    return (('name' in this.managerInfo) && this.managerInfo.name) || ''
  }

  get getManagerEmail () {
    return (('email' in this.managerInfo) && this.managerInfo.email) || ''
  }

  get getManagerPhone () {
    return (('phone' in this.managerInfo) && this.managerInfo.phone) || '+7 800 333 9000'
  }

  get getManagerPhoneCut () {
    return this.getManagerPhone.length <= 15
      ? this.getManagerPhone
      : `${this.getManagerPhone.slice(0, 15)}...`
  }
}
