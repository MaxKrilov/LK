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
