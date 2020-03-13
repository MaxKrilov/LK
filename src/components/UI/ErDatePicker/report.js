import Mixin from './mixin'
const FIRST_QUARTER = 1 // 1-е января - 31-е марта
const SECOND_QUARTER = 2 // 1-е апреля - 30-е июня
const THIRD_QUARTER = 3 // 1-е июля - 30 сентября
const FOURTH_QUARTER = 4 // 1-е октября - 31-е декабря
const FIRST_HALF_YEAR = 5 // 1-е января - 30-е июня
const SECOND_HALF_YEAR = 6 // 1-е июля - 31-е декабря
const YEAR = 7 // 1-е января - 31-е декабря

export default {
  name: 'report',
  mixins: [ Mixin ],
  data: () => ({
    pre: 'er-date-picker',
    currentDate: new Date()
  }),
  props: {
    value: null
  },
  watch: {
    value (val) {
      if (!this._.isArray(val)) {
        throw new Error('v-model must be Array')
      }
    }
  },
  methods: {
    selectedPeriod (e) {
      const period = +e.target.dataset.period
      const disabled = e.target.dataset.disabled
      if (disabled) return
      let lastDayOfPeriod
      switch (period) {
        case FIRST_QUARTER:
          lastDayOfPeriod = new Date(this.monitoredYear, 2, 31)
          this.$emit('input', [
            new Date(this.monitoredYear, 0, 1),
            lastDayOfPeriod < this.currentDate ? lastDayOfPeriod : this.currentDate
          ])
          break
        case SECOND_QUARTER:
          lastDayOfPeriod = new Date(this.monitoredYear, 5, 30)
          this.$emit('input', [
            new Date(this.monitoredYear, 3, 1),
            lastDayOfPeriod < this.currentDate ? lastDayOfPeriod : this.currentDate
          ])
          break
        case THIRD_QUARTER:
          lastDayOfPeriod = new Date(this.monitoredYear, 8, 30)
          this.$emit('input', [
            new Date(this.monitoredYear, 6, 1),
            lastDayOfPeriod < this.currentDate ? lastDayOfPeriod : this.currentDate
          ])
          break
        case FOURTH_QUARTER:
          lastDayOfPeriod = new Date(this.monitoredYear, 11, 31)
          this.$emit('input', [
            new Date(this.monitoredYear, 9, 1),
            lastDayOfPeriod < this.currentDate ? lastDayOfPeriod : this.currentDate
          ])
          break
        case FIRST_HALF_YEAR:
          lastDayOfPeriod = new Date(this.monitoredYear, 5, 30)
          this.$emit('input', [
            new Date(this.monitoredYear, 0, 1),
            lastDayOfPeriod < this.currentDate ? lastDayOfPeriod : this.currentDate
          ])
          break
        case SECOND_HALF_YEAR:
          lastDayOfPeriod = new Date(this.monitoredYear, 11, 31)
          this.$emit('input', [
            new Date(this.monitoredYear, 6, 1),
            lastDayOfPeriod < this.currentDate ? lastDayOfPeriod : this.currentDate
          ])
          break
        case YEAR:
          lastDayOfPeriod = new Date(this.monitoredYear, 11, 31)
          this.$emit('input', [
            new Date(this.monitoredYear, 0, 1),
            lastDayOfPeriod < this.currentDate ? lastDayOfPeriod : this.currentDate
          ])
          break
      }
    },
    isDisabled (period) {
      if (this.monitoredYear < this.currentDate.getFullYear()) return false
      switch (period) {
        case FIRST_QUARTER:
        case FIRST_HALF_YEAR:
        case YEAR:
          return +this.currentDate < +(new Date(this.monitoredYear, 0, 1))
        case SECOND_QUARTER:
          return +this.currentDate < +(new Date(this.monitoredYear, 3, 1))
        case THIRD_QUARTER:
        case SECOND_HALF_YEAR:
          return +this.currentDate < +(new Date(this.monitoredYear, 5, 1))
        case FOURTH_QUARTER:
          return +this.currentDate < +(new Date(this.monitoredYear, 9, 1))
      }
    }
  },
  render (h) {
    return (
      <div class={`${this.pre}__report`}>
        <div class={`${this.pre}__report__year`}>
          {...this.generateSwitchYear()}
        </div>
        <div class={`${this.pre}__report__periods`}>
          <div class={`${this.pre}__report__period-group`}>
            <div class={[ `${this.pre}__report__caption`, 'caption' ]}>Квартал</div>
            <div class={`${this.pre}__report__period-group__row`}>
              {
                [
                  { period: FIRST_QUARTER, name: 'I' },
                  { period: SECOND_QUARTER, name: 'II' },
                  { period: THIRD_QUARTER, name: 'III' },
                  { period: FOURTH_QUARTER, name: 'IV' }
                ].map(period => (
                  <div
                    class={`${this.pre}__report__period`}
                    data-period={period.period}
                    vOn:click={this.selectedPeriod}
                    disabled={this.isDisabled(period.period)}
                    key={period.period}
                  >
                    { period.name }
                  </div>
                ))
              }
            </div>
          </div>
          <div class={`${this.pre}__report__period-group`}>
            <div class={[`${this.pre}__report__caption`, 'caption']}>Полугодие</div>
            <div class={`${this.pre}__report__period-group__row`}>
              {
                [
                  { period: FIRST_HALF_YEAR, name: 'I' },
                  { period: SECOND_HALF_YEAR, name: 'II' }
                ].map(period => (
                  <div
                    class={`${this.pre}__report__period`}
                    data-period={period.period}
                    vOn:click={this.selectedPeriod}
                    disabled={this.isDisabled(period.period)}
                    key={period.period}
                  >
                    {period.name}
                  </div>
                ))
              }
            </div>
          </div>
          <div class={`${this.pre}__report__period-group`}>
            <div class={`${this.pre}__report__period-group__row`}>
              <div
                class={`${this.pre}__report__period`}
                data-period={YEAR}
                vOn:click={this.selectedPeriod}
                disabled={this.isDisabled(YEAR)}
              >
                год
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  mounted () {
    this.monitoredYear = this.currentDate.getFullYear()
  }
}
