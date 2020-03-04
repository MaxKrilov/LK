import CommonDocument from '../CommonDocument'
import * as DOCUMENT from '@/constants/document'
import DocumentMixin from '@/mixins/ErDocumentMixin'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index'
import { DOWNLOAD_FILE } from '../../../../../../store/actions/documents'

export default {
  mixins: [DocumentMixin],
  props: {
    document: {
      type: Object
    }
  },
  data: () => ({
    ...DOCUMENT,
    isOpenViewer: false
  }),
  components: {
    CommonDocument,
    ErDocumentViewer
  },
  methods: {
    async manualSigning (e) {
      if (!e) {
        e = await this.$store.dispatch(`documents/${DOWNLOAD_FILE}`, {
          vm: this,
          bucket: this.document.bucket,
          key: this.document.filePath
        })
      }
      this.$emit('signing:manual', { link: e, ...this.document })
    },
    async digitalSigning (e) {
      if (!e) {
        e = await this.$store.dispatch(`documents/${DOWNLOAD_FILE}`, {
          vm: this,
          bucket: this.document.bucket,
          key: this.document.filePath
        })
      }
      this.$emit('signing:digital', { link: e, ...this.document })
    }
  }
}
