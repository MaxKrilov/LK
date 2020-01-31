import { inject as RegistrableInject } from './ErRegistrable'
import { eachArray, isEmpty } from '../functions/helper'

/**
 * Миксин для валидации полей формы
 */
export default {
  data: () => ({
    messages: []
  }),
  mixins: [ RegistrableInject('form') ],
  props: {
    rules: {
      type: Array,
      default: () => ([])
    },
    value: {
      type: null
    }
  },
  computed: {
    hasErrors () {
      return !isEmpty(this.messages)
    }
  },
  methods: {
    validate () {
      this.messages = []
      eachArray(this.rules, rule => {
        const result = rule(this.value)
        if (typeof result === 'string') {
          this.messages.push(result)
        } else if (typeof result !== 'boolean') {
          console.error('Правило должно возвращать строку или логическое значение')
        }
      })
      return isEmpty(this.messages)
    }
  },
  created () {
    this.form && this.form.register(this)
  },
  beforeDestroy () {
    this.form && this.form.unregister(this)
  }
}
