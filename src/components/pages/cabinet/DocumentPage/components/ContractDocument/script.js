import CommonDocument from '../CommonDocument'
import * as DOCUMENT from '@/constants/document'
import DocumentMixin from '@/mixins/ErDocumentMixin'

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
    CommonDocument
  }
}
