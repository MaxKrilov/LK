import ErFilterGroup from '../ErFilterGroup'
import { lengthVar } from '../../../../../../functions/helper'

const ALL_DOCUMENTS = 'all'
const NOT_SIGNED_DOCUMENTS = 'notSigned'

export default {
  components: {
    ErFilterGroup
  },
  props: {
    filterTypes: {
      type: Object,
      default: () => ({
        [ALL_DOCUMENTS]: 'Все',
        [NOT_SIGNED_DOCUMENTS]: 'На подпись'
      })
    },
    filterType: String,
    period: Array,
    listType: {
      type: Array,
      default: () => ([])
    },
    type: Object
  },
  data () {
    return {
      isFiltersVisible: false
    }
  },
  computed: {
    internalFilterType: {
      get () {
        return this.filterType
      },
      set (val) {
        this.$emit('change-filter-type', val)
      }
    },
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
