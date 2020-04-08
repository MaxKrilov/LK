import { validateINN } from '@/functions/helper.js'
import { mapState, mapActions } from 'vuex'
import { FNS, SELF_EMPLOYED } from '../../../../../../../../store/actions/variables'
import { GET_COMPANY_INFO } from '../../../../../../../../store/actions/user'
import error from '../../components/ErrorInput'

export default {
  name: 'edit-company-inn',
  components: {
    error
  },
  data: () => ({
    pre: 'edit-company-inn',
    isMounted: false,
    isInnIncorrect: false,
    innValue: null
  }),
  computed: {
    innLabel () {
      if (!this.isMounted) {
        return
      }
      return this.$refs.innRef.hasFocus || this.innValue ? 'ИНН' : 'Введите ИНН организации'
    },
    ...mapState({
      fns: (state) => state.variables[FNS],
      selfEmployed: (state) => state.variables[SELF_EMPLOYED]
    })
  },
  methods: {
    ...mapActions('user', [GET_COMPANY_INFO]),
    async checkInn () {
      if (validateINN(this.innValue)) {
        const response = await this[GET_COMPANY_INFO]({ api: this.$api, inn: this.innValue })
        if (response) {
          this.$router.push({ name: 'company-edit' })
        }
      } else {
        this.isInnIncorrect = true
        this.$refs.innRef.messages.push('')
      }
    }
  },
  watch: {
    innValue () {
      this.isInnIncorrect = false
      this.$refs.innRef.messages = []
    }
  },
  mounted () {
    this.isMounted = true
  }
}
