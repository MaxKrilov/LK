import Vue from 'vue'
import * as d3 from 'd3'
import { tweenText } from '@/components/pages/internet/functions/animation'

const SPEED_N_LIMIT_WIDTH = 104
const STROKE_WIDTH = 2

const arc = d3.arc()
  .startAngle(0)
  .innerRadius(SPEED_N_LIMIT_WIDTH / 2 - 2 * STROKE_WIDTH)
  .outerRadius(SPEED_N_LIMIT_WIDTH / 2 - STROKE_WIDTH)

export default Vue.extend({
  name: 'tariff-component',
  props: {},
  methods: {
    generateSpeedChart () {
      const speed = 100
      let speedPercentage = speed * 0.875 / 100
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
        .text('0') // todo из prop

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
    },
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
  },
  mounted (): void {
    this.generateSpeedChart()
    this.generateLimitChart()
  }
})
