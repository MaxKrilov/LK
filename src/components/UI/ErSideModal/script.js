import ClickOutsideMixin from '@/mixins/ClickOutsideMixin'

/*
  ErSideModal
  Панель, выезжающая с указанной стороны (напр. меню слева)

  Пропсы:
    active: boolean - отображать/скрыть панель
    overlay: boolean - отображать/скрыть затемнение вокруг панели
    side: string - сторона с которой выезжает панель
      Возможные значения:
        'top' - сверху
        'left' - слева
        'right' - справа
        'bottom' - снизу
        'hell' - из Ада (не реализовано)

  Содержимое панели помещается в основной слот
  Пример использования:

  er-side-modal(:active="isShowPanel")
    my-menu-component
*/

export default {
  name: 'er-side-modal',
  props: {
    active: Boolean,
    side: {
      type: String,
      default: 'top',
      validator: value => {
        return ['top', 'left', 'right', 'bottom', 'hell'].includes(value)
      }
    },
    overlay: { // mean show overlay
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pre: 'er-side-modal'
    }
  },
  mixins: [ClickOutsideMixin],
  computed: {
    el () {
      return this.$refs.content
    },
    classObject () {
      const classMod = `${this.pre}--${this.side}`
      const classes = {
        'er-side-modal--active': this.active,
        [classMod]: true
      }
      return classes
    }
  },
  mounted () {
    this.onTransitionEnd()
  },
  methods: {
    onOpen () {
      this.$emit('open')
      this.bindClickOutside()
    },
    onClose () {
      this.$emit('close')
      this.unbindClickOutside()
    },
    onTransitionEnd () {
      if (this.active) {
        this.onOpen()
      } else {
        this.onClose()
      }
    }
  }
}
