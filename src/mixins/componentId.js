export default {
  data () {
    return {
      id: null,
      idPrefix: 'element-'
    }
  },
  mounted () {
    this.id = `${this.idPrefix}${this._uid}`
  }
}
