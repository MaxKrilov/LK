import { Vue, Component } from 'vue-property-decorator'
import ErPromo from '../../../blocks/ErPromo/index.vue'
import { CreateElement, VNode } from 'vue'

export interface iPromoItem {
  icon: string,
  name: string,
  description: string
}

@Component({
  components: {
    ErPromo
  }
})
export default class PromoPage extends Vue {
  listFeature: iPromoItem[] = [
    {
      icon: 'speedup',
      name: 'Высокая скорость интернета в офисе',
      description: 'Выделенная линия на скорости до 1 Гбит/с обеспечит эффективную работу вашего бизнеса. Симметричный канал связи гарантирует равную входящую и\tисходящую скорости. Электронная почта и документооборот, связь между офисами и платежные терминалы — с\tинтернетом Дом.ru Бизнес у вас  все работает быстро и безотказно.'
    },
    {
      icon: 'thumb_up',
      name: 'Надежность',
      description: 'Уникальная кольцевая топология сети, резервирование каналов связи и круглосуточный мониторинг из единого центра обеспечивают бесперебойность работы, непрерывность сессий и доступность услуги для вас и вашего бизнеса. Показатель отказоустойчивости сети — 99,9% — на уровне лидеров мирового телеком-рынка.'
    },
    {
      icon: 'bundle',
      name: 'Cервис',
      description: 'Белый статический IP-адрес и дополнительный белый статический IP для регистрации в сети, Wi-Fi-роутер для беспроводного доступа сотрудников в интернет. Контент фильтрация — черный /белый список, ограничение доступа к\tсоциальным сетям и сайтам для взрослых. Готовое решение для образовательных учреждений сформировано по рекомендациям Роспотребнадзора.'
    },
    {
      icon: 'rouble',
      name: 'Выгодно',
      description: 'Размер ежемесячной абонентской платы рассчитывается индивидуально в зависимости от необходимого объёма потребления ресурсов. Менеджеры Дом.ru Бизнес подберут для вас максимально выгодный тарифный план под задачи вашего бизнеса. Специальные опции и акции позволяют максимально эффективно использовать возможности каждого тарифа и при этом экономить.'
    },
    {
      icon: 'manager',
      name: 'Индивидуальный подход',
      description: 'Квалифицированные специалисты будут сопровождать вас от первого контакта. Персональный менеджер по документообороту всегда предоставит актуальную информацию о состоянии счета и потреблении услуги, обеспечит своевременное получение всех необходимых документов по договору.'
    }
  ]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <div class={['main-content', 'main-content--padding', 'main-content--top-menu-fix']}>
        <er-page-header title={'Интернет'} />
        <er-promo banner={'internet-promo.png'} featureList={this.listFeature} linkToConnect={'https://b2b.domru.ru/products/internet'} />
      </div>
    )
  }
}
