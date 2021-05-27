// import { IBundle } from '@/interfaces/bundle'

export function getServicePageLink (productName: string) {
  // TODO: дополнить список сервисов
  const productLinks = {
    'Интернет': '/lk/internet',
    'Wi-Fi': '/lk/wifi',
    'Телефони': '/lk/telephony',
    'Форпост': '/lk/videocontrol/forpost/',
    'ТВ': '/lk/tv',
    'ОАТС': '/lk/oats'
  }

  return Object.entries(productLinks)
    .find((el) => productName.match(el[0]))?.[1] || ''
}

export function getIconNameByCode (code: string): string {
  code = code.toLowerCase()
  if (~code.indexOf('интернет')) {
    return 'internet'
  }
  if ((~code.indexOf('облач') && ~code.indexOf('телефон')) || ~code.indexOf('оатс')) {
    return 'cloud_telephone'
  }
  if (~code.indexOf('телефон')) {
    return 'telephone'
  }
  if (~code.indexOf('wifi') || ~code.indexOf('wi-fi')) {
    return 'wifi'
  }
  if (~code.indexOf('тв')) {
    return 'tv'
  }
  if (~code.indexOf('видео') || ~code.indexOf('форпост') || ~code.indexOf('ivideon')) {
    return 'watch_right'
  }

  return 'question'
}
