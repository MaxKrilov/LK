import * as d3 from 'd3'

export function tweenText (newVal: any) {
  return function () {
    // @ts-ignore
    const currentValue: number = +this.textContent
    const i = d3.interpolateRound(currentValue, newVal)
    return function (t: number) {
      // @ts-ignore
      this.textContent = i(t)
    }
  }
}
