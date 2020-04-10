import error from '../../components/ErrorInput'
import { validateINN } from '../../../../../../../../functions/helper'
import ValidatorsMixin from '../../../../../../../../mixins/ValidatorsMixin'

export default {
  name: 'company-form',
  components: {
    error
  },
  mixins: [ ValidatorsMixin ],
  props: ['company', 'isFetched'],
  data: () => ({
    COMPANY_TYPE_CORP: 'corporation',
    COMPANY_TYPE_IP: 'entrepreneur',
    fnsData: {},
    innLabel: '',
    pre: 'company-form',
    isInnChanging: false,
    isInnIncorrect: false,
    isMounted: false
  }),
  computed: {
    editableInn: {
      get () {
        return this.company?.inn
      },
      set (value) {
        this.$emit('setInn', value)
      }
    },
    editableLegalName: {
      get () {
        return this.company?.legalName
      },
      set (value) {
        this.$emit('setLegalName', value)
      }
    },
    editableLegalAddress: {
      get () {
        return this.company?.legalAddress
      },
      set (value) {
        this.$emit('setLegalAddress', value)
      }
    },
    editableKpp: {
      get () {
        return this.company?.kpp
      },
      set (value) {
        this.$emit('setKpp', value)
      }
    },
    editablePassport: {
      get () {
        return this.company?.passport
      },
      set (value) {
        this.$emit('setPassport', value)
      }
    },
    editableIssueDate: {
      get () {
        return this.company?.issueDate
      },
      set (value) {
        this.$emit('setIssueDate', value)
      }
    },
    editableIssuedBy: {
      get () {
        return this.company?.issuedBy
      },
      set (value) {
        this.$emit('setIssuedBy', value)
      }
    }
  },
  methods: {
    handleResInn () {
      if (validateINN(this.editableInn)) {
        this.$emit('changeInn', false)
        this.$refs.companyFormInnRef.messages = []
        this.isInnIncorrect = false
      } else {
        this.$refs.companyFormInnRef.messages.push('')
        this.isInnIncorrect = true
      }
    }
  },
  watch: {
    editableInn () {
      this.$refs.companyFormInnRef.messages = []
      this.$nextTick(() => {
        if (this.fnsData.inn !== this.editableInn) {
          this.$emit('changeInn', true)
          this.isInnIncorrect = false
        }
      })
    }
  },
  mounted () {
    this.isMounted = true
    this.$nextTick(() => {
      if (this.isFetched && this.company) {
        this.fnsData = { ...this.company }
      }
    })
  }
}
