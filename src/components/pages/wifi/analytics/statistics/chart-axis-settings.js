import * as am4core from '@amcharts/amcharts4/core'

export const tickSettings = function (obj) {
  obj.renderer.ticks.template.disabled = false
  obj.renderer.ticks.template.strokeOpacity = 1
  obj.renderer.ticks.template.stroke = am4core.color('#d5d5d5')
  obj.renderer.ticks.template.strokeWidth = 1
  obj.renderer.ticks.template.length = 8
  return obj
}
