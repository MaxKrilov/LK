export default {
  name: 'right-info-panel-component',
  data: () => ({
    pre: 'right-info-panel-component',
    isOpenPersonalAccountDetail: false
  }),
  props: {
    value: null
  },
  methods: {
    closeRightPanel () {
      this.$emit('input', false)
    },
    openPersonalAccountDetail () {
      this.isOpenPersonalAccountDetail = true
    },
    selectPersonalAccount () {
      // todo Реализовать логику
      this.isOpenPersonalAccountDetail = false
    }
  }
}
