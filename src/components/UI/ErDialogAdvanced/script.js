import ClickOutsideMixin from '@/mixins/ClickOutsideMixin'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'ok'
    },
    contentClass: String
  },
  mixins: [ClickOutsideMixin],
  computed: {
    el () {
      return this.$refs.content
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
