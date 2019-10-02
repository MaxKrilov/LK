import ErFooterMenu from '@/components/blocks/ErFooterMenu'
import ErGlowIcon from '@/components/blocks/ErGlowIcon'

export default {
  components: {
    ErFooterMenu,
    ErGlowIcon
  },
  data: () => {
    return {
      NEWS_LINK: '#news',
      MANAGER_PHONE_NUMBER: {
        title: '8 800 333 9000',
        number: '78003339000'
      },
      SERVICE_PHONE_NUMBER: {
        title: '8 800 333 9000',
        number: '78003339000'
      },
      SOCIAL_LINK_VK: '#vk',
      SOCIAL_LINK_FB: '#fb',
      SOCIAL_LINK_INSTAGRAM: '#instagram',
      ACTUAL_ADDRESS: {
        text: '614066, г.Пермь, шоссе Космонавтов, д.111, корп.43, 1-й этаж, офис 102.',
        url: 'https://www.google.com/maps/place/%D1%88.+%D0%9A%D0%BE%D1%81%D0%BC%D0%BE%D0%BD%D0%B0%D0%B2%D1%82%D0%BE%D0%B2,+111,+%D0%B9+%D1%8D%D1%82%D0%B0%D0%B6,+%D0%BE%D1%84%D0%B8%D1%81+102,+%D0%9F%D0%B5%D1%80%D0%BC%D1%8C,+%D0%9F%D0%B5%D1%80%D0%BC%D1%81%D0%BA%D0%B8%D0%B9+%D0%BA%D1%80%D0%B0%D0%B9,+614087/@57.9918813,56.2014996,17z/data=!3m1!4b1!4m5!3m4!1s0x43e8c74e99465b8d:0x74ae1fe208f2854c!8m2!3d57.9918785!4d56.2036883'
      },
      serviceMenu: [
        {
          title: 'Интернет',
          url: '#'
        },
        {
          title: 'Облачный АТС',
          url: '#'
        },
        {
          title: 'Облачные сервисы',
          url: '#'
        },
        {
          title: 'Wi-Fi Hotspot',
          url: '#'
        },
        {
          title: 'Видеонаблюдение',
          url: '#'
        },
        {
          title: 'Антивирусы',
          url: '#'
        },
        {
          title: 'SIP телефоноия',
          url: '#'
        }
      ],
      serviceMenuSecond: [
        {
          title: 'Профиль',
          url: '#'
        },
        {
          title: 'Платежи',
          url: '#'
        },
        {
          title: 'Документы',
          url: '#'
        },
        {
          title: 'Поддержка',
          url: '#'
        },
        {
          title: 'Спецпредложения',
          url: '#'
        },
        {
          title: 'Программа лояльности',
          url: '#'
        }
      ]
    }
  }
}
