export default {
  props: {
    title: {
      type: String,
      default: ' '
    },
    backlink: {
      type: [String, Location],
      default: '/'
    },
    linkText: {
      type: String,
      default: 'Назад на главную'
    }
  }
}
