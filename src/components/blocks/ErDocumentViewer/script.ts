import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DOWNLOAD_FILE } from '@/store/actions/documents'
import File from '@/functions/file'

@Component
export default class ErDocumentViewer extends Vue {
  @Prop(Boolean) readonly value!: boolean
  @Prop(String) readonly bucket!: string
  @Prop(String) readonly fileName!: string
  @Prop(String) readonly filePath!: string
  /**
   * Возможность подписать документ вручную
   */
  @Prop(Boolean) readonly isManualSigning!: boolean
  /**
   * Возможность подписать документ с помощью ЭЦП
   */
  @Prop(Boolean) readonly isDigitalSigning!: boolean

  link: string = ''

  get internalValue (): boolean {
    return this.value
  }

  set internalValue (val: boolean) {
    this.$emit('input', val)
  }

  get computedLink (): string | undefined {
    return this.link !== '' ? `https://docs.google.com/viewer?url=${this.link}&embedded=true` : undefined
  }

  @Watch('internalValue')
  onInternalValueChange (val: boolean) {
    val && this.link === '' && this.downloadFileFromStorage()
  }

  async downloadFileFromStorage () {
    this.link = await this.$store.dispatch(`documents/${DOWNLOAD_FILE}`, {
      vm: this,
      bucket: this.bucket,
      key: this.filePath
    })
  }

  downloadFile () {
    File.downloadFileByURL(this.link, this.fileName)
  }

  /**
   * Ручное подписание
   */
  manualSigning () {
    this.internalValue = false
    this.$emit('signing:manual', this.link)
  }

  /**
   *  Подписание с помощью ЭЦП
   */
  digitalSigning () {
    this.internalValue = false
    this.$emit('signing:digital', this.link)
  }
}
