// Компонент используется как обёртка над полями ввода
// Не использовать напрямую!
import './_style.scss'
import { isEmpty } from '../../../functions/helper'
import ErValidate from '@/mixins/ErValidate'

export default {
  name: 'er-input',
  mixins: [ ErValidate ],
  data: () => ({
    m_pre: 'er-input'
  }),
  props: {
    prependOuterIcon: String,
    appendOuterIcon: String,
    prependInnerIcon: String,
    appendInnerIcon: String
  },
  computed: {
    classes () {},
    classesInput () {
      return {
        ...this.classes
      }
    }
  },
  methods: {
    generateIcon (name) {
      return this.$createElement('er-icon', { props: { name } })
    },
    generateSlot (type, location, slot) {
      if (isEmpty(slot)) {
        return null
      }
      const ref = `${location}-${type}`
      return this.$createElement('div', {
        staticClass: `${this.m_pre}__${ref}`,
        on: {
          click (e) {
            e.preventDefault()
            e.stopPropagation()
            this.$emit(`click:${ref}`, e)
          }
        },
        ref
      }, slot)
    },
    generatePrependOuter () {
      const slot = []
      if (this.$slots['prepend-outer']) {
        slot.push(this.$slots['prepend-outer'])
      } else if (this.prependOuterIcon) {
        slot.push(this.generateIcon(this.prependOuterIcon))
      }
      return this.generateSlot('outer', 'prepend', slot)
    },
    generateAppendOuter () {
      const slot = []
      if (this.$slots['append-outer']) {
        slot.push(this.$slots['append-outer'])
      } else if (this.appendOuterIcon) {
        slot.push(this.generateIcon(this.appendOuterIcon))
      }
      return this.generateSlot('outer', 'append', slot)
    },
    generateControl () {
      return this.$createElement('div', {
        staticClass: `${this.m_pre}__control`,
        on: {
          click: this.$listeners?.click || (() => {})
        }
      }, [
        this.generateRootSlot(),
        this.generateMessages()
      ])
    },
    generateRootSlot () {
      return this.$createElement('div', {
        staticClass: `${this.m_pre}__slot`,
        on: {
          click: this.onClick,
          mousedown: this.onMouseDown
        },
        ref: 'input-slot'
      }, [
        this.generateDefaultSlot()
      ])
    },
    generateMessages () {
      return this.$createElement('er-message', { props: { value: this.messages } })
    },
    // Must be override
    generateDefaultSlot () {
      throw new Error('Метод должен быть переопределён')
    },
    onClick (e) {},
    onMouseDown (e) {}
  },
  render (h) {
    return h('div', {
      staticClass: `${this.m_pre}`,
      class: this.classesInput
    }, [
      this.generatePrependOuter(),
      this.generateControl(),
      this.generateAppendOuter()
    ])
  }
}
