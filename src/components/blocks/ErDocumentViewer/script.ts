import { Vue, Component, Prop } from 'vue-property-decorator'
import { downloadFileByLink } from '@/utils/download'

@Component
export default class ErDocumentViewer extends Vue {
  @Prop({
    type: String,
    required: true
  }) readonly linkToDocument!: string
  @Prop({
    type: Boolean
  }) readonly value!: boolean

  get internalValue (): boolean {
    return this.value
  }

  set internalValue (val: boolean) {
    this.$emit('input', val)
  }

  get computedLinkToDocument () {
    // todo После реализации хранилища посмотреть, как будет работать
    return `https://docs.google.com/viewer?url=${this.linkToDocument}&embedded=true`
  }

  downloadFile () {
    downloadFileByLink(this.linkToDocument)
  }
}
