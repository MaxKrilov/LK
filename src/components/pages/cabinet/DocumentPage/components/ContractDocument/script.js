import CommonDocument from '../CommonDocument'
import * as DOCUMENT from '@/constants/document'
import DocumentMixin from '@/mixins/ErDocumentMixin'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index'

export default {
  mixins: [DocumentMixin],
  props: {
    document: {
      type: Object
    }
  },
  data: () => ({
    DOCUMENT
  }),
  components: {
    CommonDocument,
    ErDocumentViewer
  },
  methods: {
    signWithDigitalSignature () {
      this.$emit('sign', document.fileName)
    }
  }
}
