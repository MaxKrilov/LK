import { Vue, Component } from 'vue-property-decorator'
import ErPromo from '@/components/blocks/ErPromo/index.vue'
import Advantages from './advantages.vue'
import BasicCharacteristic from './basic-characteristic.vue'

const components = { ErPromo }

@Component({ components })
export default class TVPromoPage extends Vue {
  featureList = [
    {
      icon: 'stat',
      name: 'Продвижение',
      description:
        'Выбирайте пакеты каналов, продвигайте товары и услуги вашего бизнеса'
    },
    {
      icon: 'rouble',
      name: 'Маркетинг',
      description:
        'Эффективный визуальный маркетинг с функционалом «Управляйте рекламой» на ТВ приставке Imaqliq'
    },
    {
      icon: 'smile',
      name: 'Привлечение',
      description:
        'Привлечение посетителей в ваше заведение или офис'
    },
    {
      icon: 'thumb_up',
      name: 'Достоинства',
      isComponent: true,
      component: Advantages
    },
    {
      icon: 'bundle',
      name: 'Базовые характеристики',
      isComponent: true,
      component: BasicCharacteristic
    },
    {
      icon: 'star',
      name: 'Гостиничный спецтариф',
      description:
        'Для гостиниц специальный тарифный план от 290 ₽\\мес.'
    }
  ]
}
