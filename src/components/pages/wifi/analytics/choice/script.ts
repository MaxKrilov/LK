import Router from '@/router'
import ActivationModal from './components/ActivationModal/index.vue'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_MD } from '@/constants/breakpoint'
import { mapState } from 'vuex'

interface Point {
  id: number;
  address: string;
}

interface Component {
  selected: Point[];
  points: Point[];
  isAccept: boolean;
  doConfirm(this: Component): void;
  toggleAccept(this: Component): void;
  backward(this: Component): void;
}

export default {
  name: 'wifi-analytics-choice-page',
  components: {
    ActivationModal
  },
  methods: {
    doConfirm () {
      Router.push({
        name: 'analytics-visitors'
      })
    },
    toggleAccept () {
      this.isAccept = !this.isAccept
    },
    backward () {
      Router.push({
        name: 'wifi-analytics-promo'
      })
    },
    getImg (img: string) {
      return require(`@/assets/images/${img}`)
    }
  } as Partial<Component>,
  computed: {
    ...mapState({
      getCaptionText (state: any) {
        return this.selected.length > 1
          ? (state.variables[SCREEN_WIDTH] >= BREAKPOINT_MD ? 'По адресам:' : 'Подключить по адресам:')
          : (state.variables[SCREEN_WIDTH] >= BREAKPOINT_MD ? 'По адресу:' : 'Подключить по адресу:')
      }
    })
  } as Partial<Component>,
  data () {
    return {
      pre: 'wifi-analytics-choice-page',
      isAccept: false,
      selected: [],
      points: [
        {
          id: 0,
          address: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100'
        },
        {
          id: 1,
          address: 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 100, корпус 324'
        },
        {
          id: 2,
          address: 'Село Кукуево, пр-кт. Трактористов, д. 2, корпус 1'
        }
      ]
    }
  }
}
