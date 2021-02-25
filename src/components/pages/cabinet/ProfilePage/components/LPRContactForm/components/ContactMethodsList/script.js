import ErActivationModal from '../../../../../../../blocks/ErActivationModal/index.vue'

export default {
  name: 'contact-methods-list',
  components: {
    ErActivationModal
  },
  data: () => ({
    pre: 'contact-methods-list',
    isShowModal: false
  }),
  props: {
    item: { type: Object },
    prefer: {
      type: String,
      default: null
    }
  },
  computed: {
    isPrefer () {
      return this.prefer === this.item.id
    }
  },
  methods: {
    onRemove () {
      if (this.isPrefer) {
        this.isShowModal = true
      } else {
        this.$emit('onRemove')
      }
    },
    onPrefer (id) {
      this.$emit('onPrefer', id)
    }
  }
}
