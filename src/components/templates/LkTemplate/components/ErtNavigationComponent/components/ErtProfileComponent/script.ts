import Vue from 'vue'
import Component from 'vue-class-component'
import { mapActions, mapGetters, mapState } from 'vuex'
import { API } from '@/functions/api'

import ChangeOrganisationPopup from '../ChangeOrganizationPopup/index.vue'

@Component({
  components: {
    ChangeOrganisationPopup
  },
  computed: {
    ...mapGetters({
      isLoadingClientInfo: 'loading/clientInfo'
    }),
    ...mapState({
      legalName: (state: any) => state.user.clientInfo.legalName
    })
  },
  methods: {
    ...mapActions({
      signOut: 'auth/signOut'
    })
  }
})
export default class ErtProfileComponent extends Vue {
  /// Data
  isOpenMenu: boolean = false
  isOpenOrganisationPopup: boolean = false

  /// Vuex getters
  readonly isLoadingClientInfo!: boolean

  /// Vuex state
  readonly legalName!: string

  /// Vuex actions
  readonly signOut!: <
    P = { api: API }
    >(payload: P) => void

  /// Methods
  onSignOutHandler () {
    this.signOut({ api: this.$api })
  }
}
