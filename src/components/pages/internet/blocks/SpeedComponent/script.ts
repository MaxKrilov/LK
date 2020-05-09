import Vue from 'vue'
import Component from 'vue-class-component'
import * as d3 from 'd3'
import { getLastElement } from '@/functions/helper'

const STROKE_WIDTH = 40
const END_PIE_ANGLE = 5.757

// eslint-disable-next-line no-use-before-define
@Component<InstanceType<typeof SpeedComponent>>({
  model: {
    event: 'change'
  },
  props: {
    currentSpeed: {
      type: [String, Number],
      default: 0
    },
    listAvailableSpeed: {
      type: Array,
      default: () => ([])
    },
    currentPrice: {
      type: Number,
      default: 0
    },
    currencyCode: {
      type: String,
      default: ''
    },
    value: Number,
    isTurboActivation: Boolean
  }
})
export default class SpeedComponent extends Vue {
  // Props
  readonly currentSpeed!: string | number
  readonly listAvailableSpeed!: any[]
  readonly value!: number
  readonly isTurboActivation!: boolean
  // Data
  chartHeight = 0
  strokeWidth = STROKE_WIDTH
  endPieAngel = END_PIE_ANGLE
  chartLayer: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null = null
  pieG: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null = null
  // Computed
  get computedId () {
    return `er-speed-component--${(this as any)._uid}`
  }
  // Methods
  init () {
    document.querySelector(`#${this.computedId}`)!.innerHTML = ''
    const svg = d3.select(`#${this.computedId}`)
    const width = 319
    const height = 317
    const margin = {
      top: 45,
      left: 45,
      bottom: 40,
      right: 36
    }
    const chartWidth = width - (margin.left + margin.right)
    this.chartHeight = height - (margin.top + margin.bottom)
    const translateCenter = `translate(${chartWidth / 2}, ${this.chartHeight / 2})`
    // Поле диаграммы
    this.chartLayer = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
    this.pieG = this.chartLayer.append('g')
      .attr('transform', translateCenter)
      .classed('main-field', true)
    // Поле для текста по центру
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
      .append('rect') // для того, чтобы задать области размер 32на32
      .attr('x', -17)
      .attr('y', -64)
      .attr('width', 32)
      .attr('height', 32)
      .attr('fill', 'transparent')
    mainText.select('.speed-toggle--up')
      .append('path')
      .attr('d', 'M11.9999 3.4144L22.2928 13.7073L23.707 12.293L11.9999 0.585938L0.292803 12.293L1.707 13.7073L11.9999 3.4144Z')
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('transform', 'translate(-11, -55)')
      .style('fill', 'none')
    mainText.append('g')
      .classed('speed-toggle', true)
      .classed('speed-toggle--down', true)
      .append('rect') // для того, чтобы задать области размер 32на32
      .attr('x', -14)
      .attr('y', 28)
      .attr('width', 32)
      .attr('height', 32)
      .attr('fill', 'transparent')

    mainText.select('.speed-toggle--down')
      .append('path')
      .attr('d', 'M12.0001 10.5856L1.70718 0.292703L0.292969 1.707L12.0001 13.4141L23.7072 1.707L22.293 0.292703L12.0001 10.5856Z')
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      // .attr('transform', 'translate(7, 50)')
      .attr('transform', 'translate(-11, 45)')
      .style('fill', 'none')

    // Курсор
    /* const mainCursorField = this.chartLayer.append('g')
      .attr('transform', translateCenter)
    const mainCursor = mainCursorField.append('g')
      .classed('main-cursor', true)
    // 8 - половина ширины курсора, -4 - чтобы хвостик был за шкалой
    const cursorPosition = [8, -this.chartHeight / 2 - 4]
    mainCursor
      .append('path')
      .attr('id', 'main-cursor')
      .attr('transform', 'translate(' + cursorPosition + '), rotate(90)')
      .attr(
        'd',
        'M4.35161 18.1777C4.2205 16.49 4.12563 14.7933 4.06769 13.0884C4.02255 11.7602 0 11.0898 0 9.08984C0 7.08984 4.02255 6.41812 4.06769 5.08984C4.12563 3.38497 4.2205 1.68825 4.35161 0.000534058L44.2314 3.0987C44.0782 5.07162 43.9998 7.06925 43.9998 9.08913C43.9998 11.109 44.0782 13.1066 44.2314 15.0796L4.35161 18.1777Z'
      )
      .attr('fill-rule', 'evenodd')
      .attr('clip-rule', 'evenodd') */
    const defs = svg.append('defs')
    const filter0 = defs.append('filter')
      .attr('id', 'filter0')
      .attr('color-interpolation-filters', 'sRGB')
    filter0.append('feFlood')
      .attr('flood-opacity', 0)
      .attr('result', 'BackgroundImageFix')
    filter0.append('feBlend')
      .attr('mode', 'normal')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'BackgroundImageFix')
      .attr('result', 'shape')
    filter0.append('feColorMatrix')
      .attr('in', 'SourceAlpha')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0')
      .attr('result', 'hardAlpha')
    filter0.append('feOffset')
      .attr('dx', -2)
      .attr('dy', 2)
    filter0.append('feGaussianBlur')
      .attr('stdDeviation', 4)
    filter0.append('feComposite')
      .attr('in2', 'hardAlpha')
      .attr('operator', 'arithmetic')
      .attr('k2', '-1')
      .attr('k3', '1')
    filter0.append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0')
    filter0.append('feBlend')
      .attr('mode', 'normal')
      .attr('in2', 'shape')
      .attr('result', 'effect1_innerShadow')
    // Ховер-фильтр для зеленого ползунка
    const filter1 = defs.append('filter')
      .attr('id', 'filter1')
      .attr('color-interpolation-filters', 'sRGB')
      .attr('width', 80)
      .attr('height', 80)
    filter1.append('feFlood')
      .attr('flood-opacity', 0)
      .attr('result', 'BackgroundImageFix')
    filter1.append('feColorMatrix')
      .attr('in', 'SourceAlpha')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0')
    filter1.append('feOffset')
      .attr('dy', 4)
    filter1.append('feGaussianBlur')
      .attr('stdDeviation', 8)
    filter1.append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0.657205 0 0 0 0 1 0 0 0 0 0.31441 0 0 0 1 0')
    filter1.append('feBlend')
      .attr('mode', 'normal')
      .attr('in2', 'BackgroundImageFix')
      .attr('result', 'effect1_dropShadow')
    filter1.append('feBlend')
      .attr('mode', 'normal')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'effect1_dropShadow')
      .attr('result', 'shape')
    // Ховер-фильтр для желтого ползунка
    const filter2 = defs
      .append('filter')
      .attr('id', 'filter2')
      .attr('color-interpolation-filters', 'sRGB')
      .attr('filterUnits', 'userSpaceOnUse')
      .attr('width', 80)
      .attr('height', 80)
    filter2
      .append('feFlood')
      .attr('flood-opacity', 0)
      .attr('result', 'BackgroundImageFix')
    filter2
      .append('feColorMatrix')
      .attr('in', 'SourceAlpha')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0')
    filter2.append('feOffset').attr('dy', 4)
    filter2.append('feGaussianBlur').attr('stdDeviation', 8)
    filter2
      .append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 1 0 0 0 0 0.903348 0 0 0 0 0.275109 0 0 0 1 0')
    filter2
      .append('feBlend')
      .attr('mode', 'normal')
      .attr('in2', 'BackgroundImageFix')
      .attr('result', 'effect1_dropShadow')
    filter2
      .append('feBlend')
      .attr('mode', 'normal')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'effect1_dropShadow')
      .attr('result', 'shape')
    const filter3 = defs
      .append('filter')
      .attr('id', 'filter3')
      .attr('color-interpolation-filters', 'sRGB')
      .attr('filterUnits', 'userSpaceOnUse')
      .attr('x', -32)
      .attr('y', -32)
      .attr('width', 110)
      .attr('height', 110)
    filter3
      .append('feFlood')
      .attr('flood-opacity', 0)
      .attr('result', 'BackgroundImageFix')
    filter3
      .append('feColorMatrix')
      .attr('in', 'SourceAlpha')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0')
    filter3.append('feOffset').attr('dy', 4)
    filter3.append('feGaussianBlur').attr('stdDeviation', 8)
    filter3
      .append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0 0 0 0 0.344978 0 0 0 0 0.724891 0 0 0 0 1 0 0 0 1 0')
    filter3
      .append('feBlend')
      .attr('mode', 'normal')
      .attr('in2', 'BackgroundImageFix')
      .attr('result', 'effect1_dropShadow')
    filter3
      .append('feBlend')
      .attr('mode', 'normal')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'effect1_dropShadow')
      .attr('result', 'shape')
    // Градиент для синей дуги
    const gradientBlue = defs
      .append('radialGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('xlink:href', '#positionGradient')
      .attr('id', 'gradientBlue')
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
      .attr('xlink:href', '#positionGradient')
      .attr('id', 'gradientGreen')
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
      .attr('xlink:href', '#positionGradient')
      .attr('id', 'gradientYellow')
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
      .attr('id', 'positionGradient')
      .attr('cx', 0)
      .attr('r', 65)
      .attr('cy', -this.chartHeight / 2 + this.strokeWidth / 2)
    this.draw()
  }

  draw () {
    let isTariffChaining = false
    const isTurboActivation = this.isTurboActivation
    const currentSpeed = Number(this.currentSpeed)
    const listSpeed = this.listAvailableSpeed.map(speed => speed.speed) // todo Для бонуса ускорения другие скорости
    listSpeed.unshift(currentSpeed)
    const isOnTurbo = false // todo props
    const turboSpeedActivated = 0 // todo props
    const speedInterval = 10
    const endPieAngle = this.endPieAngel
    const arcRadius = this.chartHeight / 2
    const lastAvailableSpeed = getLastElement(listSpeed)
    const lastAvailableSpeedVal = lastAvailableSpeed + speedInterval
    const fullScale = 1
    const currentSpeedScale = currentSpeed / lastAvailableSpeedVal
    const addedSpeed = isTurboActivation
      ? lastAvailableSpeed
      : isOnTurbo
        ? turboSpeedActivated
        : this.value && this.value !== currentSpeed
          ? this.value
          : currentSpeed
    const addedSpeedModel = {
      value: addedSpeed,
      get index (): number {
        return listSpeed.indexOf(this.value)
      },
      get angle (): number {
        return this.value / lastAvailableSpeedVal
      },
      get: function () {
        return this.value
      },
      set: function (val: number) {
        this.value = val
      }
    }
    if (addedSpeed !== currentSpeed) {
      this.$emit('change', addedSpeed)
    }
    const ticks = d3.ticks(0, lastAvailableSpeedVal, 99)
    const mainGradient = 'url(#gradientYellow)'
    const addedColor = isTurboActivation || isOnTurbo ? '#69BE28' : '#6688C9'
    const addedGradient = (isTurboActivation || isOnTurbo)
      ? 'url(#gradientGreen)'
      : 'url(#gradientBlue)'
    const bgColor = '#F3F3F3'
    const colors = [bgColor, addedGradient, mainGradient]
    const slowAnimationSpeed = 600
    // Функция для смены текста
    function tweenText (newVal: number) {
      return function () {
        // @ts-ignore
        const self = this
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const i = (q: number) => newVal
        return function (t: number) {
          self.textContent = i(t)
        }
      }
    }
    // Функция анимации дуги
    function arcTween (d: any, i: any, el: any, start: any) {
      const startVal = start || 0
      i = d3.interpolateNumber(startVal, d)
      return function (t: any) {
        d = i(t)
        return speedArc(d)
      }
    }
    // Функция анимации курсора
    /* function cursorTween (d: any, i: any, el: any, start: any) {
      const startVal = start || 0
      i = d3.interpolateNumber(startVal, d)
      return function (t: any) {
        d = i(t)
        return `rotate(${d * endPieAngle * 180 / Math.PI})`
      }
    }
    // Функция отрисовки ползунка
    function setCursorPosition () {
      return `rotate(${addedSpeedModel.angle * endPieAngle * 180 / Math.PI})`
    }
    // Функция перемещения тени за ползунком
    function setShadowPosition () {
      return `rotate(${addedSpeedModel.angle * endPieAngle * 180 / Math.PI})`
    } */
    // Дуги для вывода скорости
    const speedBlock = this.pieG!
      .selectAll('.my-arc')
      .data([fullScale, addedSpeedModel.angle, currentSpeedScale])
      .enter()
      .append('g')
      .classed('my-arc', true)
    const speedArc = d3
      .arc()
      .startAngle(0)
      .endAngle(function (d: any) {
        return d * endPieAngle
      })
      .innerRadius(arcRadius - this.strokeWidth)
      .outerRadius(arcRadius)
    speedBlock
      .append('path')
      .attr('fill', 'none')
      .attr('id', function (d: any, i: number) {
        return 'arc-' + i
      })
      .transition()
      .delay(20)
      .duration(slowAnimationSpeed)
      .ease(d3.easePolyOut)
      // @ts-ignore
      .attrTween('d', arcTween)
      .style('fill', function (d: any, i: number) {
        return colors[i]
      })
      .attr('filter', 'url(#filter0)')
    // Рисуем шкалу с делениями
    const speedArcs = d3
      .pie()
      .startAngle(0)
      .endAngle(endPieAngle + 0.036)
      .sort(null)
      .value(1)(ticks)
    const speedBlockGroup = this.pieG!.append('g')
    const _speedBlock = speedBlockGroup
      .selectAll('.speed-arc')
      .data(speedArcs)
    const speedNewBlock = _speedBlock
      .enter()
      .append('g')
      .classed('speed-arc', true)
    d3.select(`#${this.computedId}`)
      .select('#arc-2')
      .attr('stroke', '#FBFBFB')
      .attr('stroke-width', 1)
    const label = speedNewBlock.append('g')
    label
      .append('line')
      .attr('x1', 0)
      .attr('y1', 9)
      .attr('x2', 0)
      .attr('y2', (d: any) => d.data % 10 === 0 ? 0 : 6)
      .attr('transform', (d: any) =>
        `translate(${(arcRadius + 14) * Math.sin(d.startAngle)}, ${(arcRadius + 14) * -Math.cos(d.startAngle)}), rotate(${d.startAngle * 180 / Math.PI})`
      )
      .attr('stroke', 'rgba(0, 0, 0, 0.17)')
      .attr('stroke-width', 2)
      .classed('scale-tick', (d: any) => d.data % 10 === 0 && d.data > currentSpeed && d.data !== lastAvailableSpeedVal)
    label
      .filter(d => listSpeed.includes(d.data) || d.data === 0 || d.data === lastAvailableSpeedVal)
      .append('text')
      .attr('dx', 0)
      .attr('dy', 5)
      .attr('transform', d => `translate(${(arcRadius + 30) * Math.sin(d.startAngle)}, ${(arcRadius + 30) * -Math.cos(d.startAngle)})`)
      .classed('scale-numbers', true)
      .text(d => d.data === lastAvailableSpeedVal ? 'max' : String(d.data))
    const mainTextSelection = d3.select(`#${this.computedId}`)
      .select('.main-text .number')
    mainTextSelection
      .transition()
      .ease(d3.easePolyOut)
      .tween('text', tweenText(addedSpeedModel.get()))
    /* const mainCursorSelection = d3.select(`#${this.computedId}`)
      .select('.main-cursor')
    mainCursorSelection.data([addedSpeedModel.angle])
    mainCursorSelection.attr('transform', setCursorPosition)
    mainCursorSelection.classed('hidden', isOnTurbo) */
    /* const cursorShadow = d3.select(`#${this.computedId}`)
      .select('#positionGradient')
    cursorShadow.attr('gradientTransform', setShadowPosition) */
    // const isMSEdge = /Edge/.test(navigator.userAgent)
    /* let cursorShadow1
    let cursorShadow2
    let cursorShadow3
    if (isMSEdge) {
      cursorShadow1 = d3.select(`#${this.computedId}`).select('#gradientYellow')
      cursorShadow2 = d3.select(`#${this.computedId}`).select('#gradientBlue')
      cursorShadow3 = d3.select(`#${this.computedId}`).select('#gradientGreen')
    } */
    let startPoint = addedSpeedModel.angle
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function setCursorNewPosition (pos: number) {
      /* mainCursorSelection
        .datum(addedSpeedModel.angle)
        .transition()
        .ease(d3.easePolyOut)
        .attrTween('transform', (d: any, i: number) => cursorTween(d, i, this, pos)) */
      /* cursorShadow.attr('gradientTransform', setShadowPosition)
      if (isMSEdge) {
        cursorShadow1.attr('gradientTransform', setShadowPosition)
        cursorShadow2.attr('gradientTransform', setShadowPosition)
        cursorShadow3.attr('gradientTransform', setShadowPosition)
      } */
    }
    const setArcAnimation = (pos: number) => {
      d3.select(`#${this.computedId}`).select('#arc-1')
        .datum(addedSpeedModel.angle)
        .transition()
        .ease(d3.easePolyOut)
        // @ts-ignore
        .attrTween('d', function (d, i) {
          return arcTween(d, i, this, pos)
        })
    }
    function setScaleAnimation () {
      const oldPoint = startPoint
      setCursorNewPosition(oldPoint)
      setArcAnimation(oldPoint)
      startPoint = addedSpeedModel.angle
    }
    function setCenterSpeedValue () {
      mainTextSelection
        .transition()
        .delay(20)
        .duration(200)
        .ease(d3.easePolyOut)
        .tween('text', tweenText(addedSpeedModel.value))
    }
    const setScaleNumbersColors = () => {
      d3.select(`#${this.computedId}`)
        .selectAll('.scale-tick')
        .style('stroke', addedColor)
      d3.select(`#${this.computedId}`)
        .selectAll('.scale-numbers')
        .filter((d: any) => d.data > currentSpeed && d.data !== lastAvailableSpeedVal)
        .style('fill', addedColor)
    }
    if (isTurboActivation) {
      setScaleNumbersColors()
    }
    function setCursorStyle () {
      // todo Реализация после того, как у пользователя будет возможность выбрать любую скорость
    }
    const getFinalSpeed = (speed: number) => {
      let bisect
      let bisectR = d3.bisectRight(listSpeed, speed)
      let bisectL = d3.bisectLeft(listSpeed, speed)
      if (bisectL <= listSpeed.indexOf(currentSpeed)) {
        bisectR = listSpeed.indexOf(currentSpeed)
      }
      bisect = bisectR
      return listSpeed[bisect]
    }
    const getSpeedFromAngle = (coords: number[]) => {
      let angle = Math.atan2(coords[1], coords[0]) + Math.PI / 2
      if (angle < 0) angle = 2 * Math.PI + angle
      if (angle > endPieAngle) angle = endPieAngle
      return (angle / endPieAngle) * lastAvailableSpeedVal
    }
    const setSpeed = (speed: number) => {
      if (speed < currentSpeed) speed = currentSpeed
      else if (speed > getLastElement(listSpeed)) speed = getLastElement(listSpeed)
      addedSpeedModel.set(speed)
      setScaleAnimation()
      setCenterSpeedValue()
      isTariffChaining = speed !== currentSpeed
      this.$emit('change', speed)
      setCursorStyle()
      isTariffChaining && setScaleNumbersColors()
    }
    d3.select(`#${this.computedId}`).select('.speed-toggle--up')
      .on('click', () => {
        if (isOnTurbo) return
        let currentSpeedIndex = addedSpeedModel.index
        if (currentSpeedIndex < listSpeed.length - 1) {
          currentSpeedIndex++
          setSpeed(listSpeed[currentSpeedIndex])
        }
      })
    d3.select(`#${this.computedId}`).select('.speed-toggle--down')
      .on('click', () => {
        if (isOnTurbo) return
        let currentSpeedIndex = addedSpeedModel.index
        if (currentSpeedIndex > listSpeed.indexOf(currentSpeed)) {
          currentSpeedIndex--
          setSpeed(listSpeed[currentSpeedIndex])
          currentSpeedIndex === listSpeed.indexOf(currentSpeed) && setCursorStyle()
        }
      })
    d3.select(`#${this.computedId}`).select('.scale-numbers')
      .on('click', () => {
        if (isOnTurbo) return
        let currentSpeedIndex = addedSpeedModel.index
        if (currentSpeedIndex > listSpeed.indexOf(currentSpeed)) {
          currentSpeedIndex--
          setSpeed(listSpeed[currentSpeedIndex])
          currentSpeedIndex === listSpeed.indexOf(currentSpeed) && setCursorStyle()
        }
      })
    d3.select(`#${this.computedId}`).select('#arc-0')
      .on('click', () => {
        if (isOnTurbo) return
        const coords = d3
          .mouse(document.querySelector(`#${this.computedId}`)!.querySelector('.main-field')! as d3.ContainerElement)
        let speed = getSpeedFromAngle(coords)
        speed = getFinalSpeed(speed)
        setSpeed(speed)
      })
    d3.select(`#${this.computedId}`).select('#arc-1')
      .on('click', () => {
        if (isOnTurbo) return
        const coords = d3
          .mouse(document.querySelector(`#${this.computedId}`)!.querySelector('.main-field')! as d3.ContainerElement)
        let speed = getSpeedFromAngle(coords)
        speed = getFinalSpeed(speed)
        setSpeed(speed)
      })
  }
}
