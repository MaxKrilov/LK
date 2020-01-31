import moment from 'moment'

export function price (val) {
  return Number.prototype.toFixed.call(parseFloat(val) || 0, 2)
    .replace(/[.]+/g, ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}

export function formatPhone (phone = '') {
  return phone
    .replace(/[^0-9]/g, '')
    .replace(/(\d{1})(\d{3})(\d{2})(\d{3})(\d{2})/, '+$1 ($2) $3 $4 $5')
}

export function formatDate (value, dateFormat) {
  return moment(value).format(dateFormat)
}
