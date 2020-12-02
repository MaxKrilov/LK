import { Vue, Component } from 'vue-property-decorator'
import ErPromo from '@/components/blocks/ErPromo/index.vue'

const components = { ErPromo }

@Component({ components })
export default class TVPromoPage extends Vue {
  featureList = [
    {
      icon: 'deffence',
      name: 'Безопасно',
      description:
        'VPN (Виртуальная частная сеть) — ЭТО НЕ Интернет!!! VPN поверх интернет всегда подвержен DDoS-атакам, вирусам, бот-нетам и прочей нечисти гуляющей в публичной сети. Злоумышленники в том числе. Провайдерский VPN — это гарантированный SLA, гарантированная пропускная способность, симметричный канал связи, гарантия безопасности!'
    },
    {
      icon: 'speedup',
      name: 'Быстро',
      description:
        'Высокоскоростной доступ к корпоративным базам данных, сетевым ресурсам и общим архивам документов для сотрудников всех офисов. Маршрутизация трафика по кротчайшему пути, гарантированная скорость + QoS.'
    },
    {
      icon: 'settings',
      name: 'Удобно',
      description:
        'Создание единой инфраструктуры для организаций Triple Play сервисов(видео, голос, данные). Проведение видеоконференций и онлайн-трансляций в высоком качестве. Дистанционное взаимодействие с удаленнными рресурсами, глобальными сетями данных, финансовыми и торговыми системами.'
    },
    {
      icon: 'rouble',
      name: 'Выгодно',
      description:
        'Создание единой инфраструктуры для организаций Triple Play сервисов(видео, голос, данные). Проведение видеоконференций и онлайн-трансляций в высоком качестве. Дистанционное взаимодействие с удаленнными рресурсами, глобальными сетями данных, финансовыми и торговыми системами.'
    },
    {
      icon: 'manager',
      name: 'С лучшим сервисом',
      description:
        'Одна из крупнейших управляемых сетей в Европе с лучшей средней скростью доступа в интернет на пользователя в России. Централизованый мониторинг и управление, SLA  99.9 — на уровне магистральной сети.'
    }
  ]
}
