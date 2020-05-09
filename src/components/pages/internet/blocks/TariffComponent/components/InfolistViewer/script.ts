import Vue from 'vue'
import Component from 'vue-class-component'
const _mime = require('mime-types')

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof InfolistViewer>>({
  props: {
    id: String,
    value: Boolean
  },
  watch: {
    internalValue (val) {
      if (val && !this.isExistsFile) {
        this.downloadDocument()
      }
    }
  }
})
export default class InfolistViewer extends Vue {
  // Props
  readonly id!: string
  readonly value!: boolean

  // Data
  file: string = ''
  fileName = 'Информационный лист Интернет.pdf'
  isLoading = false

  // Computed
  get isExistsFile () {
    return !!this.file
  }

  // Proxy
  get internalValue () {
    return this.value
  }
  set internalValue (val: boolean) {
    this.$emit('input', val)
  }

  // Methods
  __toBase64 (file: Blob, fileName: string) {
    const mime = _mime.lookup(fileName)
    const reader = new FileReader()
    return new Promise<string>((resolve) => {
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = (reader.result as string)
          .replace(
            'application/octet-stream',
            mime
          )
        resolve(result)
      }
    })
  }

  downloadDocument () {
    this.isLoading = true
    this.$store.dispatch('productnservices/productInfoList', {
      api: this.$api,
      id: this.id
    })
      .then(response => {
        if (response instanceof Blob) {
          this.__toBase64(response, this.fileName)
            .then(resultBase64 => {
              this.file = resultBase64
            })
        }
      })
      .finally(() => {
        this.isLoading = false
      })
  }

  downloadFileOnDevice () {
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = this.file as string
    tempLink.setAttribute('download', this.fileName)
    document.body.appendChild(tempLink)
    tempLink.click()
    setTimeout(function () {
      document.body.removeChild(tempLink)
    }, 0)
  }
}
