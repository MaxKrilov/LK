export default {
  name: 'error-input',
  props: {
    errorMessage: {
      type: String,
      default: 'Ошибка'
    }
  },
  data () {
    return {
      pre: 'error-input'
    }
  }
}
