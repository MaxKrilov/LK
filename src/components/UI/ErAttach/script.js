export default {
  props: {
    url: { type: String }
  },
  computed: {
    filename () {
      return this.url.split('/').pop()
    }
  }
}
