export default {
  name: 'operations',
  props: ['items'],
  data: () => ({
    pre: 'operations',
    wrapper: 'red',
    color: 'red',
    date: ''
  }),
  computed: {
    item () {
      if (this.items.value.slice(0, 1) === '+') {
        this.wrapper = 'green'
        this.color = 'green'
      } else {
        this.wrapper = 'red'
        this.color = 'red'
      }
      this.date = this.items.date.slice(0, 5)
      return this.items
    }
  }
}
