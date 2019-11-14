export function price (val) {
  return Number.prototype.toFixed.call(parseFloat(val) || 0, 2)
    .replace(/[.]+/g, ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
}
