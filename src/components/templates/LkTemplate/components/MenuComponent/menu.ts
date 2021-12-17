import { concat } from 'lodash'

interface SubMenuItem {
  name: string
  url: string,
  subname?: string
  analyticCategory?: string
  analyticLabel?: string
}

interface MenuItem {
  name: string
  icon: string
  isOpen: boolean
  url: string
  subitem?: SubMenuItem[],
  analyticLabel?: string
}

interface IProductItem {
  code: string,
  name: string,
  price: number,
  offerName: string
}

const isConnectProduct = (listProduct: IProductItem[], productCode: string) => {
  return listProduct.findIndex(product => product.code === productCode) > -1
}

const isConnectWifiMono = (listProduct: IProductItem[]) => {
  return listProduct.some(productItem => productItem.offerName.match(/hot spot/ig))
}

const isConnectWifiPro = (listProduct: IProductItem[]) => {
  return listProduct.some(productItem => ~productItem.offerName.toLowerCase().indexOf('pro'))
}

const MenuItemList = (listProduct: IProductItem[], oatsPortalLink: string): MenuItem[] => {
  return [
    {
      name: 'Главная',
      icon: 'home',
      isOpen: true,
      url: '/lk',
      analyticLabel: 'home',
      subitem: [
        {
          name: 'Профиль',
          url: '/lk/profile',
          analyticLabel: 'mainprofile'
        },
        {
          name: 'Платежи',
          url: '/lk/payments',
          analyticLabel: 'mainpaiments'
        },
        {
          name: 'Документы',
          url: '/lk/documents',
          analyticLabel: 'maindocs'
        },
        {
          name: 'Поддержка',
          url: '/lk/support',
          analyticLabel: 'mainsupport'
        },
        {
          name: 'Заказы',
          url: '/lk/orders',
          analyticLabel: 'mainorders'
        },
        {
          name: 'Цифровые продукты',
          url: '/lk/digital-products',
          analyticLabel: 'maindigiproducts'
        }
      ]
    },
    {
      name: 'Интернет',
      icon: 'internet',
      isOpen: false,
      url: '/lk/internet',
      analyticLabel: 'internet',
      subitem: isConnectProduct(listProduct, 'Интернет')
        ? [
          {
            name: 'Статистика',
            url: '/lk/internet/statistic',
            analyticCategory: 'internet',
            analyticLabel: 'stats'
          },
          {
            name: 'Контент-фильтрация',
            url: '/lk/internet/content-filter',
            analyticCategory: 'internet',
            analyticLabel: 'filters'
          },
          {
            name: 'Обратные зоны',
            url: '/lk/internet/reverce-zones',
            analyticCategory: 'internet',
            analyticLabel: 'backzones'
          },
          {
            name: 'Дополнительные IP-адреса',
            url: '/lk/internet/ip',
            analyticCategory: 'internet',
            analyticLabel: 'extraip'
          },
          {
            name: 'IP Транзит',
            url: '/lk/internet/ip-transit',
            analyticCategory: 'internet',
            analyticLabel: 'iptransit'
          },
          {
            name: 'Защита от DDoS атак',
            url: '/lk/internet/ddos/',
            analyticCategory: 'internet',
            analyticLabel: 'ddosprotect'
          }
        ]
        : [{
          name: 'IP Транзит',
          url: '/lk/internet/ip-transit',
          analyticCategory: 'internet',
          analyticLabel: 'iptransit'
        }]
    },
    {
      name: 'Облачная телефония',
      icon: 'cloud_telephone',
      isOpen: false,
      url: '/lk/oats/',
      analyticLabel: 'oats',
      subitem: [
        {
          name: 'Портал ОАТС',
          url: oatsPortalLink
        },
        {
          name: 'Статистика',
          url: '/lk/oats/statistic'
        }
      ]
    },
    {
      name: 'Видеонаблюдение',
      icon: 'watch',
      isOpen: false,
      url: '/lk/videocontrol/forpost/',
      analyticLabel: 'cctv',
      subitem: isConnectProduct(listProduct, 'Форпост') || isConnectProduct(listProduct, 'iVideon')
        ? [
          {
            name: 'Видеоаналитика',
            url: '/lk/videocontrol/forpost/products'
          },
          {
            name: 'Портал видеонаблюдения',
            url: '/lk/videocontrol/forpost/go-to-forpost'
          },
          {
            name: 'Видеонаблюдение',
            subname: 'Энфорта',
            url: '/lk/videocontrol/enforta/'
          }
        ]
        : []
    },
    {
      name: 'WiFi зона',
      icon: 'wifi',
      isOpen: false,
      url: '/lk/wifi',
      analyticLabel: 'wifi',
      subitem: concat(
        isConnectWifiMono(listProduct)
          ? [
            {
              name: 'Сервисы авторизации',
              url: '/lk/wifi/services-auth'
            },
            {
              name: 'Конструктор страницы авторизации',
              url: '/lk/wifi/personalization'
            },
            {
              name: 'Контент-фильтрация',
              url: '/lk/wifi/content-filter'
            },
            {
              name: 'Аналитика',
              url: '/lk/wifi/analytics/statistics'
            }
          ]
          : [],
        isConnectWifiPro(listProduct)
          ? [
            {
              name: 'Wi-Fi PRO',
              url: '/lk/wifi/pro'
            }
          ]
          : [],
        {
          name: 'Wi-Fi маркетинг (Радар + Wi-Fi Hot Spot)',
          subname: '\n',
          url: '/lk/wifi/radar'
        }
      )
    },
    {
      name: 'Телефония',
      icon: 'telephone',
      isOpen: false,
      url: '/lk/telephony',
      analyticLabel: 'telephony',
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
      analyticLabel: 'businesstv',
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
      analyticLabel: 'network'
    }
  ]
}

export default MenuItemList
