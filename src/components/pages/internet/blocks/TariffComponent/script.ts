import Vue from 'vue'
import * as d3 from 'd3'
import { tweenText } from '@/components/pages/internet/functions/animation'
import { ICustomerProduct } from '@/tbapi'
import moment from 'moment'
import Component from 'vue-class-component'
import { CURRENT_SPEED, OFFERING_SPEED_INCREASE } from '@/components/pages/internet/constants'
import { getLastElement } from '@/functions/helper'
import { price } from '@/functions/filters'
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue'

const SPEED_N_LIMIT_WIDTH = 104
const STROKE_WIDTH = 2

const arc = d3.arc()
  .startAngle(0)
  .innerRadius(SPEED_N_LIMIT_WIDTH / 2 - 2 * STROKE_WIDTH)
  .outerRadius(SPEED_N_LIMIT_WIDTH / 2 - STROKE_WIDTH)

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof TariffComponent>>({
  filters: {
    price
  },
  components: {
    SpeedComponent
  },
  props: {
    customerProduct: {
      type: Object,
      default: null
    }
  },
  watch: {
    customerProduct (val) {
      if (val !== null) {
        this.isLoading = false
        this.$nextTick(() => {
          this.generateSpeedChart();
          (this.$refs['speed-component'] as any).init()
        })
      }
    },
    computedCurrentPrice (val: number) {
      this.internetPriceAfterChange = val
    }
  }
})
export default class TariffComponent extends Vue {
  // Options
  $refs!: {
    'speed-component': InstanceType<typeof SpeedComponent>
  }
  // Props
  readonly customerProduct!: ICustomerProduct | null
  // Data
  isLoading = true
  isBlur = false
  // Абонентская плата после смены скорости
  internetPriceAfterChange = this.computedCurrentPrice

  // Computed
  get computedActualStartDate () {
    return this.customerProduct !== null
      ? moment(this.customerProduct.tlo.actualStartDate).format('DD.MM.YYYY')
      : undefined
  }
  get computedListAvailableSpeedIncrease () {
    if (this.customerProduct === null) return []
    const offeringSpeedIncrease = this.customerProduct.slo
      .find(slo => slo.childProductOffering.code.toLowerCase() === OFFERING_SPEED_INCREASE.toLowerCase())
    if (offeringSpeedIncrease === undefined ||
      !offeringSpeedIncrease.childProductOffering ||
      !offeringSpeedIncrease.childProductOffering.prices ||
      !Array.isArray(offeringSpeedIncrease.childProductOffering.prices) ||
      !offeringSpeedIncrease.childProductOffering.prices.length) return []
    return offeringSpeedIncrease.childProductOffering.prices.map(price => ({
      id: price.id,
      amount: Number(price.amount),
      speed: Number(Object.values(price.chars)[0].replace(/[\D]+/g, ''))
    })).sort((a, b) => a.speed - b.speed)
  }
  get computedCurrentSpeed () {
    return this.customerProduct === null
      ? 0
      : Number(this.customerProduct.tlo?.chars?.[CURRENT_SPEED]?.replace(/[\D]+/g, '')) || 0
  }
  get computedMaxAvailableSpeedIncrease () {
    return this.computedListAvailableSpeedIncrease.length === 0
      ? this.computedCurrentSpeed // Текущая скорость максимальна
      : getLastElement(this.computedListAvailableSpeedIncrease).speed
  }
  get computedCurrencyCode () {
    return this.customerProduct === null
      ? ''
      : this.customerProduct.tlo.purchasedPrices.recurrentTotal.currency.currencyCode
  }
  get computedCurrentPrice () {
    return this.customerProduct === null
      ? 0
      : Number(this.customerProduct.tlo.purchasedPrices.recurrentTotal.value)
  }
  get computedCurrentDiscount () {
    return this.customerProduct === null
      ? 0
      : Number(this.customerProduct.tlo.purchasedPrices.recurrentDiscount.value)
  }
  get computedOriginalName () {
    return this.customerProduct === null
      ? ''
      : this.customerProduct.tlo.offer.originalName
  }
  // Methods
  generateSpeedChart () {
    const speed = this.computedCurrentSpeed as number
    let speedPercentage = speed * 0.875 / this.computedMaxAvailableSpeedIncrease
    speedPercentage = speedPercentage > 0.875 ? 0.875 : speedPercentage
    const svg = d3.select('.tariff-component__speed .chart')
      .append('svg')
      .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
      .append('g')
      .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      // @ts-ignore
      .attr('d', arc)
    const foreground = svg.append('path')
      .datum({ endAngle: speedPercentage * 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', '#FFDD00')
      // @ts-ignore
      .attr('d', arc)
    foreground
      .transition()
      .delay(300)
      .duration(1000)
      .attrTween('d', function (d: any) {
        const start = { startAngle: 0, endAngle: 0 }
        const interpolate = d3.interpolate(start, d)
        return function (t: number) {
          return arc(interpolate(t))
        }
      })
    const text = svg.append('g')
      .classed('text', true)

    text.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .classed('top', true)
      .text('0')

    text.select('.top')
      .transition()
      .delay(300)
      .duration(1000)
      .tween('text', tweenText(speed))

    text.append('text')
      .attr('x', 0)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .classed('bottom', true)
      .text('Мбит/с')
  }

  generateLimitChart () {
    const wasted = 500
    const total = 1000
    const wastedPercentage = wasted / total
    const svg = d3.select('.tariff-component__limit .chart')
      .append('svg')
      .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
      .append('g')
      .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      // @ts-ignore
      .attr('d', arc)
    const foreground = svg.append('path')
      .datum({ endAngle: wastedPercentage * 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', '#FFDD00')
      // @ts-ignore
      .attr('d', arc)
    foreground
      .transition()
      .delay(300)
      .duration(1000)
      .attrTween('d', function (d: any) {
        const start = { startAngle: 0, endAngle: 0 }
        const interpolate = d3.interpolate(start, d)
        return function (t: number) {
          return arc(interpolate(t))
        }
      })
    const text = svg.append('g')
      .classed('text', true)
    text.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .classed('top', true)
      .text('0')
    text.select('.top')
      .transition()
      .delay(300)
      .duration(1000)
      .tween('text', tweenText(wasted))
    text.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .classed('dash', true)
      .text('—')

    text.append('text')
      .attr('x', 0)
      .attr('y', 22)
      .attr('text-anchor', 'middle')
      .classed('bottom', true)
      .text(total) // todo из prop
      .append('tspan')
      .text(' Гб')
  }

  onChainingSpeed (e: { isChainged: boolean, speed: number }) {
    const speed = Number(e.speed)
    if (speed === this.computedCurrentSpeed) {
      this.internetPriceAfterChange = this.computedCurrentPrice
    } else {
      this.internetPriceAfterChange = this.computedListAvailableSpeedIncrease
        .find(price => price.speed === speed)?.amount || 0
    }
  }

  openFormChangingSpeed () {
    this.isBlur = true
  }
  closeFormChainingSpeed () {
    this.isBlur = false
  }
}
