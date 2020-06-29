export const VISITS = [{
  'label': '1',
  'data': 2025
}, {
  'label': '2',
  'data': 1882
}, {
  'label': '3-5',
  'data': 1809
}, {
  'label': '6-9',
  'data': 1322
}, {
  'label': '10-30',
  'data': 1122
}, {
  'label': '>30',
  'data': 1114
}]

export const LANGS = [{
  'label': 'ENG',
  'data': 3456
}, {
  'label': 'РУС',
  'data': 10456
}]

export const AUTH_TYPE = [{
  'label': '«Я гость — через SMS»',
  'icon': 'profile',
  'data': 400
}, {
  'label': '«Я гость — через госуслуги»',
  'icon': 'gosuslugi',
  'data': 250
}, {
  'label': '«Я клиент Дом.ru»',
  'icon': 'smile',
  'data': 160
}, {
  'label': '«Премиум-доступ»',
  'icon': 'vip',
  'data': 130
}, {
  'label': 'По ваучеру',
  'icon': 'vaucher',
  'data': 50
}, {
  'label': 'Вконтакте',
  'icon': 'vk',
  'data': 50
}, {
  'label': 'Facebook',
  'icon': 'facebook',
  'data': 40
}, {
  'label': 'Однокласники',
  'icon': 'odnoklassniki',
  'data': 30
}, {
  'label': 'Instagram',
  'icon': 'instagram',
  'data': 25
}, {
  'label': 'Google +',
  'icon': 'google_plus',
  'data': 6
}, {
  'label': 'Twitter',
  'icon': 'twitter',
  'data': 2
}
]

export const AGES = [
  {
    label: '<18',
    data1: 40,
    data2: 55
  },
  {
    label: '18-25',
    data1: 30,
    data2: 78
  },
  {
    label: '26-40',
    data1: 27,
    data2: 40
  },
  {
    label: '41-60',
    data1: 50,
    data2: 33
  },
  {
    label: '>60',
    data1: 50,
    data2: 33
  }
]

export const CONNECTIONS = [
  { label: 'Авторизованные пользователи',
    data: [
      {
        label: 'Уникальные авториз. пользователи',
        active: true,
        data: [{
          date: '2020-06-20',
          data: 100
        },
        {
          date: '2020-06-21',
          data: 120
        },
        {
          date: '2020-06-22',
          data: 170
        },
        {
          date: '2020-06-23',
          data: 110
        },
        {
          date: '2020-06-24',
          data: 70
        },
        {
          date: '2020-06-25',
          data: 60
        },
        {
          date: '2020-06-26',
          data: 124
        }]
      },
      {
        label: 'Авторизация «Я клиент»',
        active: false,
        data: [{
          date: '2020-06-20',
          data: 140
        },
        {
          date: '2020-06-21',
          data: 170
        },
        {
          date: '2020-06-22',
          data: 120
        },
        {
          date: '2020-06-23',
          data: 110
        },
        {
          date: '2020-06-24',
          data: 145
        },
        {
          date: '2020-06-25',
          data: 156
        },
        {
          date: '2020-06-26',
          data: 189
        }]
      },
      {
        label: 'Авторизация «Премиум-доступ»',
        active: false,
        data: [{
          date: '2020-06-20',
          data: 10
        },
        {
          date: '2020-06-21',
          data: 20
        },
        {
          date: '2020-06-22',
          data: 70
        },
        {
          date: '2020-06-23',
          data: 10
        },
        {
          date: '2020-06-24',
          data: 50
        },
        {
          date: '2020-06-25',
          data: 60
        },
        {
          date: '2020-06-26',
          data: 124
        }]
      }
    ]
  },
  {
    label: 'Авторизация через соц. сети',
    data: [
      {
        label: 'Вконтакте',
        active: true,
        data: [{
          date: '2020-06-20',
          data: 50
        },
        {
          date: '2020-06-21',
          data: 67
        },
        {
          date: '2020-06-22',
          data: 34
        },
        {
          date: '2020-06-23',
          data: 90
        },
        {
          date: '2020-06-24',
          data: 123
        },
        {
          date: '2020-06-25',
          data: 73
        },
        {
          date: '2020-06-26',
          data: 173
        }]
      }
    ]
  },
  {
    label: 'Неавторизованые пользователи',
    data: [
      {
        label: 'Уникальные неавториз. пользователи',
        active: false,
        data: [
          {
            date: '2020-06-20',
            data: 10
          },
          {
            date: '2020-06-21',
            data: 11
          },
          {
            date: '2020-06-22',
            data: 17
          },
          {
            date: '2020-06-23',
            data: 9
          },
          {
            date: '2020-06-24',
            data: 7
          },
          {
            date: '2020-06-25',
            data: 7
          },
          {
            date: '2020-06-26',
            data: 12
          }
        ]
      }
    ]
  }
]
