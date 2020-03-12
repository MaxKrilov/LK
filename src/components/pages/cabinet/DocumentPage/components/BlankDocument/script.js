import CommonDocument from '../CommonDocument'
import DocumentMixin from '@/mixins/ErDocumentMixin'

export default {
  props: {
    document: Object
  },
  computed: {
    computedDocumentNumber () {
      return this.getFirstElement.number
    }
  },
  components: {
    CommonDocument,
    DocumentMixin
  }
}
