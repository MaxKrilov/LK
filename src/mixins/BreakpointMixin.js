import * as BREAKPOINTS from '@/constants/breakpoint'

export default {
  computed: {
    isMobile () {
      return this.isMaxBreakpoint('md')
    }
  },
  methods: {
    /**
     * Возвращает название константы точки останова
     * @param {String} breakpoint name
     * @return {String} breakpoint constant name
     */
    getBreakpointConstName (breakpoint) {
      const BP = breakpoint.toUpperCase()
      return `BREAKPOINT_${BP}`
    },
    /**
     * Проверяет есть ли точка останова с таким названием
     * @param {String} media breakpoint name
     * @return {Boolean}
     */
    isBreakpointExist (breakpoint) {
      return Object.keys(BREAKPOINTS).includes(
        this.getBreakpointConstName(breakpoint)
      )
    },
    /**
     * Возвращает значение точки останова
     * @param {String} media breakpoint name
     * @return {Number}
     */
    getBreakpointWidth (breakpoint) {
      return BREAKPOINTS[this.getBreakpointConstName(breakpoint)]
    },
    /**
     * Проверяет минимальную media точку останова для текущей ширины экрана
     * @param {String} media breakpoint name
     * @return {Boolean}
     */
    isMinBreakpoint (breakpoint) {
      const screenWidth = this.$store.state.variables.SCREEN_WIDTH
      const isBreakpointValid = this.isBreakpointExist(breakpoint)
      const breakpointWidth = this.getBreakpointWidth(breakpoint)

      return (isBreakpointValid && screenWidth >= breakpointWidth)
    },
    /**
     * Проверяет максимальную media точку останова для текущей ширины экрана
     * @param {String} media breakpoint name
     * @return {Boolean}
     */
    isMaxBreakpoint (breakpoint) {
      const screenWidth = this.$store.state.variables.SCREEN_WIDTH
      const isBreakpointValid = this.isBreakpointExist(breakpoint)
      const breakpointWidth = this.getBreakpointWidth(breakpoint)

      return (isBreakpointValid && screenWidth < breakpointWidth)
    }
  }
}
