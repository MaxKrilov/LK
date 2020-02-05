import ErFilterGroup from '../ErFilterGroup'

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
    }
  },
  data () {
    return {
      isFiltersVisible: false,
      contractFilterType: ALL_DOCUMENTS
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
