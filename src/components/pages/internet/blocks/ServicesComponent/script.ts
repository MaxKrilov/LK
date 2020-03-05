import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ServicesComponent extends Vue {
  // todo Вынести в props
  list = [
    {
      icon: 'stat',
      name: 'Статистика',
      isOn: true
    },
    {
      icon: 'reload',
      name: 'Обратные зоны',
      isOn: true
    },
    {
      icon: 'filter',
      name: 'Контент-фильтрация',
      isOn: true
    },
    {
      icon: 'deffence_ddos',
      name: 'Защита от DDoS-атак',
      isOn: false
    },
    {
      icon: 'add_ip',
      name: 'Дополнитель. IP адреса',
      isOn: false
    }
  ]
}
