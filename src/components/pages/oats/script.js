import PointComponent from './blocks/PointComponent'

export default {
  name: 'oats-page',
  components: {
    PointComponent
  },

  data () {
    return {
      pre: 'oats-page',
      isOpen: false,
      data: [
        {
          name: 'Бизнес',
          abon: 3800,
          date: '17.08.2018',
          servicesList: [
            { name: 'Безлимитная запись звонков', price: '1000', icon: 'rec' },
            {
              name: 'Внешний SIP-номер (абонентская плата)',
              price: '300',
              icon: 'telephone'
            },
            { name: 'Пакет «Эффективные продажи»', price: '150', icon: 'pack' },
            {
              name: 'Пакет минут',
              price: '1500',
              icon: 'minute_pack',
              description: 'Город / Область / Премиум'
            },
            {
              name: 'Пакет минут',
              price: '1500',
              icon: 'minute_pack',
              description: 'За границу / По России / Эконом, Город / Область'
            }
          ],
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          date: '17.08.2018',
          servicesList: [
            { name: 'Безлимитная запись звонков', price: '1000', icon: 'rec' },
            {
              name: 'Внешний SIP-номер (абонентская плата)',
              price: '300',
              icon: 'telephone'
            },
            { name: 'Пакет «Эффективные продажи»', price: '150', icon: 'pack' },
            { name: 'Пакет минут', price: '1500', icon: 'minute_pack' }
          ],
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          date: '17.08.2018',
          servicesList: [
            { name: 'Безлимитная запись звонков', price: '1000', icon: 'rec' },
            {
              name: 'Внешний SIP-номер (абонентская плата)',
              price: '300',
              icon: 'telephone'
            },
            { name: 'Пакет «Эффективные продажи»', price: '150', icon: 'pack' },
            { name: 'Пакет минут', price: '1500', icon: 'minute_pack' }
          ],
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          date: '17.08.2018',
          servicesList: [
            { name: 'Безлимитная запись звонков', price: '1000', icon: 'rec' },
            {
              name: 'Внешний SIP-номер (абонентская плата)',
              price: '300',
              icon: 'telephone'
            },
            { name: 'Пакет «Эффективные продажи»', price: '150', icon: 'pack' },
            { name: 'Пакет минут', price: '1500', icon: 'minute_pack' }
          ],
          stopped: true,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          date: '17.08.2018',
          servicesList: [
            { name: 'Безлимитная запись звонков', price: '1000', icon: 'rec' },
            {
              name: 'Внешний SIP-номер (абонентская плата)',
              price: '300',
              icon: 'telephone'
            },
            { name: 'Пакет «Эффективные продажи»', price: '150', icon: 'pack' },
            { name: 'Пакет минут', price: '1500', icon: 'minute_pack' }
          ],
          stopped: false,
          type: 'VOIP шлюз, Софтофон'
        },
        {
          name: 'Бизнес',
          abon: 3800,
          date: '17.08.2018',
          servicesList: [
            { name: 'Безлимитная запись звонков', price: '1000', icon: 'rec' },
            {
              name: 'Внешний SIP-номер (абонентская плата)',
              price: '300',
              icon: 'telephone'
            },
            { name: 'Пакет «Эффективные продажи»', price: '150', icon: 'pack' },
            { name: 'Пакет минут', price: '1500', icon: 'minute_pack' }
          ],
          stopped: true,
          type: 'VOIP шлюз, Софтофон'
        }
      ]
    }
  }
}
