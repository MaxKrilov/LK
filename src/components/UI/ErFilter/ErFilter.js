import { BREAKPOINT_MD } from '@/constants/breakpoint'

export default {
  props: ['value'],
  model: {
    event: 'modified'
  },
  data () {
    return {
      isFiltersVisible: false
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.variables.SCREEN_WIDTH < BREAKPOINT_MD
    }
  },
  watch: {
    isFiltersVisible: function () {
      this.$emit('modified', this.isFiltersVisible)
    }
  },
  methods: {
    getFilterComponent () {
      if (this.isMobile) {
        return 'er-right-modal'
      } else {
        return 'er-slide-up-down'
      }
    },
    getFilterProps () {
      return {
        active: this.isFiltersVisible,
        duration: 150,
        overlay: true
      }
    },
    closeFilter () {
      this.isFiltersVisible = false
    }
  }
}
