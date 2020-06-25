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
  },
  {
    name: 'Видеонаблюдение',
    icon: 'watch',
    isOpen: false,
    url: '/lk/videocontrol/',
    subitem: [
      {
        name: 'Видеоаналитика',
        url: '/lk/videocontrol/analytics'
      },
      {
        name: 'Портал видеонаблюдения',
        url: ''
      }
    ]
  },
  {
    name: 'WiFi зона',
    icon: 'wifi',
    isOpen: false,
    url: '/lk/wifi',
    subitem: [
      {
        name: 'Сервисы авторизации',
        url: '/lk/wifi/auth'
      },
      {
        name: 'Конструктор страницы авторизации',
        url: '/lk/wifi/constructor'
      },
      {
        name: 'Контент-фильтрация',
        url: '/lk/wifi/content'
      },
      {
        name: 'Аналитика',
        url: '/lk/wifi/analytics'
      }
    ]
  },
  {
    name: 'Телефония',
    icon: 'telephone',
    isOpen: false,
    url: '/lk/telephony',
    subitem: [
      {
        name: 'Промо страница',
        url: '/lk/telephony/promo'
      },
      {
        name: 'Пакет минут',
        url: '/lk/telephony/plug'
      },
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
  }
]

export default MenuItemList
