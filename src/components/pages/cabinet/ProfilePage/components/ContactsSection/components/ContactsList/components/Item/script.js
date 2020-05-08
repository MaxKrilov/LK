import ResponsiveMixin from '@/mixins/ResponsiveMixin'

export default {
  name: 'contacts-list-item',
  mixins: [ResponsiveMixin],
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    dataKey: {
      type: String,
      default: null
    },
    expandedId: {
      type: String,
      default: null
    }
  },
  data: () => ({
    pre: 'contacts-list-item'
  }),
  computed: {
    isMobile () {
      return this.isXS || this.isSM
    }
  }
}
