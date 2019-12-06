import ErFilterGroup from '../ErFilterGroup'

export default {
  components: {
    ErFilterGroup
  },
  props: {
    filterTypes: {
      type: Object,
      default: () => ({
        1: 'Все',
        2: 'На подпись'
      })
    }
  },
  data () {
    return {
      isFiltersVisible: false,
      contractFilterType: 1
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
