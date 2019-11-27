import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'


export default {
  name: 'detail-pay',
  props: ['month'],
  data: () => ({
    pre: 'detail-pay',
    paddingLeft: '',
    items: [
      { name: 'Абонентская плата за тариф «Бизнес Драйв 8»', value: '-2000' },
      { name: 'Увеличение скорости до 16 Мбитс/с', value: '-2000' },
      { name: 'Фильтрация контента', value: `-2000` }
    ]
  }),
  computed: {
    ...mapGetters([SCREEN_WIDTH]),
  },
  watch: {
    month () {
      if (this.month === 'Адрес' && this[SCREEN_WIDTH] >= 640) {
        this.paddingLeft = '__address'
      } else {
        this.paddingLeft = ''
      }
    }
  }
}
