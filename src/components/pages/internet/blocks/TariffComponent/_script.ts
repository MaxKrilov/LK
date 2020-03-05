import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import * as d3 from 'd3'
import { describeArc } from '@/functions/svg'
import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_LG, BREAKPOINT_MD } from '@/constants/breakpoint'
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue'
import ErNumberField from '@/components/blocks/ErNumberField/index.vue'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'
import { tweenText } from '@/components/pages/internet/functions/animation'

const SPEED_N_LIMIT_WIDTH = 104
const STROKE_WIDTH = 2

// @ts-ignore
@Component({
  components: {
    SpeedComponent,
    ErNumberField,
    ErActivationModal
  },
  computed: {
    ...mapState({
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH]
    })
  }
})
export default class TariffComponent extends Vue {
  screenWidth!: number

  isOpenDialogChangeSpeed = false
  isShowOverlapChangeSpeed = false

  isOpenDialogChangeLimit = false
  isShowOverlapChangeLimit = false

  limitTraffic = Infinity

  get isFullDialog () {
    return this.screenWidth < BREAKPOINT_MD
  }

  get getTransitionDialog () {
    return this.isFullDialog ? 'dialog-bottom-transition' : 'dialog-transition'
  }

  get isShowIntoDialog () {
    return this.screenWidth < BREAKPOINT_LG
  }

  @Watch('screenWidth')
  onScreenWidthChanged (newVal: number) {
    const breakpoint = BREAKPOINT_LG
    if (newVal > breakpoint) {
      if (this.isOpenDialogChangeSpeed) {
        this.isOpenDialogChangeSpeed = false
        this.isShowOverlapChangeSpeed = true
      } else if (this.isOpenDialogChangeLimit) {
        this.isOpenDialogChangeLimit = false
        this.isShowOverlapChangeLimit = true
      }
    } else if (newVal < breakpoint) {
      if (this.isShowOverlapChangeSpeed) {
        this.isOpenDialogChangeSpeed = true
        this.isShowOverlapChangeSpeed = false
      } else if (this.isShowOverlapChangeLimit) {
        this.isOpenDialogChangeLimit = true
        this.isShowOverlapChangeLimit = false
      }
    }
  }

  generateSpeedChart () {
    const svg = d3.select('.tariff-component__speed .chart')
      .append('svg')
      .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
      .append('g')
      .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)

    const arc = d3.arc()
      .startAngle(0)
      .innerRadius(SPEED_N_LIMIT_WIDTH / 2 - 2 * STROKE_WIDTH)
      .outerRadius(SPEED_N_LIMIT_WIDTH / 2 - STROKE_WIDTH)

    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      // @ts-ignore
      .attr('d', arc)

    const foreground = svg.append('path')
      .datum({ endAngle: 0.25 * 2 * Math.PI })
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
      // .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
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
      .tween('text', tweenText(45))

    text.append('text')
      .attr('x', 0)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .classed('bottom', true)
      .text('Мбит/с')
  }

  generateLimitChart () {
    const svg = d3.select('.tariff-component__limit .chart')
      .append('svg')
      .attr('viewBox', `0 0 ${SPEED_N_LIMIT_WIDTH} ${SPEED_N_LIMIT_WIDTH}`)
      .append('g')
      .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
    const arc = d3.arc()
      .startAngle(0)
      .innerRadius(SPEED_N_LIMIT_WIDTH / 2 - 2 * STROKE_WIDTH)
      .outerRadius(SPEED_N_LIMIT_WIDTH / 2 - STROKE_WIDTH)
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .attr('fill', 'none')
      .attr('stroke-width', STROKE_WIDTH)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      // @ts-ignore
      .attr('d', arc)

    const foreground = svg.append('path')
      .datum({ endAngle: 0.5 * 2 * Math.PI })
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
      .tween('text', tweenText(500.5))

    //
    // const text = svg.append('g')
    //   .attr('transform', `translate(${SPEED_N_LIMIT_WIDTH / 2}, ${SPEED_N_LIMIT_WIDTH / 2})`)
    //   .classed('text', true)
    //
    // text.append('text')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('text-anchor', 'middle')
    //   .classed('top', true)
    //   .text('500.5') // todo из prop
    //
    // text.append('text')
    //   .attr('x', 0)
    //   .attr('y', 10)
    //   .attr('text-anchor', 'middle')
    //   .classed('dash', true)
    //   .text('—')
    //
    // text.append('text')
    //   .attr('x', 0)
    //   .attr('y', 22)
    //   .attr('text-anchor', 'middle')
    //   .classed('bottom', true)
    //   .text('1000') // todo из prop
    //   .append('tspan')
    //   .text(' Гб')
  }

  closeDialogChangeSpeed () {
    this.isOpenDialogChangeSpeed = false
    this.isShowOverlapChangeSpeed = false
  }

  closeDialogChangeLimit () {
    this.isOpenDialogChangeLimit = false
    this.isShowOverlapChangeLimit = false
  }

  openChangeSpeed (on: any) {
    return {
      ...on,
      click: (e: MouseEvent) => {
        if (this.isShowIntoDialog) {
          this.isOpenDialogChangeSpeed = true
        } else {
          this.isShowOverlapChangeSpeed = true
        }
      }
    }
  }

  openChangeLimit (on: any) {
    return {
      ...on,
      click: (e: MouseEvent) => {
        if (this.isShowIntoDialog) {
          this.isOpenDialogChangeLimit = true
        } else {
          this.isShowOverlapChangeLimit = true
        }
      }
    }
  }

  mounted () {
    this.generateSpeedChart()
    this.generateLimitChart()
  }
}
