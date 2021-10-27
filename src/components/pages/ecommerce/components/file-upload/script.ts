import Vue from 'vue'
import Component from 'vue-class-component'

@Component<InstanceType<typeof ECommerceFileUpload>>({
  props: {
    id: String,
    isLoaded: Boolean,
    labelText: {
      type: String,
      default: 'Перетащите подписанный документ в эту область или выберите на компьютере'
    },
    value: File
  }
})
export default class ECommerceFileUpload extends Vue {
  // Options
  $refs!: Vue & {
    'ecommerce-file-upload': HTMLFormElement,
    'file-input': HTMLInputElement
  }
  // Props
  readonly id!: string
  readonly isLoaded!: boolean
  readonly labelText!: string
  readonly value!: File

  // Data
  isError: boolean = false
  errorText: string = ''

  // Computed
  get computedID () {
    return this.id || `e-commerce-file-upload__${this._uid}`
  }

  get determineDragAndDropCapable () {
    const div = document.createElement('div')

    return (('draggable' in div) ||
      ('ondragstart' in div && 'ondrop' in div)) &&
      'FormData' in window &&
      'FileReader' in window
  }

  onValidate (file: File) {
    if (file.size >= 2 * 1024 * 1024) {
      this.isError = true
      this.errorText = 'Размер файла не должен превышать 2 Мб'

      return false
    }

    this.isError = false
    return true
  }

  onChange (e: InputEvent) {
    if (
      !this.isLoaded &&
      e.target &&
      (e.target as HTMLInputElement).files != null &&
      (e.target as HTMLInputElement).files!.length > 0 &&
      (this.onValidate((e.target as HTMLInputElement).files![0]))) {
      this.$emit('input', (e.target as HTMLInputElement).files![0])
      this.$refs['file-input'].value = ''
    }
  }

  addListeners () {
    if (!this.determineDragAndDropCapable) return

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(evt => {
      this.$refs['ecommerce-file-upload'].addEventListener(evt, (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
      })
    });

    ['dragenter', 'dragover'].forEach(evt => {
      this.$refs['ecommerce-file-upload'].addEventListener(evt, () => {
        !this.isLoaded && this.$refs['ecommerce-file-upload'].classList.add('is-dragover')
      })
    });

    ['dragleave', 'dragend', 'drop'].forEach(evt => {
      this.$refs['ecommerce-file-upload'].addEventListener(evt, () => {
        !this.isLoaded && this.$refs['ecommerce-file-upload'].classList.remove('is-dragover')
      })
    })

    this.$refs['ecommerce-file-upload'].addEventListener('drop', (e: DragEvent) => {
      if (
        !this.isLoaded &&
        e.dataTransfer &&
        e.dataTransfer.files.length > 0 &&
        this.onValidate(e.dataTransfer.files[0])
      ) {
        this.$emit('input', e.dataTransfer.files[0])
      }
    })
  }

  mounted () {
    this.addListeners()
  }
}
