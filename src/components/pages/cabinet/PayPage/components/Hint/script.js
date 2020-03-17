export default {
  name: 'hint',
  props: [
    'vis',
    'title',
    'description',
    'subText',
    'hasErr',
    'err',
    'buttLeftText',
    'buttRightText'
  ],
  data: () => ({
    pre: 'hint',
    styleTitle: ''
  }),
  mounted () {
    this.styleTitle = this.buttLeftText === 'Отменить' ? '' : '__one-row'
  },
  computed: {
    internalVisible: {
      get () { return this.vis },
      set (val) { this.$emit('input', val) }
    }
  },
  methods: {
    buttLeft () {
      this.$emit('buttLeft')
    },
    buttRight () {
      this.$emit('buttRight')
    },
    closeConfirm () {
      this.$emit('closeConfirm')
    }
  }
}
