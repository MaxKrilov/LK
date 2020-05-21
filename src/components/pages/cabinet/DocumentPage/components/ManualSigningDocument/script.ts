import Vue from 'vue'
import Component from 'vue-class-component'
import { ATTACH_SIGNED_DOCUMENT, UPLOAD_FILE } from '@/store/actions/documents'
import { API } from '@/functions/api'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import moment from 'moment'

@Component({
  components: {
    ErActivationModal
  },
  props: {
    value: Boolean,
    data: String,
    filename: String,
    relatedTo: String,
    type: String,
    id: String
  }
})
export default class ManualSigningDocument extends Vue {
  $api!: API
  $refs!: {
    // eslint-disable-next-line camelcase
    input_file: HTMLInputElement
  }
  readonly value!: boolean
  readonly data!: string
  readonly filename!: string
  readonly relatedTo!: string
  readonly type!: string
  readonly id!: string
  readonly filePath!: string

  file: File | null | undefined = null
  inProgress: boolean = false
  isSuccess: boolean = false
  isError: boolean = false
  errorText: string = ''

  get internalValue () {
    return this.value
  }
  set internalValue (val: boolean) {
    this.$emit('input', val)
  }
  get fileSize () {
    if (!this.file) return 0
    const size = this.file.size
    if (size < 1024) return `${size} б.`
    if (size > 1024 && size < 1048576) return `${(size / 1024).toFixed(1)} Кб.`
    return `${(size / 1048576).toFixed(1)} Мб.`
  }

  downloadFile () {
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = this.data
    tempLink.setAttribute('download', this.filename)
    document.body.appendChild(tempLink)
    tempLink.click()
    setTimeout(function () {
      document.body.removeChild(tempLink)
    }, 0)
  }

  addDocument (e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || (file && file.size > 2 * 1024 * 1024)) return
    this.file = file
  }

  resetDocument () {
    this.file = null
    this.$refs.input_file && (this.$refs.input_file.value = '')
  }

  successHandler () {
    this.internalValue = false
    this.isSuccess = true
    this.resetDocument()
    this.$emit('success')
  }

  errorHandler () {
    this.internalValue = false
    this.inProgress = false
    this.isError = true
    this.resetDocument()
  }

  tryAgain () {
    this.isError = false
    this.internalValue = true
  }

  sendingDocumentForVerification () {
    const _fileName = `${Number(new Date())}_${this.filename}`
    const _filePath = `${moment().format('MMYYYY')}/${this.id}`
    this.inProgress = true
    // Отправляем файл в хранилище
    this.$store.dispatch(`documents/${UPLOAD_FILE}`, {
      api: this.$api,
      bucket: 'customer-docs',
      fileName: _fileName,
      file: this.file,
      filePath: _filePath
    })
      .then((response: boolean) => {
        if (!response) {
          this.errorHandler()
          return false
        }
        // Создаём связку в системе
        this.$store.dispatch(`documents/${ATTACH_SIGNED_DOCUMENT}`, {
          api: this.$api,
          fileName: _fileName,
          relatedTo: this.relatedTo,
          type: this.type,
          filePath: _filePath
        })
          // Меняем статус
          .then(() => {
            this.$store.dispatch(`fileinfo/changeContractStatus`, {
              api: this.$api,
              contractId: this.relatedTo,
              status: 1
            })
              .then((result: any) => {
                if (!result || !result.submit_statuses) {
                  this.errorHandler()
                  return false
                }
                if (['success', 'not_executed'].includes(result.submit_statuses[0].submitStatus.toLowerCase())) {
                  this.successHandler()
                  this.inProgress = false
                } else {
                  this.errorText = result.submit_statuses[0].submitError
                  this.errorHandler()
                }
              })
          })
      })
  }
}
