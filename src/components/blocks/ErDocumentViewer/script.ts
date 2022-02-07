import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { API } from '@/functions/api'
import * as Document from '@/constants/document'
// const _mime = require('mime-types')

interface IDocumentForDownload {
  id: string | number
  bucket: string
  fileName: string
  filePath: string
  type: {
    id: string | number
    name: string
  }
}

/**
 * Просмотрщик документов
 * Подписываем именно договор!
 */

@Component<InstanceType<typeof ErDocumentViewer>>({
  props: {
    value: Boolean,
    listDocument: {
      type: Array,
      default: () => ([])
    },
    isManualSigning: Boolean,
    isDigitalSigning: Boolean
  }
})
export default class ErDocumentViewer extends Vue {
  $refs!: {
    modal: HTMLElement
  }
  $api!: API
  // Props
  readonly value!: boolean
  readonly listDocument!: IDocumentForDownload[]
  readonly isManualSigning!: boolean
  readonly isDigitalSigning!: boolean
  // Data
  listFile: Record<string, string> = {}
  currentDocument: IDocumentForDownload = this.listDocument[0]
  currentDocumentFile: string = ''
  currentType: { id: string | number, name: string, documentId: string | number } = this.computedListType[0]

  isLoading: boolean = false

  // Computed
  get computedListType () {
    return this.listDocument.map(item => ({
      ...item.type,
      documentId: item.id
    }))
  }
  get isExistsFile () {
    return !!this.currentDocumentFile
  }
  // Proxy
  get internalValue () {
    return this.value
  }
  set internalValue (val: boolean) {
    this.$emit('input', val)
  }
  // Watchers
  @Watch('internalValue')
  onInternalValueChanged (val: boolean) {
    if (val && !Object.keys(this.listFile).length) {
      this.downloadFile(this.listDocument[0])
    }
  }
  @Watch('currentType')
  async onCurrentTypeChanged (val: any) {
    if (!this.value) return
    const _document = this.listDocument.find(item => String(item.id) === String(val.documentId))!
    const changeEmbed = () => {
      const oldEmbed: HTMLEmbedElement | null = this.$refs.modal.querySelector('embed')
      if (!oldEmbed) return

      const parentNode = oldEmbed.parentNode!
      const newEmbed = document.createElement('embed')
      newEmbed.setAttribute('src', this.currentDocumentFile as string)
      parentNode.replaceChild(newEmbed, oldEmbed)
    }
    // Проверяем - загружали ли ранее документ
    if (val.documentId in this.listFile) {
      this.currentDocumentFile = this.listFile[val.documentId]
      this.currentDocument = _document
      changeEmbed()
    } else {
      const result = await this.downloadFile(_document)
      this.currentDocument = _document
      if (result !== '') {
        changeEmbed()
      }
    }
  }
  @Watch('listDocument')
  onListDocumentChange (val: IDocumentForDownload[]) {
    this.listFile = {}
    this.currentDocument = val[0]
    this.currentType = this.computedListType[0]
    this.currentDocumentFile = ''
  }
  // Methods
  downloadFile (downloadDocument: IDocumentForDownload) {
    this.isLoading = true
    return new Promise<string>(async (resolve, reject) => {
      try {
        const { filePath, bucket, fileName } = downloadDocument
        let { id } = downloadDocument
        id = String(id)

        if (!filePath || !fileName || !bucket) {
          reject('Missing Parameters')
          return
        }

        const ext = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName

        const downloadFileResult = await this.$store.dispatch(
          'fileinfo/downloadFile',
          {
            api: this.$api,
            bucket: bucket,
            key: filePath,
            ext
          })
        if (
          (typeof downloadFileResult === 'boolean' && !downloadFileResult) ||
          (downloadFileResult instanceof Blob && downloadFileResult.size === 0)
        ) {
          this.currentDocumentFile = ''
          resolve('')
        } else if (downloadFileResult instanceof Blob) {
          if (id in this.listFile) {
            resolve(this.listFile[id])
            return
          }

          const base64File = await this.__toBase64(downloadFileResult)
          Vue.set(this.listFile, id, base64File)
          this.currentDocumentFile = base64File
          resolve(base64File)
        }
      } catch (e) {
        reject(e)
      } finally {
        this.isLoading = false
      }
    })
  }
  downloadFileOnDevice () {
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = this.currentDocumentFile as string
    tempLink.setAttribute('download', this.currentDocument.fileName)
    document.body.appendChild(tempLink)
    tempLink.click()
    setTimeout(function () {
      document.body.removeChild(tempLink)
    }, 0)
  }
  __toBase64 (file: Blob) {
    // const mime = _mime.lookup(fileName)
    const reader = new FileReader()
    return new Promise<string>((resolve) => {
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = (reader.result as string)
          .replace(
            'application/octet-stream',
            'application/pdf'
          )
        resolve(result)
      }
    })
  }
  // Методы для подписания
  __signing (eventName: string) {
    let documentForSignature = this.listDocument.find(item => String(item.type.id) === Document.CONTRACT_ID)
    documentForSignature = documentForSignature || this.listDocument[0]
    // if (!this.listFile.has(String(documentForSignature.id))) {
    if (!(String(documentForSignature.id) in this.listFile)) {
      this.downloadFile(documentForSignature)
        .then(data => {
          this.$emit(eventName, {
            id: documentForSignature!.id,
            data
          })
        })
    } else {
      this.$emit(eventName, {
        id: documentForSignature!.id,
        // data: this.listFile.get(String(documentForSignature!.id))
        data: this.listFile[documentForSignature!.id]
      })
    }
  }

  /**
   * Ручное подписание
   */
  manualSigning () {
    this.internalValue = false
    this.__signing('signing:manual')
  }

  /**
   *  Подписание с помощью ЭЦП
   */
  digitalSigning () {
    this.internalValue = false
    this.__signing('signing:digital')
  }
}
