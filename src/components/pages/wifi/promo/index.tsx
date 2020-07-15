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
      icon: 'heart',
      name: 'Берём все заботы на себя',
      description: 'Вам не нужно переживать о безопасности данных ваших клиентов, оборудовании и его обслуживании — это наша забота. Квалифицированные специалисты будут сопровождать вас от первого контакта. Персональный менеджер по документообороту всегда предоставит актуальную информацию о состоянии счета и потреблении услуги, обеспечит своевременное получение всех необходимых документов по договору'
    },
    {
      icon: '24h',
      name: 'Не беспокоиться о сбоях',
      description: 'Wi-Fi операторского класса, оборудование последнего поколения, круглосуточный мониторинг сети, техническая поддержка в режиме 24/7/360 — гарантируют бесперебойное предоставление услуги'
    },
    {
      icon: 'cap',
      name: 'В гостях - как дома',
      description: 'Ваши клиенты могут подключаться к Wi-Fi в статусе гостя и пользоваться интернетом на скорости не менее 3 Мбит/с. Или войти в сеть как абоненты домашнего интернета Дом.ru, получить доступ к интернету на максимально доступной скорости и чувствовать себя как дома'
    },
    {
      icon: 'wifi',
      name: 'WiFi Hotspot',
      description: 'Комплексный тариф Wi-Fi Hotspot операторского класса, оборудование последнего поколения, круглосуточный мониторинг сети, техническая поддержка в режиме 24/7/360 — гарантируют бесперебойное предоставление услуги'
    }
  ]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <div class={['main-content', 'main-content--padding', 'main-content--top-menu-fix']}>
        <er-page-header title={'Wi-Fi зона'} />
        <er-promo banner={'wifi-promo.png'} featureList={this.listFeature} linkToConnect={'https://b2b.domru.ru/products/wi-fi-hot-spot'} />
      </div>
    )
  }
}
