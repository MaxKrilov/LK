import { BREAKPOINT_MD } from '@/constants/breakpoint'

export default {
  props: {
    // true - режим выбора фильтров
    // false - отображается список выбранных фильтров
    active: Boolean
  },
  data () {
    return {
      isFiltersVisible: this.active
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.variables.SCREEN_WIDTH < BREAKPOINT_MD
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
        active: this.active,
        duration: 150,
        overlay: true
      }
    },
    onClickOutsideFilter () {
      this.$set(this, 'isFiltersVisible', false)
      this.$emit('click-outside')
    }
  }
}
