import './_style.scss'

export default {
  name: 'er-button',
  data: () => ({
    pre: 'er-button'
  }),
  props: {
    /**
     * Цвет кнопки. Доступные значения - yellow, blue, green, gray.
     */
    color: {
      type: String,
      default: 'red',
      validator: value => ['blue', 'green', 'gray', 'red'].includes(value)
    },
    /**
     * Отключение кнопки
     */
    disabled: Boolean,
    /**
     * Удаляет цвет фона кнопки
     */
    flat: Boolean,
    /**
     * Анимация иконки загрузки
     */
    loading: Boolean,
    /**
     * Используемый тег
     */
    tag: {
      type: String,
      default: 'button'
    },
    /**
     * Тег компонента router-link
     */
    to: String | Location,
    /**
     * Иконка перед текстом
     */
    preIcon: String,
    /**
     * Иконка после текста
     */
    appendIcon: String,
    /**
     * Тип кнопки
     */
    type: {
      type: String,
      default: 'button',
      validator: value => ['button', 'reset', 'submit'].includes(value)
    }
  },
  computed: {
    classes () {
      return {
        [`${this.pre}--${this.color}`]: true,
        [`${this.pre}--disabled`]: this.disabled || this.loading,
        [`${this.pre}--flat`]: this.flat,
        [`${this.pre}--loading`]: this.loading
      }
    }
  },
  methods: {
    genIcon (name, type) {
      /* Ренедерим блок в любом случае для корректной отцентровки текста кнопки */
      return this.$createElement('div', {
        staticClass: 'er-button__icon',
        class: `er-button__icon--${type}`
      }, name ? [ this.$createElement('er-icon', { props: { name } }) ] : '')
    },
    onClick (e) {
      this.$emit('click', e)
    }
  },
  render (h) {
    return h(this.to ? 'router-link' : this.tag, {
      staticClass: this.pre,
      class: this.classes,
      attrs: {
        disabled: this.disabled || this.loading,
        type: this.type,
        ...this.$attrs
      },
      props: {
        to: this.to
      },
      directives: [{
        name: 'ripple',
        value: { class: 'color--shades-white' }
      }],
      on: { click: this.onClick }
    }, [
      h('span', {
        staticClass: `${this.pre}__content`
      }, [
        this.preIcon && this.genIcon(this.preIcon, 'prev'),
        h('span', {
          staticClass: `${this.pre}__slot-content`
        }, [
          this.$slots.default
        ]),
        this.appendIcon && this.genIcon(this.appendIcon, 'append')
      ]),
      this.loading && h('div', {
        staticClass: `${this.pre}__loading`
      }, [
        h('er-progress-circular', {
          props: {
            indeterminate: true,
            width: 2
          }
        })
      ])
    ])
  }
}
