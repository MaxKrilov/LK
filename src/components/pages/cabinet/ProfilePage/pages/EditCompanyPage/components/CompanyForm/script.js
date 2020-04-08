import error from '../../components/ErrorInput'
import { validateINN, isEmpty } from '../../../../../../../../functions/helper'
import ValidatorsMixin from '../../../../../../../../mixins/ValidatorsMixin'

export default {
  name: 'company-form',
  components: {
    error
  },
  mixins: [ ValidatorsMixin ],
  props: {
    value: { type: null },
    isFetched: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    COMPANY_TYPE_CORP: 'corporation',
    COMPANY_TYPE_IP: 'entrepreneur',
    snapshot: {},
    innLabel: '',
    pre: 'company-form',
    isInnChanging: false,
    isInnIncorrect: false,
    isMounted: false
  }),
  methods: {
    onResetInn () {
      if (validateINN(this.value.inn)) {
        this.$emit('resetInn')
        this.$refs.companyFormInnRef.messages = []
        this.isInnIncorrect = false
        this.isInnChanging = false
      } else {
        this.$refs.companyFormInnRef.messages.push('')
        this.isInnIncorrect = true
      }
    }
  },
  computed: {
    editableInn () {
      return this.value.inn
    },
    uneditableName () {
      return !isEmpty(this.snapshot.name)
    },
    uneditableAddress () {
      return !isEmpty(this.snapshot.legalAddress)
    },
    uneditableKpp () {
      return !isEmpty(this.snapshot.kpp)
    },
    uneditableSerial () {
      return !isEmpty(this.snapshot.idSerialNumber)
    },
    uneditableDate () {
      return !isEmpty(this.snapshot.issuedDate)
    },
    uneditableIssued () {
      return !isEmpty(this.snapshot.issuedBy)
    }
  },
  watch: {
    editableInn () {
      this.$refs.companyFormInnRef.messages = []
      this.$nextTick(() => {
        this.isInnIncorrect = false
        this.isInnChanging = this.snapshot.inn !== this.editableInn
      })
    }
  },
  mounted () {
    this.isMounted = true
    this.$nextTick(() => {
      if (this.isFetched && this.value) {
        this.snapshot = { ...this.value }
      }
    })
  }
}
