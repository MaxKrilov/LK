export default {
  name: 'picker',
  props: {
    fullWidth: Boolean,
    headerColor: String,
    landscape: Boolean,
    noTitle: Boolean,
    width: {
      type: [Number, String],
      default: 290
    }
  },
  methods: {
    genPickerTitle () {
      return null
    },
    genPickerBody () {
      return null
    },
    genPickerActionsSlot () {
      return this.$scopedSlots.default ? this.$scopedSlots.default({
        save: this.save,
        cancel: this.cancel
      }) : this.$slots.default
    },
    genPicker (staticClass) {
      const children = []
      if (!this.noTitle) {
        const title = this.genPickerTitle()
        title && children.push(title)
      }
      const body = this.genPickerBody()
      body && children.push(body)
      children.push(this.$createElement(
        'template',
        {
          slot: 'actions'
        }, [
          this.genPickerActionsSlot()
        ]
      ))
      return this.$createElement('er-picker', {
        staticClass,
        props: {
          color: this.headerColor || this.color,
          fullWidth: this.fullWidth,
          width: this.width,
          noTitle: this.noTitle
        }
      }, children)
    }
  }
}
