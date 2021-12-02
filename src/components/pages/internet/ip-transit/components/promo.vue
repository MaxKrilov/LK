<template lang="pug">
  .ip-transit-promo
    er-page-header(
      title="IP Транзит"
      backlink="/lk/internet"
      linkText="Назад в Интернет"
    )
    er-promo(
      title="Что даёт сервис?"
      banner='ip-transit-promo.png'
      :featureList="featureList"
      linkToConnect="https://b2b.domru.ru/products/internet"
      analyticConnectCategory="internet"
      analyticConnectLabel="transitconnect"
    )
</template>

<script>
import ErPromo from '@/components/blocks/ErPromo/index.vue'

const featureList = [
  {
    icon: 'speedup',
    name: 'Высокая скорость',
    description: 'Обеспечение высокоскоростного взаимодействия между AS клиента и глобальной сетью Интернет на базе собственной MPLS-сети ЭРТХ'
  },
  {
    icon: 'thumb_up',
    name: 'Уровень доступности услуги от 99,9%',
    description: 'Резервирование каналов связи и круглосуточный центр мониторинга 24/7.\n' +
      'Резервирование BGP-сессий по разным физическим трассам.'
  },
  {
    icon: 'star',
    name: 'Минимальная сетевая задержка',
    description: 'Благодаря прямым соединениям с контент-генераторами, с ТОП-5 операторами связи РФ и Tier1/2 операторами Европы и присутствию на крупнейших площадках обмена трафиком (IX)'
  }
]

export default {
  name: 'IpTransitPromo',
  components: { ErPromo },
  data () {
    return {
      featureList
    }
  }
}
</script>
