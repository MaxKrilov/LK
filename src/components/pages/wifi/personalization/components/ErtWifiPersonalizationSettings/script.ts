import Vue from 'vue'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_LG } from '@/constants/breakpoint'

// Вынесли в отдельный файл, так как TypeScript "не видит" screenWidth
export default Vue.extend({
  name: 'ert-wifi-personalization-settings',
  props: {
    listScreenOrientation: {
      type: Array,
      default: () => ([])
    },
    listLanguage: {
      type: Array,
      default: () => ([])
    },
    modelScreenOrientation: {
      type: Object,
      default: () => ({})
    },
    modelLanguage: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    internalModelScreenOrientation: {
      get () {
        return this.modelScreenOrientation
      },
      set (val) {
        this.$emit('change:screen-orientation', val)
      }
    },
    internalModelLanguage: {
      get () {
        return this.modelLanguage
      },
      set (val) {
        // @ts-ignore
        this.$emit('change:language', val)
      }
    },
    lessMD () {
      return (this as any).screenWidth < BREAKPOINT_LG // eslint-disable-line
    },
    ...mapState({
      screenWidth: (state: any) => Number(state.variables[SCREEN_WIDTH])
    })
  }
})
