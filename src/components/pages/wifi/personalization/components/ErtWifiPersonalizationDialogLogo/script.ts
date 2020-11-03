import Vue from 'vue'
import Component from 'vue-class-component'

const MAX_SIZE_BYTES = 300 * 1024

@Component<InstanceType<typeof ErtWifiPersonalizationDialogLogo>>({
  filters: {
    fileName: (str: string) => str ? str.replace(/^.*[\\/]/, '') : str
  },
  props: {
    value: Boolean,
    image: [String, Boolean]
  },
  watch: {
    value (val) {
      this.lazyValue = val
      val && this.$nextTick(() => {
        this.addListeners()
      })
    },
    image (val) {
      this.lazyImage = val
    }
  }
})
export default class ErtWifiPersonalizationDialogLogo extends Vue {
  // Options
  $refs!: {
    'upload-file-form': HTMLElement
    'file-input': HTMLInputElement
  }

  // Props
  readonly value!: boolean
  readonly image!: string

  // Data
  lazyValue: boolean = this.value
  lazyImage: string = this.image
  logo: File | null = null
  logoBase64: string = ''
  dragAndDropCapable: boolean = false
  errorText: string = ''
  isDoneAction: boolean = false

  // Computed
  get internalValue () {
    return this.lazyValue
  }
  set internalValue (val: boolean) {
    this.lazyValue = val

    this.$emit('input', val)
  }
  get computedId () {
    return `ert-wifi-personalization-dialog-logo__${this._uid}`
  }
  get issetServerImage () {
    return !!this.lazyImage
  }
  get srcServerImage () {
    return this.lazyImage ? this.lazyImage : null
  }
  get isDisabledSaveButton () {
    return !(
      (this.image && !this.lazyImage) || // Удалили изображение, которое было установлено ранее и сохранено
      (this.logo !== null)
    )
  }

  // Methods
  closeDialog () {
    this.isDoneAction = false
    this.internalValue = false
  }
  onChange (e: InputEvent) {
    if (
      e.target &&
      (e.target as HTMLInputElement).files !== null &&
      (e.target as HTMLInputElement).files!.length > 0) {
      this.assignmentLogo((e.target as HTMLInputElement).files![0])
        .catch(error => {
          this.errorText = error
        })
    }
  }
  determineDragAndDropCapable () {
    const div = document.createElement('div')

    return (('draggable' in div) ||
      ('ondragstart' in div && 'ondrop' in div)) &&
      'FormData' in window &&
      'FileReader' in window
  }
  addListeners () {
    this.dragAndDropCapable = this.determineDragAndDropCapable()

    if (this.dragAndDropCapable) {
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(evt => {
        this.$refs['upload-file-form'].addEventListener(evt, (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
        })
      })
      this.$refs['upload-file-form'].addEventListener('drop', (e: DragEvent) => {
        this.assignmentLogo(e.dataTransfer!.files[0])
          .catch(error => {
            this.errorText = error
          })
      })
    }
  }
  assignmentLogo (file: File) {
    return new Promise((resolve, reject) => {
      if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
        reject('Неверный формат файла')
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          // Необходимо проверить ширину и высоту
          const img = new Image()
          img.src = reader.result

          if (file.size > MAX_SIZE_BYTES) {
            reject('Максимальный размер изображения 300 Кб')
            return
          }

          img.addEventListener('load', () => {
            if (img.width > 300 || img.height > 300) {
              reject('Максимальное разрешение логотипа 300x300 пикселей')
            } else {
              this.logo = file
              this.logoBase64 = reader.result as string

              this.errorText = ''
              this.isDoneAction = true
              resolve()
            }
          })
        }
      })
    })
  }
  removeFile () {
    if (this.issetServerImage) {
      this.lazyImage = ''
    } else {
      this.logo = null
      this.logoBase64 = ''
      this.$refs['file-input'].value = ''
    }
    this.isDoneAction = true
  }
  cancel () {
    if (this.image) {
      this.lazyImage = this.image
    } else {
      this.logo = null
      this.logoBase64 = ''
      this.$refs['file-input'].value = ''
    }
    this.closeDialog()
  }
  save () {
    this.$emit('change', {
      file: this.logo || false,
      base64: this.logoBase64 || false
    })
    this.closeDialog()
  }

  // Hooks
  mounted () {
    this.$refs['upload-file-form'] && this.addListeners()
  }
}
