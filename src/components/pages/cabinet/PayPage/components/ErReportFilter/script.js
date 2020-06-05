import ErFilterGroup from '../ErFilterGroup'
import { lengthVar } from '@/functions/helper'

export default {
  components: {
    ErFilterGroup
  },
  data () {
    return {
      pre: 'er-report-filter',
      isFiltersVisible: false,
      isCloseCategory: false,
      isCloseService: false,
      isClosePay: false
    }
  },
  props: {
    period: {
      type: Array,
      default: () => ([])
    },
    typesFind: {
      typeFind: Array,
      default: () => ([])
    },
    servicesOrCities: {
      servOrCit: Array,
      default: () => ([])
    },
    typesPay: {
      typePay: Array,
      default: () => ([])
    },
    type: Object,
    typeFind: Object,
    servOrCit: Object,
    typePay: Object
  },
  computed: {
    internalPeriod: {
      get () {
        return this.period
      },
      set (val) {
        this.$emit('change-period', val)
      }
    },
    internalTypeFind: {
      get () {
        return this.typeFind
      },
      set (val) {
        this.$emit('change-typeFind', val)
      }
    },
    internalServicesOrCities: {
      get () {
        return this.servOrCit
      },
      set (val) {
        this.$emit('change-servOrCit', val)
        this.isCloseService = true
      }
    },
    internalTypePay: {
      get () {
        return this.typePay
      },
      set (val) {
        this.$emit('change-typePay', val)
        this.isClosePay = true
      }
    },
    getFormatPeriod () {
      return Array.isArray(this.internalPeriod) && lengthVar(this.internalPeriod) !== 0
        ? `${this.$moment(this.internalPeriod[0]).format('ll')} - ${this.$moment(this.internalPeriod[1]).format('ll')}`
        : ''
    }
  },
  methods: {
    onShowFilters () {
      this.isFiltersVisible = true
    },
    onCloseFilters () {
      this.isFiltersVisible = false
    },
    closeCategory () {
      this.isCloseCategory = false
    },
    closeService () {
      this.isCloseService = false
    },
    closePay () {
      this.isClosePay = false
    }
  }
}
