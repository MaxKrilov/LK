import CommonDocument from '../CommonDocument'
import ErDocumentViewer from '../../../../../blocks/ErDocumentViewer'
import { TYPE_REPORT } from '@/constants/document'

export default {
  props: {
    'document': Object
  },
  data () {
    return {
      selected: false,
      isOpenViewer: false
    }
  },
  filters: {
    typeName: val => {
      return TYPE_REPORT.find(item => item.id === val)?.value || 'Неизвестный документ'
    }
  },
  components: {
    CommonDocument,
    ErDocumentViewer
  },
  computed: {
    documentForViewer () {
      return [{
        id: this.document.id,
        bucket: this.document.bucket,
        fileName: this.document.fileName,
        filePath: this.document.filePath,
        type: {
          id: this.document.type.id,
          name: this.document.type.name
        }
      }]
    }
  },
  methods: {
    onSelect (val) {
      if (val) {
        this.$emit('select', this.document.number)
      } else {
        this.$emit('unselect', this.document.number)
      }
    }
  }
}
