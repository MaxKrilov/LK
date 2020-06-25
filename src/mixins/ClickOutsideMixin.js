/*
  Вспомогательные методы для отслеживания клика за пределами элемента

  Как использовать:

  1) добавить миксин к своему компоненту

    Пример:

    import ClickOutsideMixin from '@/mixins/ClickOutsideMixin'

    export default {
      mixins: [ClickOutsideMixin],
    }

  2) добавить вычисляемое свойство 'el', которое будет указывать
    на основной DOM-элемент вашего компонента (клики мимо этого элемента будут отслеживаться)

    Пример:
    export default {
      computed: {
        el () {
          return this.$refs.content
        }
      }
    }

  3.1) Выполнить метод bindClickOutside() когда требуется отслеживать клики вне компонента
  3.2) Выполнить метод unbindClickOutside() когда не требуется отслеживать клики вне компонента

  4) отслеживать событие @click-outside на вашем компоненте и вызывать нужный метод

    Пример:
    <template>
      <my-component @click-outside="hideMyComponent()" />
    </template>

  Пример использования:

  // Компонент меню
  import ClickOutsideMixin from '@/mixins/ClickOutsideMixin'

  export default {
    mixins: [ClickOutsideMixin],
    methods: {
      onOpenMenu () {
        // При открытии меню, отслеживаем клик вне меню
        this.bindClickOutside()
      },
      onCloseMenu () {
        // При закрытии меню перестаём отслеживать клик вне меню
        this.unbindClickOutside()
      }
    }
  }

  В шаблоне:

  my-menu(@click-outside="closeMyMenu")

*/

export default {
  methods: {
    stopProp (event) {
      event.stopPropagation()
    },
    bindClickOutside () {
      this.el.addEventListener('click', this.stopProp)
      document.body.addEventListener('click', this.onClickOutside)
    },
    unbindClickOutside () {
      this.el.removeEventListener('click', this.stopProp)
      document.body.removeEventListener('click', this.onClickOutside)
    },
    onClickOutside () {
      this.$emit('click-outside')
    }
  }
}
