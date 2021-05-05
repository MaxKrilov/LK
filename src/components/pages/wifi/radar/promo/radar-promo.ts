import { Component, Vue } from 'vue-property-decorator'
import { RADAR_CONNECT_URL } from '@/constants/wifi'
import IPromoFeatureItem from '@/interfaces/promo-feature-item'
import ErPromo from '@/components/blocks/ErPromo/index.vue'

const components = {
  ErPromo
}
@Component({ components })
export default class RadarPromo extends Vue {
  link: string = RADAR_CONNECT_URL
  featureList: IPromoFeatureItem[] = [
    {
      icon: 'wifi',
      name: 'Что такое Wi-Fi радар?',
      isHTML: true,
      description: `<ul>
        <li>Точка доступа Wi-Fi со специальной прошивкой, настроенная на сбор идентификаторов мобильных устройств (MAC-адресов), попадающих в зону покрытия.</li>
        <li>Сбор данных происходит только с тех устройств, на которых включен Wi-Fi в настройках. При этом подключать устройства к какой-либо сети не нужно.</li>
        <li>Личный кабинет — веб-интерфейс, в котором хранится статистика, отображается аналитическая информация и осуществляется управление собранными данными.</li>
      </ul>`
    },
    {
      icon: 'circle_ok',
      name: 'Какие задачи решает?',
      isHTML: true,
      description: `<ul>
        <li>Оценивайте проходимость интересующих локаций.</li>
        <li>Изучайте портрет клиента и посещаемость, сравнивайте их по разным точкам продаж и отслеживайте изменения.</li>
        <li>Собирайте идентификаторы потенциальных клиентов, чтобы запустить на них рекламную кампанию.</li>
        <li>Рассказывайте об акциях собранным аудиториям — запускайте коммуникации прямо из личного кабинета, настраивайте таргетированную рекламу в Яндекс, MyTarget, Facebook.</li>
      </ul>`
    },
    {
      icon: 'pie_diagram',
      name: '',
      description:
        'Собранные данные очищаются в нашей Big Data от серых MAC-адресов и хранятся неограниченное количество времени, чтобы вы всегда могли к ним обратиться.\n' +
        'Вы можете разделить собранную аудиторию на интересующие сегменты и отследить пересечения между ними, отправить готовый сегмент для анализа в Яндекс. Аудитории и получить анализ портрета собранной аудитории.\n' +
        'Благодаря накопленной Big Data мы не только собираем для вас МАС адреса, но и обогащаем их информацией, нужной для таргетинга и коммуникаций.'
    }
  ]

  onClickDemo () {
    const cityName = 'chel'
    // @ts-ignore
    window.location = `https://radar.wifi.ru/demo?domain=${cityName}`
  }
}
