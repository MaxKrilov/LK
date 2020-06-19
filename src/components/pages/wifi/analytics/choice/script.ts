import Router from '@/router'
import ActivationModal from './components/ActivationModal/index.vue'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { mapState } from 'vuex'

interface Point {
  id: number;
  address: string;
}

interface Component {
  pre: string;
  point: number;
  points: Point[];
  isAccept: boolean;
  toggleAccept(this: Component): void;
  backward(this: Component): void;
}

export default {
  name: 'wifi-analytics-choice-page',
  components: {
    ActivationModal
  },
  methods: {
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
    selectedPoint () {
      return this.points?.reduce((point, item) => item.id === this.point ? item : point)
    },
    ...mapState({
      getCaptionText (state: any) {
        return state.variables[SCREEN_WIDTH] >= 640 ? 'По адресу:' : 'Подключить по адресу:'
      }
    })
  } as Partial<Component>,
  data () {
    return {
      pre: 'wifi-analytics-choice-page',
      isAccept: false,
      point: 0,
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
