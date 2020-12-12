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

export function leadingZero (val, size) {
  /*
    Добавляет "лидирующие" нули в начало числа, добивая число до size

    Пример:

    leadingZero(1) === '01' // по-умолчанию size=2
    leadingZero(14, 3) === '014'

    leadingZero(44, 5) === '00044'
  */

  size = size || 2

  let newVal = `${val}`

  while (newVal.length < size) {
    newVal = `0${newVal}`
  }

  return newVal
}

export function formatDate (value, dateFormat) {
  return moment(value).format(dateFormat)
}

export function cutText (text, charCount) {
  /*
    Отрезает часть строки начиная с позиции символа charCount
    Если было что отрезать, то добавляется многоточие

    Пример:

    -- в коде --
    let description = 'Пройдите анкету и вы получите шанс учавствовать в розыгрыше'

    -- в шаблоне --
    {{ description|cutText(15) }}

    -- результат --
    Пройдите анкету...

  */
  let newText = text
  if (text.length > charCount) {
    newText = text.slice(0, charCount)

    if (text.slice(charCount).length) {
      newText = `${newText}...`
    }
  }

  return newText
}

export function fileName (str) {
  return str.replace(/^.*[\\/]/, '')
}
