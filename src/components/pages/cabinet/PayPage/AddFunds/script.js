import PayCard from '../components/PayCard/index.vue'
import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

export default {
  name: 'add-funds',
  components: {
    PayCard
  },
  data: () => ({
    pre: 'add-funds',
    sumPay: '100500,00',
    screenW: '320',
    bottom: 'bottom',
    valSelect: 'Январь',
    visFilter: '__vis-filter',
    widthContainer: '108% !important',
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
/*
    getCarouselItem () {
      // todo Переделать после реализации админ-панели
      // return ['slide_1', 'slide_2'].map(item => this.$createElement('div', {
      return ['slide_1'].map(item => this.$createElement('div', {
        staticClass: `${this.pre}__carousel__item`
      }, [
        this.$createElement('picture', [
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/card_noenter_1200.png`), media: '(min-width: 1200px)' } }),
          // this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/1200.png`), media: '(min-width: 1200px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/960.png`), media: '(min-width: 960px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/640.png`), media: '(min-width: 640px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/480.png`), media: '(min-width: 480px)' } }),
          this.$createElement('source', { attrs: { srcset: require(`@/assets/images/carousel/${item}/320.png`), media: '(min-width: 0)' } }),
          this.$createElement('img', { attrs: { src: require(`@/assets/images/carousel/${item}/1200.png`) } })
        ])
      ]))
    }
*/

  },
  mounted () {
    // this.imgScreen ()
    // this.screenW = String(this[SCREEN_WIDTH])
    // console.log(this.screenW)
    // console.log(`"@/assets/images/card_new_${this.screenW}.png"`)
  },
  watch: {
    SCREEN_WIDTH () {
      // this.screenW = String(this[SCREEN_WIDTH])
      // this.imgScreen ()
    }
  },
  methods: {
    paypage () {
      this.$router.push('/lk/payments')
    },
    typeFind (select) {
      if (select === 'По услуге') {
        this.valSelect = 'Январь'
      } else {
        this.valSelect = 'Адрес'
      }
    },
    topOperation (payload) {
      this.visFilter = payload ? '__vis-filter' : ''
    }
  }
}
