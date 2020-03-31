import { mapGetters } from 'vuex'
import { formatPhone } from '../../../../../functions/filters'

export default {
  name: 'right-info-panel-component',
  data: () => ({
    pre: 'right-info-panel-component',
    isOpenPersonalAccountDetail: false
  }),
  props: {
    value: null
  },
  filters: {
    formatPhone
  },
  computed: {
    ...mapGetters({
      getManagerInfo: 'user/getManagerInfo'
    })
  },
  methods: {
    closeRightPanel () {
      this.$emit('input', false)
    },
    openPersonalAccountDetail () {
      this.isOpenPersonalAccountDetail = true
    },
    selectPersonalAccount () {
      // todo Реализовать логику
      this.isOpenPersonalAccountDetail = false
    },
    onChangeOrg () {
      this.$emit('change-org')
    },
    signOut () {
      this.$store.dispatch('auth/signOut', { api: this.$api })
    }
  }
}
