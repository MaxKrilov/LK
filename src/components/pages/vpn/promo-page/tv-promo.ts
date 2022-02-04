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
        'Частный VPN может подвергаться DDOS атакам, открывать пути для заражения вирусами и бот-нетами. Провайдерский VPN гарантирует SLA, высокую пропускную способность, симметричный канал связи и безопасность.'
    },
    {
      icon: 'speedup',
      name: 'Быстро',
      description:
        'Высокоскоростной доступ к корпоративным базам данных, сетевым ресурсам и общим архивам документов для сотрудников всех офисов. Маршрутизация трафика по кратчайшему пути, гарантированная скорость + QoS.'
    },
    {
      icon: 'settings',
      name: 'Удобно',
      description:
        'Создание единой инфраструктуры для организаций Triple Play сервисов(видео, голос, данные). Проведение видеоконференций и онлайн-трансляций в высоком качестве. Дистанционное взаимодействие с удаленными ресурсами, глобальными сетями данных, финансовыми и торговыми системами.'
    },
    {
      icon: 'rouble',
      name: 'Выгодно',
      description:
        'Создание единой инфраструктуры для организаций Triple Play сервисов(видео, голос, данные). Проведение видеоконференций и онлайн-трансляций в высоком качестве. Дистанционное взаимодействие с удаленными ресурсами, глобальными сетями данных, финансовыми и торговыми системами.'
    },
    {
      icon: 'manager',
      name: 'С лучшим сервисом',
      description:
        'Одна из крупнейших управляемых сетей в Европе с лучшей средней скростью доступа в интернет на пользователя в России. Централизованый мониторинг и управление, SLA  99.9 — на уровне магистральной сети.'
    }
  ]
}
