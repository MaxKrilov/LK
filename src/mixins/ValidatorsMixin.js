import { isEmpty } from '@/functions/helper'
import {
  PATTERN_EMAIL,
  PATTERN_CYRILLIC_LETTERS,
  PATTERN_NOT_LETTERS,
  PATTERN_RUSSIAN_PHONE,
  PATTERN_NUMBERS } from '@/constants/regexp'

export default {
  methods: {
    validRole (role) {
      return !isEmpty(role) ? true : 'Поле не заполнено'
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
        return 'Поле не заполнено'
      }
    },
    validFullName (fullName) {
      if ((PATTERN_NOT_LETTERS.test(fullName) || PATTERN_CYRILLIC_LETTERS.test(fullName)) && !isEmpty(fullName)) {
        return true
      } else {
        return 'Поле не заполнено'
      }
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
    }
  }
}
