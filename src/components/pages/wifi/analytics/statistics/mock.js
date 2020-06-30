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

export const USERS_LIST = [{
  'number': '1',
  'phone': '+7 976 777 88 99',
  'mac': 'a0:b0:44:d2:f8:62',
  'authorization': '100',
  'traffic': { 'value': '195,2', 'units': 'МБ' },
  'datetime': { 'date': '01.04.20', 'time': '21:20' },
  'duration': { 'hours': '3', 'minutes': '25' }
}, {
  'number': '2',
  'phone': '+7 902 343 33 00',
  'mac': 'a1:45:d4:d2:f8:62',
  'authorization': '65',
  'traffic': { 'value': '205,6', 'units': 'МБ' },
  'datetime': { 'date': '05.03.20', 'time': '14:23' },
  'duration': { 'hours': '0', 'minutes': '25' }
}, {
  'number': '3',
  'phone': '+7 912 565 77 66',
  'mac': '22:b0:f4:a2:48:62',
  'authorization': '23',
  'traffic': { 'value': '5,5', 'units': 'ГБ' },
  'datetime': { 'date': '14.03.20', 'time': '11:56' },
  'duration': { 'hours': '10', 'minutes': '12' }
}, {
  'number': '4',
  'phone': '+7 999 000 11 33',
  'mac': 'a2:b0:66:d2:f8:62',
  'authorization': '10',
  'traffic': { 'value': '565,2', 'units': 'МБ' },
  'datetime': { 'date': '14.04.20', 'time': '15:45' },
  'duration': { 'hours': '1', 'minutes': '45' }
}, {
  'number': '5',
  'phone': '+7 976 777 88 99',
  'mac': 'a0:b0:44:d2:f8:62',
  'authorization': '9',
  'traffic': { 'value': '195,2', 'units': 'МБ' },
  'datetime': { 'date': '01.04.20', 'time': '21:20' },
  'duration': { 'hours': '3', 'minutes': '25' }
}, {
  'number': '6',
  'phone': '+7 902 343 33 00',
  'mac': 'a1:45:d4:d2:f8:62',
  'authorization': '9',
  'traffic': { 'value': '25,6', 'units': 'МБ' },
  'datetime': { 'date': '05.03.20', 'time': '14:23' },
  'duration': { 'hours': '0', 'minutes': '25' }
}, {
  'number': '7',
  'phone': '+7 912 565 77 66',
  'mac': '22:b0:f4:a2:48:62',
  'authorization': '7',
  'traffic': { 'value': '5,5', 'units': 'ГБ' },
  'datetime': { 'date': '14.03.20', 'time': '11:56' },
  'duration': { 'hours': '10', 'minutes': '12' }
}, {
  'number': '8',
  'phone': '+7 999 000 11 33',
  'mac': 'a2:b0:66:d2:f8:62',
  'authorization': '7',
  'traffic': { 'value': '65,2', 'units': 'МБ' },
  'datetime': { 'date': '14.04.20', 'time': '15:45' },
  'duration': { 'hours': '1', 'minutes': '45' }
}, {
  'number': '9',
  'phone': '+7 976 777 88 99',
  'mac': 'a0:b0:44:d2:f8:62',
  'authorization': '6',
  'traffic': { 'value': '195,2', 'units': 'МБ' },
  'datetime': { 'date': '01.04.20', 'time': '21:20' },
  'duration': { 'hours': '3', 'minutes': '25' }
}, {
  'number': '10',
  'phone': '+7 902 343 33 00',
  'mac': 'a1:45:d4:d2:f8:62',
  'authorization': '5',
  'traffic': { 'value': '25,6', 'units': 'МБ' },
  'datetime': { 'date': '05.03.20', 'time': '14:23' },
  'duration': { 'hours': '0', 'minutes': '25' }
}, {
  'number': '11',
  'phone': '+7 912 565 77 66',
  'mac': '22:b0:f4:a2:48:62',
  'authorization': '5',
  'traffic': { 'value': '5,5', 'units': 'ГБ' },
  'datetime': { 'date': '14.03.20', 'time': '11:56' },
  'duration': { 'hours': '10', 'minutes': '12' }
}, {
  'number': '12',
  'phone': '+7 999 000 11 33',
  'mac': 'a2:b0:66:d2:f8:62',
  'authorization': '5',
  'traffic': { 'value': '65,2', 'units': 'МБ' },
  'datetime': { 'date': '14.04.20', 'time': '15:45' },
  'duration': { 'hours': '1', 'minutes': '45' }
}, {
  'number': '11 000',
  'phone': '+7 947 565 77 66',
  'mac': '22:b0:f4:a2:48:62',
  'authorization': '1',
  'traffic': { 'value': '0,5', 'units': 'ГБ' },
  'datetime': { 'date': '10.03.19', 'time': '13:56' },
  'duration': { 'hours': '2', 'minutes': '12' }
}]

export const USERS_MORE = [20, 50, 100]

export const USERS_MAX = 128
