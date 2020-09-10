import Vue from 'vue'
import Component from 'vue-class-component'

const props = {
  returnValue: { required: false }
}

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof ErtReturnableMixin>>({
  props,
  watch: {
    isActive (val) {
      if (val) {
        this.originalValue = this.returnValue
      } else {
        this.$emit('update:return-value', this.originalValue)
      }
    }
  }
})
export default class ErtReturnableMixin extends Vue {
  // Props
  readonly returnValue!: any

  // Data
  isActive: boolean = false
  originalValue: any = null

  // Methods
  save (value: any) {
    this.originalValue = value
    setTimeout(() => {
      this.isActive = false
    })
  }
}
