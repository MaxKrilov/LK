import { Vue, Component } from 'vue-property-decorator'
import * as d3 from 'd3'
import { eachArray, getLastElement } from '@/functions/helper'
// @ts-ignore
import { Selection, BaseType, ContainerElement } from '@types/d3-selection'

const WIDTH_SVG = 319
const HEIGHT_SVG = 317
const MARGIN = {
  top: 45,
  left: 45,
  bottom: 40,
  right: 36
}
const STROKE_WIDTH = 40
const END_PIE_ANGLE = 5.757

interface iLabelItem {
  data: number,
  index: number,
  value: number,
  startAngle: number,
  endAngle: number,
  padAngle: number
}

@Component({
  props: {
    id: {
      type: String,
      default: function () {
        // @ts-ignore
        return `speed-component__${this._uid}`
      }
    }
  }
})
export default class SpeedComponent extends Vue {
  chartLayer: any
  pieG: any
  chartHeight: number | undefined
  id!: string
  init () {
    const svg = d3.select(`#${this.id}`)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('viewBox', `0 0 ${WIDTH_SVG} ${HEIGHT_SVG}`)
    const chartWidth = WIDTH_SVG - (MARGIN.left + MARGIN.right)
    this.chartHeight = HEIGHT_SVG - (MARGIN.top + MARGIN.bottom)
    const translateCenter = `translate(${chartWidth / 2}, ${this.chartHeight / 2})`
    this.chartLayer = svg.append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)
    this.pieG = this.chartLayer.append('g')
      .attr('transform', translateCenter)
      .classed('main-field', true)
    const mainText = this.chartLayer
      .append('g')
      .attr('transform', translateCenter)
      .classed('main-text', true)
    mainText.append('text')
      .attr('x', 0)
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .classed('number', true)
      .text(0)
    mainText.append('text')
      .attr('x', 0)
      .attr('y', 28)
      .attr('text-anchor', 'middle')
      .classed('unit', true)
      .text('Мбит/с')
    mainText.append('g')
      .classed('speed-toggle', true)
      .classed('speed-toggle--up', true)
      .append('rect')
      .attr('x', -17)
      .attr('y', -64)
      .attr('width', 32)
      .attr('height', 32)
      .attr('fill', 'transparent')
    mainText.select('.speed-toggle--up')
      .append('path')
      .attr('d', 'M11.9999 3.4144L22.2928 13.7073L23.707 12.293L11.9999 0.585938L0.292803 12.293L1.707 13.7073L11.9999 3.4144Z')
      .attr('stroke', '#FFDD00')
      .attr('stroke-width', 2)
      .attr('transform', 'translate(-11, -55)')
      .style('fill', 'none')
    mainText.append('g')
      .classed('speed-toggle', true)
      .classed('speed-toggle--down', true)
      .append('rect')
      .attr('x', -14)
      .attr('y', 28)
      .attr('width', 32)
      .attr('height', 32)
      .attr('fill', 'transparent')
    mainText.select('.speed-toggle--down')
      .append('path')
      .attr('d', 'M12.0006 10.5856L1.70767 0.292703L0.293457 1.707L12.0006 13.4141L23.7077 1.707L22.2935 0.292703L12.0006 10.5856Z')
      .attr('stroke', '#FFDD00')
      .attr('stroke-width', 2)
      .attr('transform', 'translate(-11, 45)')
      .style('fill', 'none')
    // Полузунок
    const mainCursorField = this.chartLayer.append('g')
      .attr('transform', translateCenter)
    const mainCursor = mainCursorField.append('g')
      .classed('main-cursor', true)
    const cursorPosition = [8, -this.chartHeight / 2 - 6]
    const mainCursorBlock = mainCursor.append('g')
      .attr('transform', `translate(${cursorPosition}), rotate(90)`)
    mainCursorBlock.append('path')
      .attr('fill-rule', 'evenodd')
      .attr('clip-rule', 'evenodd')
      .attr('d', 'M7.52212 0.00581863L46.1422 2.94413C47.2519 3.02856 48.0678 4.00078 47.9955 5.10004C47.8892 6.71721 47.835 8.35098 47.835 9.99999C47.835 11.649 47.8892 13.2828 47.9955 14.8999C48.0678 15.9992 47.2519 16.9714 46.1422 17.0559L7.52213 19.9942C6.42461 20.0777 5.45682 19.2522 5.37817 18.1364C5.28994 16.8846 5.22193 15.628 5.17443 14.367C5.14934 14.3598 5.12135 14.3522 5.0902 14.3443C4.89941 14.2955 4.67411 14.2529 4.38823 14.1989L4.32451 14.1869C4.02265 14.1298 3.67183 14.0621 3.31516 13.9697C2.61497 13.7883 1.7773 13.485 1.11289 12.8522C0.410152 12.1829 8.32989e-07 11.2417 7.24497e-07 10.0007C6.16004e-07 8.7597 0.410148 7.81851 1.11279 7.14912C1.77712 6.51623 2.61472 6.21265 3.31492 6.03109C3.67158 5.9386 4.02239 5.87083 4.32425 5.81366L4.388 5.80159C4.67387 5.74751 4.89916 5.70489 5.08996 5.65604C5.12121 5.64804 5.14927 5.64039 5.17442 5.63318C5.22192 4.3721 5.28993 3.11547 5.37816 1.86362C5.45681 0.747765 6.42461 -0.0776813 7.52212 0.00581863Z')
    mainCursorBlock.append('path')
      .attr('fill-rule', 'evenodd')
      .attr('clip-rule', 'evenodd')
      .attr('d', 'M7.44661 18.9903C6.89668 19.0321 6.41616 18.6189 6.37716 18.0656C6.28178 16.7125 6.21025 15.3537 6.16292 13.9896C6.11694 12.6647 1.0015 13.991 1.0015 10.0012C1.0015 6.01137 6.11694 7.33626 6.16292 6.01137C6.21025 4.6473 6.28178 3.28847 6.37716 1.93531C6.41615 1.38202 6.89669 0.968846 7.44661 1.01069L46.0667 3.949C46.6198 3.99108 47.0329 4.47731 46.9963 5.03402C46.8885 6.6733 46.8335 8.32924 46.8335 10.0005C46.8335 11.6717 46.8885 13.3276 46.9963 14.9669C47.0329 15.5236 46.6198 16.0098 46.0667 16.0519L7.44661 18.9903Z')
    mainCursorBlock.append('path')
      .attr('d', 'M14 14V14C13.4477 14 13 13.5523 13 13L13 7C13 6.44772 13.4477 6 14 6V6L14 14Z')
    mainCursorBlock.append('path')
      .attr('d', 'M14 14V14C14.5523 14 15 13.5523 15 13L15 7C15 6.44772 14.5523 6 14 6V6L14 14Z')
    mainCursorBlock.append('path')
      .attr('d', 'M20 14V14C19.4477 14 19 13.5523 19 13L19 7C19 6.44772 19.4477 6 20 6V6L20 14Z')
    mainCursorBlock.append('path')
      .attr('d', 'M20 14V14C20.5523 14 21 13.5523 21 13L21 7C21 6.44772 20.5523 6 20 6V6L20 14Z')
    mainCursorBlock.append('path')
      .attr('d', 'M26 14V14C25.4477 14 25 13.5523 25 13L25 7C25 6.44772 25.4477 6 26 6V6L26 14Z')
    mainCursorBlock.append('path')
      .attr('d', 'M26 14V14C26.5523 14 27 13.5523 27 13L27 7C27 6.44772 26.5523 6 26 6V6L26 14Z')
    const defs = svg.append('defs')
    // ============================
    //        Жёлтый ползунок
    // ============================
    const yellowRadialGradient = defs.append('radialGradient')
      .attr('id', `${this.id}__yellow_radial_gradient`)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 1)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('gradientTransform', 'translate(28.1564 3.01803) rotate(102.515) scale(11.7499 31.7738)')
    yellowRadialGradient.append('stop')
      .attr('offset', 0.495979)
      .attr('stop-color', '#FFE856')
    yellowRadialGradient.append('stop')
      .attr('offset', 0.776042)
      .attr('stop-color', '#FFDD00')
    yellowRadialGradient.append('stop')
      .attr('offset', 1)
      .attr('stop-color', '#FCD300')
    // ============================
    //        Зелёный ползунок
    // ============================
    const greenLinearGradient = defs.append('linearGradient')
      .attr('id', `${this.id}__green_linear_gradient`)
      .attr('x1', 33)
      .attr('y1', 19)
      .attr('x2', 35.2445)
      .attr('y2', 3.03438)
      .attr('gradientUnits', 'userSpaceOnUse')
    greenLinearGradient.append('stop')
      .attr('stop-color', '#549C1F')
    greenLinearGradient.append('stop')
      .attr('offset', 0.52433)
      .attr('stop-color', '#56AB14')
    greenLinearGradient.append('stop')
      .attr('offset', 0.685454)
      .attr('stop-color', '#69BE28')
    greenLinearGradient.append('stop')
      .attr('offset', 1)
      .attr('stop-color', '#94DF5A')
    // ============================
    //        Синий ползунок
    // ============================
    const blueLinearGradient = defs.append('linearGradient')
      .attr('id', `${this.id}__blue_linear_gradient`)
      .attr('x1', 38)
      .attr('y1', 3.5)
      .attr('x2', 36.9824)
      .attr('y2', 19.5306)
      .attr('gradientUnits', 'userSpaceOnUse')
    blueLinearGradient.append('stop')
      .attr('stop-color', '#7DA2E9')
    blueLinearGradient.append('stop')
      .attr('offset', 0.419644)
      .attr('stop-color', '#6789CA')
    blueLinearGradient.append('stop')
      .attr('offset', 1)
      .attr('stop-color', '#4467A9')
    // ============================
    //        Ховеры на ползунки
    // ============================
    const listFilterHover = [
      {
        id: `${this.id}__yellow_filter_hover`,
        first: '0 0 0 0 1 0 0 0 0 0.866667 0 0 0 0 0 0 0 0 1 0',
        second: '0 0 0 0 1 0 0 0 0 0.968627 0 0 0 0 0.74902 0 0 0 1 0'
      },
      {
        id: `${this.id}__green_filter_hover`,
        first: '0 0 0 0 0.43555 0 0 0 0 0.958333 0 0 0 0 0.0399306 0 0 0 1 0',
        second: '0 0 0 0 0.739103 0 0 0 0 1 0 0 0 0 0.541667 0 0 0 1 0'
      },
      {
        id: `${this.id}__green_filter_hover`,
        first: '0 0 0 0 0.294118 0 0 0 0 0.533333 0 0 0 0 1 0 0 0 1 0',
        second: '0 0 0 0 0.77819 0 0 0 0 0.852881 0 0 0 0 1 0 0 0 1 0'
      }
    ]
    eachArray(listFilterHover, (item: any) => {
      const filter = defs.append('filter')
        .attr('id', item.id)
        .attr('x', -20)
        .attr('y', -20)
        .attr('width', 96)
        .attr('height', 64)
        .attr('filterUnits', 'userSpaceOnUse')
        .attr('color-interpolation-filters', 'sRGB')
      filter.append('feFlood')
        .attr('flood-opacity', 0)
        .attr('result', 'BackgroundImageFix')
      filter.append('feColorMatrix')
        .attr('in', 'SourceAlpha')
        .attr('type', 'matrix')
        .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0')
      filter.append('feOffset')
      filter.append('feGaussianBlur')
        .attr('stdDeviation', 8)
      filter.append('feColorMatrix')
        .attr('type', 'matrix')
        .attr('values', item.first)
      filter.append('feBlend')
        .attr('mode', 'normal')
        .attr('in2', 'BackgroundImageFix')
        .attr('result', 'effect1_dropShadow')
      filter.append('feColorMatrix')
        .attr('in', 'SourceAlpha')
        .attr('type', 'matrix')
        .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0')
      filter.append('feOffset')
      filter.append('feGaussianBlur')
        .attr('stdDeviation', 2)
      filter.append('feColorMatrix')
        .attr('type', 'matrix')
        .attr('values', item.second)
      filter.append('feBlend')
        .attr('mode', 'normal')
        .attr('in2', 'effect1_dropShadow')
        .attr('result', 'effect2_dropShadow')
      filter.append('feBlend')
        .attr('mode', 'normal')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'effect2_dropShadow')
        .attr('result', 'shape')
    })
    // ============================
    //    Фильтр для обводки
    // ============================
    const grayStroke = defs.append('filter')
      .attr('id', `${this.id}__gray_stroke`)
      // .attr('filterUnits', 'userSpaceOnUse')
      .attr('color-interpolation-filters', 'sRGB')
    grayStroke.append('feFlood')
      .attr('flood-opacity', 0)
      .attr('result', 'BackgroundImageFix')
    grayStroke.append('feBlend')
      .attr('mode', 'normal')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'BackgroundImageFix')
      .attr('result', 'shape')
    grayStroke.append('feColorMatrix')
      .attr('in', 'SourceAlpha')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0')
      .attr('result', 'hardAlpha')
    grayStroke.append('feOffset')
      .attr('dx', -2)
      .attr('dy', 2)
    grayStroke.append('feGaussianBlur')
      .attr('stdDeviation', 4)
    grayStroke.append('feComposite')
      .attr('in2', 'hardAlpha')
      .attr('operator', 'arithmetic')
      .attr('k2', '-1')
      .attr('k3', '1')
    grayStroke.append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0')
    grayStroke.append('feBlend')
      .attr('mode', 'normal')
      .attr('in2', 'shape')
      .attr('result', 'effect1_innerShadow')
    // Градиент для синей дуги
    const gradientBlue = defs
      .append('radialGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('xlink:href', `#${this.id}__positionGradient`)
      .attr('id', `${this.id}__gradientBlue`)
    gradientBlue.append('stop').attr('stop-color', '#4265A8')
    gradientBlue
      .append('stop')
      .attr('offset', '0.16')
      .attr('stop-color', '#4265A8')
    gradientBlue
      .append('stop')
      .attr('offset', '1')
      .attr('stop-color', '#6688C9')
    // Градиент для зеленой дуги (турбо-режим)
    const gradientGreen = defs
      .append('radialGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('xlink:href', `#${this.id}__positionGradient`)
      .attr('id', `${this.id}__gradientGreen`)
    gradientGreen.append('stop').attr('stop-color', '#58A21F')
    gradientGreen
      .append('stop')
      .attr('offset', '0.16')
      .attr('stop-color', '#58A21F')
    gradientGreen
      .append('stop')
      .attr('offset', '1')
      .attr('stop-color', '#69BE28')
    // Градиент для желтой дуги
    const gradientYellow = defs
      .append('radialGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('xlink:href', `#${this.id}__positionGradient`)
      .attr('id', `${this.id}__gradientYellow`)
    gradientYellow.append('stop').attr('stop-color', '#F4BE01')
    gradientYellow
      .append('stop')
      .attr('offset', '0.16')
      .attr('stop-color', '#F4BE01')
    gradientYellow
      .append('stop')
      .attr('offset', '1')
      .attr('stop-color', '#FFDD00')
    defs.append('radialGradient')
      .attr('id', `#${this.id}__positionGradient`)
      .attr('cx', 0)
      .attr('r', 65)
      .attr('cy', -this.chartHeight / 2 + STROKE_WIDTH / 2)
    this.drawChart()
  }
  drawChart () {
    let isSpeedChanged: boolean = false
    const isTurboActivation: boolean = false
    const currentSpeed: number = 5
    const listAvailableSpeed: number[] = [5, 10, 30, 50, 100]
    const isOnTurbo: boolean = false
    const speedTurboActivated: number = 0
    const speedInterval: number = 10
    const endPieAngle: number = END_PIE_ANGLE
    const arcRadius: number = (this.chartHeight || 0) / 2
    const lastAvailableSpeed: number = getLastElement(listAvailableSpeed)
    const lastAvailableSpeedVal: number = lastAvailableSpeed + speedInterval
    const fullScale: number = 1
    const curretSpeedScale: number = currentSpeed / lastAvailableSpeedVal
    const addedSpeed: number = isTurboActivation
      ? lastAvailableSpeed
      : isOnTurbo
        ? speedTurboActivated
        : currentSpeed
    const addedSpeedModel = {
      value: addedSpeed,
      get index () {
        return listAvailableSpeed.indexOf(this.value)
      },
      get angle () {
        return this.value / lastAvailableSpeedVal
      },
      get () {
        return this.value
      },
      set (val: number) {
        this.value = val
      }
    }
    if (addedSpeed !== currentSpeed) {
      this.$emit('change', {
        isChanged: true,
        speed: addedSpeed
      })
    }
    const ticks = d3.ticks(0, lastAvailableSpeedVal, 99)
    const mainGradient = `url(#${this.id}__gradientYellow)`
    const addedColor = isTurboActivation || isOnTurbo
      ? '#69BE28'
      : '#6688C9'
    const addedGradient = isTurboActivation || isOnTurbo
      ? `url(#${this.id}__gradientGreen)`
      : `url(#${this.id}__gradientBlue)`
    const bgColor = '#F3F3F3'
    const colors = [
      bgColor,
      addedGradient,
      mainGradient
    ]
    const slowAnimationSpeed = 600
    function tweenText (newVal: any) {
      return function () {
        // @ts-ignore
        const self: any = this
        const i = d3.interpolateRound(newVal, newVal)
        return function (t: any) {
          self.textContent = i(t)
        }
      }
    }
    function arcTween (d: any, i: any, el: any, start: any) {
      const startVal = start || 0
      i = d3.interpolateNumber(startVal, d)
      return function (t: any) {
        d = i(t)
        return speedArc(d)
      }
    }
    function cursorTween (d: any, i: any, el: any, start: any) {
      const startVal = start || 0
      i = d3.interpolateNumber(startVal, d)
      return function (t: any) {
        d = i(t)
        return `rotate(${d * endPieAngle * 180 / Math.PI})`
      }
    }
    function setCursorPosition () {
      return `rotate(${addedSpeedModel.angle * endPieAngle * 180 / Math.PI})`
    }
    function setShadowPosition () {
      return `rotate(${addedSpeedModel.angle * endPieAngle * 180 / Math.PI})`
    }
    const speedBlock = this.pieG
      .selectAll('.my-arc')
      .data([fullScale, addedSpeedModel.angle, curretSpeedScale])
      .enter()
      .append('g')
      .classed('my-arc', true)
    const speedArc = d3
      .arc()
      .startAngle(0)
      .endAngle((d: any) => d * endPieAngle)
      .innerRadius(arcRadius - STROKE_WIDTH)
      .outerRadius(arcRadius)
    speedBlock
      .append('path')
      .attr('fill', 'none')
      .attr('id', (d: number, i: number) => `${this.id}__arc-${i}`)
      .transition()
      .delay(20)
      .duration(slowAnimationSpeed)
      .ease(d3.easePolyOut)
      .attrTween('d', arcTween)
      .style('fill', (d: number, i: number) => colors[i])
      .attr('filter', `url(#${this.id}__gray_stroke)`)
    const speedArcs = d3
      .pie()
      .startAngle(0)
      .endAngle(endPieAngle + 0.036)
      .sort(null)
      .value(1)(ticks)
    const speedBlockGroup = this.pieG.append('g')
    const listSpeedBlock = speedBlockGroup
      .selectAll('.speed-arc')
      .data(speedArcs)
    const speedNewBlock = listSpeedBlock
      .enter()
      .append('g')
      .classed('speed-arc', true)
    d3.select(`#${this.id}__arc-2`)
      .attr('stroke', '#FBFBFB')
      .attr('stroke-width', 1)
    const label = speedNewBlock.append('g')
    label
      .append('line')
      .attr('x1', 0)
      .attr('y1', 9)
      .attr('x2', 0)
      .attr('y2', (d: iLabelItem) => d.data % 10 === 0 ? 0 : 6)
      .attr('transform', (d: iLabelItem) => {
        const translateX = (arcRadius + 14) * Math.sin(d.startAngle)
        const translateY = (arcRadius + 14) * -Math.cos(d.startAngle)
        const rotate = d.startAngle * 180 / Math.PI
        return `translate(${[translateX, translateY]}), rotate(${rotate})`
      })
      .attr('stroke', 'rgba(0, 0, 0, 0.17)')
      .attr('stroke-width', 2)
      .classed('scale-tick', (d: iLabelItem) => d.data % 10 === 0 && d.data > currentSpeed && d.data !== lastAvailableSpeedVal)
    label
      .filter((d: iLabelItem) => listAvailableSpeed.includes(d.data) || d.data === 0 || d.data === lastAvailableSpeedVal ? d : false)
      .append('text')
      .attr('dx', 0)
      .attr('dy', 5)
      .attr('transform', (d: iLabelItem) => {
        const translateX = (arcRadius + 30) * Math.sin(d.startAngle)
        const translateY = (arcRadius + 30) * -Math.cos(d.startAngle)
        return `translate(${[translateX, translateY]})`
      })
      .classed('scale-numbers', true)
      .text((d: iLabelItem) => d.data === lastAvailableSpeedVal ? 'max' : d.data)
    const mainTextSelection = d3.select(`#${this.id} .main-text .number`)
    mainTextSelection
      .transition()
      .ease(d3.easePolyOut)
      .tween('text', tweenText(addedSpeedModel.get()))
    const mainCursorSelection = d3.select(`#${this.id} .main-cursor`)
    mainCursorSelection.data([addedSpeedModel.angle])
      .attr('transform', setCursorPosition)
      .classed('hidden', isOnTurbo)
    const cursorShadow = d3.select(`#${this.id}__positionGradient`)
    cursorShadow.attr('gradientTransform', setShadowPosition)
    const isMsEdge: boolean = /Edge/.test(navigator.userAgent)
    // @ts-ignore
    let cursorShadowYellow: Selection<any, any, any, any>
    // @ts-ignore
    let cursorShadowBlue: Selection<any, any, any, any>
    // @ts-ignore
    let cursorShadowGreen: Selection<any, any, any, any>
    if (isMsEdge) {
      cursorShadowYellow = d3.select(`#${this.id}__gradientYellow`)
      cursorShadowBlue = d3.select(`#${this.id}__gradientBlue`)
      cursorShadowGreen = d3.select(`#${this.id}__gradientGreen`)
    }
    let startPoint: number = addedSpeedModel.angle

    const setScaleAnimation = () => {
      setCursorNewPosition(startPoint)
      setArcAnimation(startPoint)
      startPoint = addedSpeedModel.angle
    }
    const setArcAnimation = (pos: number) => {
      d3.select(`#${this.id}__arc-1`)
        .datum(addedSpeedModel.angle)
        .transition()
        .ease(d3.easePolyOut)
        // @ts-ignore
        .attrTween('d', function (d: any, i: number) {
          return arcTween(d, i, this, pos)
        })
    }
    const setCursorNewPosition = (pos: any) => {
      mainCursorSelection
        .datum(addedSpeedModel.angle)
        .transition()
        .ease(d3.easePolyOut)
        .attrTween('transform', function (d: any, i: number) {
          return cursorTween(d, i, this, pos)
        })
      cursorShadow.attr('gradientTransform', setShadowPosition)
      if (isMsEdge) {
        cursorShadowYellow.attr('gradientTransform', setShadowPosition)
        cursorShadowBlue.attr('gradientTransform', setShadowPosition)
        cursorShadowGreen.attr('gradientTransform', setShadowPosition)
      }
    }
    const setCenterTarifValue = () => {
      mainTextSelection
        .transition()
        .delay(20)
        .duration(200)
        .ease(d3.easePolyOut)
        .tween('text', tweenText(addedSpeedModel.value))
    }
    const setScaleNumbersColor = () => {
      d3.selectAll(`#${this.id} .scale-tick`)
        .style('stroke', addedColor)
      d3.selectAll(`#${this.id} .scale-numbers`)
        .filter((d: any, i: number) => d.data > currentSpeed && d.data !== lastAvailableSpeedVal)
        .style('fill', addedColor)
    }
    if (isTurboActivation) {
      setScaleNumbersColor()
    }
    const setCursorStyle = () => {
      const addedCursorColor = isTurboActivation ? '#72D02B' : '#5F91EF'
      const mainCursorColor = addedSpeedModel.get() === currentSpeed ? '#FFE225' : addedCursorColor
      const addedHoverFilter = isTurboActivation ? `url(#${this.id}__green_filter_hover)` : `url(#${this.id}__blue_filter_hover)`
      const mainHoverFilter = addedSpeedModel.get() === currentSpeed ? `url(#${this.id}__yellow_filter_hover)` : addedHoverFilter
      mainCursorSelection
        .classed('active', isSpeedChanged || isTurboActivation)
        .selectAll('path')
        .attr('fill', mainCursorColor)
        .on('mouseenter mousedown', function () {
          d3.select(this).attr('filter', mainHoverFilter)
        })
        .on('mouseleave', function () {
          d3.select(this).attr('filter', false)
        })
    }
    setCursorStyle()
    const getFinalSpeed = (speed: number) => {
      let bisectR = d3.bisectRight(listAvailableSpeed, speed)
      let bisectL = d3.bisectLeft(listAvailableSpeed, speed)
      if (bisectR >= listAvailableSpeed.length) {
        bisectR = listAvailableSpeed.length - 1
      }
      if (bisectL <= listAvailableSpeed.indexOf(currentSpeed)) {
        bisectR = listAvailableSpeed.indexOf(currentSpeed)
      }
      return listAvailableSpeed[bisectR]
    }
    const getSpeedFromAngle = (coords: number[]) => {
      let angle = Math.atan2(coords[1], coords[0]) + Math.PI / 2
      if (angle < 0) {
        angle = 2 * Math.PI + angle
      }
      if (angle > endPieAngle) {
        angle = endPieAngle
      }
      return (angle / endPieAngle) * lastAvailableSpeedVal
    }
    const setTarifSpeed = (speed: number) => {
      if (speed < currentSpeed) {
        speed = currentSpeed
      } else if (speed > listAvailableSpeed[listAvailableSpeed.length - 1]) {
        speed = listAvailableSpeed[listAvailableSpeed.length - 1]
      }
      addedSpeedModel.set(speed)
      setScaleAnimation()
      setCenterTarifValue()
      isSpeedChanged = speed !== currentSpeed
      this.$emit('change', { isChanged: speed !== currentSpeed, speed })
      setCursorStyle()
      if (isSpeedChanged) {
        setScaleNumbersColor()
      }
    }

    d3.select(`#${this.id} .speed-toggle--up`).on('click', () => {
      if (isOnTurbo) return
      let currentSpeedIndex = addedSpeedModel.index
      if (currentSpeedIndex < listAvailableSpeed.length - 1) {
        currentSpeedIndex++
        setTarifSpeed(listAvailableSpeed[currentSpeedIndex])
        setCursorStyle()
      }
    })

    d3.select(`#${this.id} .speed-toggle--down`).on('click', () => {
      if (isOnTurbo) return
      let currentSpeedIndex = addedSpeedModel.index
      if (currentSpeedIndex > listAvailableSpeed.indexOf(currentSpeed)) {
        currentSpeedIndex--
        setTarifSpeed(listAvailableSpeed[currentSpeedIndex])
        if (currentSpeedIndex === listAvailableSpeed.indexOf(currentSpeed)) {
          setCursorStyle()
        }
      }
    })

    d3.select(`#${this.id} .scale-numbers`).on('click', () => {
      if (isOnTurbo) return
      let currentSpeedIndex = addedSpeedModel.index
      if (currentSpeedIndex > listAvailableSpeed.indexOf(currentSpeed)) {
        currentSpeedIndex--
        setTarifSpeed(listAvailableSpeed[currentSpeedIndex])
        if (currentSpeedIndex === listAvailableSpeed.indexOf(currentSpeed)) {
          setCursorStyle()
        }
      }
    })

    d3.select(`#${this.id}__arc-0`).on('click', () => {
      if (isOnTurbo) return
      const coords = d3.mouse(<ContainerElement>document.querySelector('.main-field'))
      const speed = getFinalSpeed(getSpeedFromAngle(coords))
      setTarifSpeed(speed)
    })

    d3.select(`#${this.id}__arc-1`).on('click', () => {
      if (isOnTurbo) return
      const coords = d3.mouse(<ContainerElement>document.querySelector('.main-field'))
      const speed = getFinalSpeed(getSpeedFromAngle(coords))
      setTarifSpeed(speed)
    });

    (function () {
      if (isOnTurbo) return
      let speed: number
      mainCursorSelection.call(
        d3
          .drag()
          // @ts-ignore
          .container(function () {
            return this.parentNode
          })
          .on('start', function (d: any, i: number) {
            if (d3.event.cancelable) {
              d3.event.preventDefault()
            }
          })
          .on('drag', function (d: any) {
            if (!d3.event.cancelable) {
              return
              // console.log(d3.event)
              // d3.event.preventDefault()
            }
            let coords = []
            coords[0] = d3.event.x
            coords[1] = d3.event.y
            speed = getSpeedFromAngle(coords)
            setTarifSpeed(speed)
          })
          .on('end', () => {
            speed = getFinalSpeed(speed)
            setTarifSpeed(speed)
            mainCursorSelection.on('drag', null)
          })
      )
    })()
  }
  mounted () {
    this.init()
  }
}
