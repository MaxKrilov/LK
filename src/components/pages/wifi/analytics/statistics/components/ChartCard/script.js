import ResponsiveMixin from '@/mixins/ResponsiveMixin'

export default {
  name: 'ChartCard',
  mixins: [ResponsiveMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    period: {
      type: String,
      default: ''
    },
    /**
     * массив объектов
     * type - тип чарта
     * ico - имя иконки для er-icon
     */
    chartTypes: {
      type: [Array, Object],
      default: () => ([])
    },
    defaultChartType: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    pre: 'chart-card',
    chart: null,
    currentChartType: ''
  }),
  computed: {
    isMobile () {
      return this.isXS || this.isSM
    }
  },

  methods: {
    setChartType (type) {
      this.currentChartType = type
      this.$emit('setChartType', type)
    }
  },

  mounted () {
    this.currentChartType = this.defaultChartType
    this.$emit('setChartType', this.defaultChartType)
  },

  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
