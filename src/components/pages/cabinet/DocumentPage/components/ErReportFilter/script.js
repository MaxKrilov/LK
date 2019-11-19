import ErFilterGroup from '../ErFilterGroup'
import DOC_TYPES from '../../types'

export default {
  components: {
    ErFilterGroup
  },
  data () {
    return {
      isFiltersVisible: false,
      selectedDocumentType: DOC_TYPES['REPORT'],
      selectedPeriod: new Date()
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
