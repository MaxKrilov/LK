import CommonDocument from '../CommonDocument'

export default {
  props: {
    'document': Object
  },
  data () {
    return {
      selected: false
    }
  },
  components: {
    CommonDocument
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
