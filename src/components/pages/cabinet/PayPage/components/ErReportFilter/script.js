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
      isClosePay: false
    }
  },
  props: {
    period: {
      type: Array,
      default: () => ([])
    },
    typesPay: {
      typePay: Array,
      default: () => ([])
    },
    type: Object,
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
    closePay () {
      this.$emit('clear-filter-type', 'Все платежи')
      this.$emit('first-period')
      this.isClosePay = false
    }
  }
}
