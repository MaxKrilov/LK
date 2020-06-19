import Promo from './components/promo/index.vue'
import StatFilter from './components/stat-filter/index.vue'
import CreateFilter from './components/create-filter/index.vue'
import EditFilter from './components/edit-filter/index.vue'
import Router from '@/router'

export default {
  name: 'wifi-analytics-promo-page',
  components: {
    Promo
  },
  methods: {
    forward () {
      Router.push({
        name: 'wifi-analytics-choice'
      })
    }
  },
  data () {
    return {
      pre: 'wifi-analytics-promo-page',
      featureList: [
        {
          icon: 'stat',
          name: 'Статистика пользователей',
          isComponent: true,
          component: StatFilter
        },
        {
          icon: 'filter',
          name: 'Вы можете создать фильтр',
          isComponent: true,
          component: CreateFilter
        },
        {
          icon: 'settings',
          name: 'Операции с фильтром',
          isComponent: true,
          component: EditFilter
        }
      ],
      cost: 'Стоимость услуги — 450 ₽'
    }
  }
}
