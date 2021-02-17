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
