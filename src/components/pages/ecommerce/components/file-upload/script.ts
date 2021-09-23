import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    id: String,
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
    'ecommerce-file-upload': HTMLFormElement
  }
  // Props
  readonly id!: string
  readonly labelText!: string
  readonly value!: File

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

  onChange (e: InputEvent) {
    if (
      e.target &&
      (e.target as HTMLInputElement).files != null &&
      (e.target as HTMLInputElement).files!.length > 0) {
      this.$emit('input', (e.target as HTMLInputElement).files![0])
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
        this.$refs['ecommerce-file-upload'].classList.add('is-dragover')
      })
    });

    ['dragleave', 'dragend', 'drop'].forEach(evt => {
      this.$refs['ecommerce-file-upload'].addEventListener(evt, () => {
        this.$refs['ecommerce-file-upload'].classList.remove('is-dragover')
      })
    })

    this.$refs['ecommerce-file-upload'].addEventListener('drop', (e: DragEvent) => {
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        this.$emit('input', e.dataTransfer.files[0])
      }
    })
  }

  mounted () {
    this.addListeners()
  }
}
