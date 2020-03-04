import ErFilterGroup from '../ErFilterGroup'
import DOC_TYPES from '../../types'
import { lengthVar } from '../../../../../../functions/helper'

export default {
  components: {
    ErFilterGroup
  },
  data () {
    return {
      isFiltersVisible: false,
      selectedDocumentType: DOC_TYPES['REPORT']
    }
  },
  props: {
    period: {
      type: Array,
      default: () => ([])
    },
    types: {
      type: Array,
      default: () => ([])
    },
    type: Object
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
    internalType: {
      get () {
        return this.type
      },
      set (val) {
        this.$emit('change-type', val)
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
    }
  }
}
