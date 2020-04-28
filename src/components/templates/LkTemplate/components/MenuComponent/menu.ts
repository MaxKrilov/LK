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

const MenuItemList: MenuItem[] = [
  {
    name: 'Главная',
    icon: 'home',
    isOpen: false,
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
    subitem: [
      {
        name: 'Статистика',
        url: '/lk/statistic'
      },
      {
        name: 'Контент-фильтрация',
        url: '/lk/internet/content-filter/plug'
      },
      {
        name: 'Скорость',
        url: '/lk/speed'
      },
      {
        name: 'Дополнительные IP-адреса',
        url: '/lk/ip'
      },
      {
        name: 'Защита от DDoS атак',
        url: '/lk/internet/ddos/'
      }
    ]
  },
  {
    name: 'Облачная телефония',
    icon: 'cloud_telephone',
    isOpen: false,
    url: '/lk/oats/promo',
    subitem: [
      {
        name: 'Портал ОАТС',
        url: '/lk/oats'
      }
    ]
  }
]

export default MenuItemList
