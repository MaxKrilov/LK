import { concat } from 'lodash'

interface SubMenuItem {
  name: string
  url: string
}

interface MenuItem {
  name: string
  icon: string
  isOpen: boolean
  url: string
  subitem?: SubMenuItem[]
}

const isConnectProduct = (listProduct: { code: string, name: string, price: number }[], productCode: string) => {
  return listProduct.findIndex(product => product.code === productCode) > -1
}

const MenuItemList = (listProduct: { code: string, name: string, price: number }[]): MenuItem[] => {
  return [
    {
      name: 'Главная',
      icon: 'home',
      isOpen: true,
      url: '/lk',
      subitem: [
        {
          name: 'Профиль',
          url: '/lk/profile'
        },
        {
          name: 'Платежи',
          url: '/lk/payments'
        },
        {
          name: 'Документы',
          url: '/lk/documents'
        },
        {
          name: 'Поддержка',
          url: '/lk/support'
        },
        {
          name: 'Заказы',
          url: '/lk/orders'
        },
        {
          name: 'Цифровые продукты',
          url: '/lk/digital-products'
        }
      ]
    },
    {
      name: 'Интернет',
      icon: 'internet',
      isOpen: false,
      url: '/lk/internet',
      subitem: isConnectProduct(listProduct, 'Интернет')
        ? [
          {
            name: 'Статистика',
            url: '/lk/internet/statistic'
          },
          {
            name: 'Контент-фильтрация',
            url: '/lk/internet/content-filter'
          },
          {
            name: 'Обратные зоны',
            url: '/lk/internet/reverce-zones'
          },
          {
            name: 'Дополнительные IP-адреса',
            url: '/lk/internet/ip'
          }
          // {
          //   name: 'Защита от DDoS атак',
          //   url: '/lk/internet/ddos/'
          // }
        ]
        : []
    },
    // {
    //   name: 'Облачная телефония',
    //   icon: 'cloud_telephone',
    //   isOpen: false,
    //   url: '/lk/oats/promo',
    //   subitem: [
    //     {
    //       name: 'Портал ОАТС',
    //       url: '/lk/oats'
    //     }
    //   ]
    // },
    {
      name: 'Видеонаблюдение',
      icon: 'watch',
      isOpen: false,
      url: '/lk/videocontrol/',
      subitem: isConnectProduct(listProduct, 'Форпост')
        ? [
          {
            name: 'Видеоаналитика',
            url: '/lk/videocontrol/analytics'
          },
          {
            name: 'Портал видеонаблюдения',
            url: '/lk/videocontrol/go-to-forpost'
          }
        ]
        : []
    },
    {
      name: 'WiFi зона',
      icon: 'wifi',
      isOpen: false,
      url: '/lk/wifi',
      subitem: concat(
        isConnectProduct(listProduct, 'Wi-Fi')
          ? [
            {
              name: 'Сервисы авторизации',
              url: '/lk/wifi/services-auth'
            },
            {
              name: 'Конструктор страницы авторизации',
              url: '/lk/wifi/personalization'
            },
            // {
            //   name: 'Контент-фильтрация',
            //   url: '/lk/wifi/content'
            // },
            {
              name: 'Аналитика',
              url: '/lk/wifi/analytics/statistics'
            }
          ]
          : [],
        {
          name: 'Wi-Fi PRO',
          url: '/lk/wifi/pro'
        }
      )
    },
    {
      name: 'Телефония',
      icon: 'telephone',
      isOpen: false,
      url: '/lk/telephony',
      subitem: isConnectProduct(listProduct, 'Телефония')
        ? [
          {
            name: 'Статистика',
            url: '/lk/telephony/statistic'
          },
          {
            name: 'Переадресация',
            url: '/lk/telephony/redirections'
          },
          {
            name: 'Чёрный список',
            url: '/lk/telephony/blacklist'
          }
        ]
        : []
    },
    {
      name: 'Бизнес ТВ',
      icon: 'tv',
      isOpen: false,
      url: '/lk/tv',
      subitem: [
        {
          name: 'Пакеты каналов',
          url: '/lk/tv/packages-list'
        }
      ]

    },
    {
      name: 'Сетевая инфраструктура',
      icon: 'vpn',
      isOpen: false,
      url: '/lk/vpn',
      subitem: [
        {
          name: 'promo',
          url: '/lk/vpn/promo'
        }
      ]

    }
  ]
}

export default MenuItemList
