interface IAnalyticItem {
  title: string
  iconName: string
  cover: string
  thumb: string
}

const ITEMS: Record<string, IAnalyticItem> = {
  VIDCPSEC: {
    title: 'Пакет безопасности «Security»',
    iconName: 'security',
    cover: 'security.jpg',
    thumb: 'security__thumb.jpg'
  },
  VIDCPSECP: {
    title: 'Пакет безопасности «Security+»',
    iconName: 'security_plus',
    cover: 'security_plus.jpg',
    thumb: 'security_plus__thumb.jpg'
  },
  VIDCSTAFF: {
    title: 'Активность персонала',
    iconName: 'manager',
    cover: 'staff_activity.jpg',
    thumb: 'staff_activity__thumb.jpg'
  },
  VIDCCOUNT: {
    title: 'Подсчёт посетителей',
    iconName: 'mans',
    cover: 'visits_count.jpg',
    thumb: 'visits_count__thumb.jpg'
  },
  VIDCMAP: {
    title: 'Тепловая карта',
    iconName: 'heat_map',
    cover: 'heat_map.jpg',
    thumb: 'heat_map__thumb.jpg'
  },
  VIDCCAR: {
    title: 'Распознавание номеров',
    iconName: 'car',
    cover: 'guess_car_number.jpg',
    thumb: 'guess_car_number__thumb.jpg'
  },
  VIDCBARR: {
    title: 'Умный шлагбаум',
    iconName: 'barrier',
    cover: 'smart_barrier.jpg',
    thumb: 'smart_barrier__thumb.jpg'
  },
  VIDCSEGM: {
    title: 'Сегментация клиента',
    iconName: 'face_detect',
    cover: 'face_detect.jpg',
    thumb: 'face_detect__thumb.jpg'
  }
}

export default ITEMS
