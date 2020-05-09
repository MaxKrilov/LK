import T_CONST from './constants'

const ADDRESS_LIST = [
  {
    title: 'Березовский Г, Свердловская Обл, Ленинский П. 26 / а',
    type: 'SIP'
  },
  {
    title: 'г.Екатеринбургск, бул. Павлика Отмороженного, д.666, кв.9',
    type: 'not SIP'
  }
]

const PHONE_LIST = [
  {
    id: '1001',
    from: '+7 (342) 241 54 02',
    to: '+7 912 0608 034',
    status: T_CONST.S_ADDED,
    period: ''
  },
  {
    id: '1002',
    from: '+7 (342) 241 54 02',
    to: '+7 912 0608 034',
    status: T_CONST.S_UNAVAILABLE,
    period: 'Вт, Ср, Чт, Пт, Сб, Вс'
  },
  {
    id: '1003',
    from: '+7 (342) 241 54 02',
    to: '+7 922 0000 000',
    status: T_CONST.S_NO_RESPONSE,
    period: 'Пн'
  },
  {
    id: '1004',
    from: '+7 (342) 241 54 02',
    to: '+1 212 5450 000',
    status: T_CONST.S_UNAVAILABLE,
    period: 'Вт'
  },
  {
    id: '1005',
    from: '+7 (342) 241 54 02',
    to: '+7 912 0608 034',
    status: T_CONST.S_ABSOLUTELY,
    period: 'Сб, Вс'
  }
]

export default {
  ADDRESS_LIST,
  PHONE_LIST
}
