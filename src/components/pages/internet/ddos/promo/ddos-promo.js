/**
 * Компонент для промостраниц продуктов
 */
import ErPromo from '@/components/blocks/ErPromo'

export default {
  name: 'ddos-promo-page',
  components: {
    ErPromo
  },
  data () {
    return {
      pre: 'ddos-promo-page',
      featureList: [
        {
          icon: 'deffence_ddos',
          name: 'Защита',
          description:
            'Защита от DoS/DDoS-атак любой сложности благодаря профессиональному аппаратно-программному комплексу'
        },
        {
          icon: 'profile',
          name: 'Управление звонками',
          description:
            'Индивидуальный личный кабинет с возможностью мониторинга показателей по трафику, формированием отчетов и настройкой рассылок'
        },
        {
          icon: 'filter',
          name: 'Фильтрация',
          description:
            'Фильтрация вредоносного трафика и гарантированную доставку очищенного трафика с SLA 99,7%'
        },
        {
          icon: 'time',
          name: 'Быстро',
          description:
            'Обнаружение и защита от DDoS-атаки менее чем за 15 минут с момента ее начала'
        },
        {
          icon: 'bell',
          name: 'Оповещение',
          description:
            'Протоколирование/оповещение событий, связанных с нарушением режимов безопасности'
        },
        {
          icon: 'stat',
          name: 'Статистика',
          description:
            'Обработка показателей по трафику в режиме реального времени'
        }
      ]
    }
  }
}
