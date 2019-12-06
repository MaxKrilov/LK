import monthsNames from './data'

export default {
  props: {
    from: { type: Number },
    count: { type: Number },
    selected: { type: Number }
  },
  data () {
    return {
      monthsNames,
      currentMonth: this.selected
    }
  },
  computed: {
    selectedMonths () {
      return this.monthsNames.slice(this.from, this.count)
    }
  },
  methods: {
    onClickMonth (index) {
      this.$emit('change', index)
      this.currentMonth = index
    }
  }
}
