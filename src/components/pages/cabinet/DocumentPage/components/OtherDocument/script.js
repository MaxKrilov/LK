import CommonDocument from '../CommonDocument'
import * as DOCUMENT from '@/constants/document'
import DocumentMixin from '@/mixins/ErDocumentMixin'

export default {
  mixins: [DocumentMixin],
  props: {
    'document': Array
  },
  data: () => ({
    DOCUMENT
  }),
  components: {
    CommonDocument
  },
  computed: {
    documentName () {
      if (Array.isArray(this.document) && this.document.length === 1) {
        const { id: typeId, name: typeName } = this.getFirstElement.type
        return DOCUMENT.ALL_TYPES[typeId] || typeName
      }
      return 'Комплект документов'
    },
    computedModifiedWhen () {
      return this.$moment(this.getFirstElement.modifiedWhen).format('DD.MM.YY')
    },
    computedRelatedTo () {
      return this.getFirstElement.relatedTo.name
    }
  }
}
