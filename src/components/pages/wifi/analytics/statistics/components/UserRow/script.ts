import ErDialog from '@/components/UI/ErDialog'
import UserCard from '../UserCard/index.vue'
import { UserRowComponent } from '@/components/pages/wifi/analytics/statistics/types'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_SM, BREAKPOINT_XL } from '@/constants/breakpoint'

export default {
  name: 'user-row',
  components: {
    'er-dialog': ErDialog,
    'user-card': UserCard
  },
  computed: {
    ...mapState({
      isSmallMac (state: any) {
        return state.variables[SCREEN_WIDTH] < BREAKPOINT_SM
      },
      isCardView (state: any) {
        return state.variables[SCREEN_WIDTH] >= BREAKPOINT_XL
      }
    })
  },
  methods: {
    showCard () {
      this.$emit('select', this.user)
    },
    hideCard () {
      this.$emit('select', null)
    }
  } as Partial<UserRowComponent>,
  props: {
    user: {
      type: Object
    },
    selected: {
      type: Boolean
    }
  }
}
