import ErSlideUpDown from '@/components/UI/ErSlideUpDown'

export default {
  props: {
    title: String,
    items: Array
  },
  components: {
    ErSlideUpDown
  },
  data () {
    return {
      isExpanded: false
    }
  },
  methods: {
    onClickExpander () {
      this.$set(this, 'isExpanded', !this.isExpanded)
    }
  }
}
