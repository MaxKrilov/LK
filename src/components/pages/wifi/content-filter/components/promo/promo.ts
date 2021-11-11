import { Vue, Component } from 'vue-property-decorator'
import ErPromo from '@/components/blocks/ErPromo/index.vue'

const featureList = [
  {
    icon: 'doc',
    name: 'Создавать правила доступа к сайтам',
    description:
      'Правила устанавливаются на весь сайт, отдельные страницы и разделы не блокируются. Заблокировать доступ к отдельным  сайтам или к категориям сайтов. Открыть доступ к нескольким сайтам, а все остальные заблокировать.'
  },
  {
    icon: 'filter',
    name: 'Вы можете создать фильтр',
    isHTML: true,
    description:
      `<strong>«Режим&nbsp;фильтрации»</strong> — <strong>«Черный&nbsp;список»</strong>. Здесь Вы можете заблокировать категории сайтов или самостоятельно ввести адреса сайтов, которые хотите заблокировать.
<br><strong>«Режим&nbsp;фильтрации»</strong> — <strong>«Белый&nbsp;список»</strong>. Здесь Вам нужно ввести адреса сайтов, к которым доступ будет открыт.`
  },
  {
    icon: 'settings',
    name: 'Операции с фильтром',
    description:
      `После создания фильтра выберите логины/ ip-адреса, для которых Вы хотите применить созданный фильтр, и нажмите «Применить существующий фильтр». Далее выберите созданный Вами фильтр.
Если Вы решили отвязать фильтр от логина, то напротив логина вместо названия действующего фильтр поставьте «Нет фильтра».
Если Вы решили полностью удалить фильтр, то напротив названия фильтра нажмите кнопку «Удалить».`
  }
]

const components = { ErPromo }

@Component({
  components,
  props: {
    isHideHeader: Boolean
  }
})
export default class WifiFilterPromo extends Vue {
  get featureList () {
    return featureList
  }

  onPlug () {
    console.log('on plug')
    this.$emit('plug')
  }
}
