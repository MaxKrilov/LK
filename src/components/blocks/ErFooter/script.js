import ErFooterMenu from '@/components/blocks/ErFooterMenu'
import { LEGAL_ADDRESS, LEGAL_ADDRESS_MAP_LINK } from '@/constants/address'

export default {
  components: {
    ErFooterMenu
  },
  data: () => {
    return {
      NEWS_LINK: 'https://b2b.domru.ru/news',
      MANAGER_PHONE_NUMBER: {
        title: '8 800 333 9000',
        number: '78003339000'
      },
      SERVICE_PHONE_NUMBER: {
        title: '8 800 333 9000',
        number: '78003339000'
      },
      SOCIAL_LINK_VK: 'https://vk.com/domru_b2b',
      SOCIAL_LINK_FB: 'https://www.facebook.com/domru.b2b/',
      SOCIAL_LINK_INSTAGRAM: 'https://www.instagram.com/dom.ru_b2b/',
      ACTUAL_ADDRESS: {
        text: LEGAL_ADDRESS,
        url: LEGAL_ADDRESS_MAP_LINK
      },
      serviceMenu: [
        {
          title: 'Интернет',
          url: 'https://b2b.domru.ru/products/internet'
        },
        {
          title: 'Облачный АТС',
          url: 'https://b2b.domru.ru/products/oats-new'
        },
        // {
        //   title: 'Облачные сервисы',
        //   url: '#'
        // },
        {
          title: 'Wi-Fi Hotspot',
          url: 'https://b2b.domru.ru/products/wi-fi-hot-spot'
        },
        {
          title: 'Видеонаблюдение',
          url: 'https://b2b.domru.ru/products/videonablyudenie'
        }
        // {
        //   title: 'Телефония',
        //   url: '#'
        // }
      ],
      serviceMenuSecond: [
        {
          title: 'Профиль',
          url: '/lk/profile'
        },
        {
          title: 'Платежи',
          url: '/lk/payments'
        },
        {
          title: 'Документы',
          url: '/lk/documents'
        },
        {
          title: 'Поддержка',
          url: '/lk/support'
        },
        {
          title: 'Заказы',
          url: '/lk/orders'
        }
      ]
    }
  },
  computed: {
    branchAddress () {
      return this.$store.state.branch.address
    }
  }
}
