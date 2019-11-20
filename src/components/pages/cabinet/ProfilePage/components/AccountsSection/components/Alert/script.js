export default {
  name: 'alert',
  data: () => ({
    pre: 'alert'
  }),
  props: {
    isFail: { type: Boolean, default: false },
    message: { type: String, default: '' }
  },
  methods: {
  },
  computed: {
    classes () {
      return {
        [`${this.pre}__message`]: true,
        [`${this.pre}__message--fail`]: this.isFail,
        [`${this.pre}__message--success`]: !this.isFail
      }
    }
  }
}
