import { isEmpty } from '@/functions/helper'
import {
  PATTERN_EMAIL,
  PATTERN_CYRILLIC_LETTERS,
  PATTERN_СYRILLIC_WITH_DASH,
  PATTERN_RUSSIAN_PHONE,
  PATTERN_NUMBERS } from '@/constants/regexp'

export default {
  methods: {
    validNotEmpty (value) {
      return value ? true : 'Поле не заполнено'
    },
    validRole (role) {
      return role ? true : 'Поле не заполнено'
    },
    validNumber (number) {
      return PATTERN_NUMBERS.test(number) && !isEmpty(number) ? true : 'Поле не заполнено'
    },
    validEmail (email) {
      if (PATTERN_EMAIL.test(email) && !isEmpty(email)) {
        return true
      } else {
        return 'Поле не заполнено'
      }
    },
    validPhone (phone) {
      if (PATTERN_NUMBERS.test(phone) && PATTERN_RUSSIAN_PHONE.test(phone) && !isEmpty(phone)) {
        return true
      } else {
        return 'Неверный формат телефонного номера'
      }
    },
    validFullName (fullName) {
      if (PATTERN_СYRILLIC_WITH_DASH.test(fullName) && !isEmpty(fullName)) {
        return true
      } else {
        return 'Поле не заполнено'
      }
    },
    validCyrillic (word) {
      return PATTERN_CYRILLIC_LETTERS.test(word) ? true : 'Допустимы только кириллические буквы'
    }
  },
  computed: {
    fullNameRule () {
      return [this.validFullName]
    },
    phoneRule () {
      return [this.validPhone]
    },
    emailRule () {
      return [this.validEmail]
    },
    roleRule () {
      return [this.validRole]
    },
    notEmptyRule () {
      return [this.validNotEmpty]
    },
    cyrillicRule () {
      return [this.validNotEmpty, this.validCyrillic]
    },
    numberRule () {
      return [this.validNumber]
    }
  }
}
