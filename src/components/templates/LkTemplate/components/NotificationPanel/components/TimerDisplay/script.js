const MILLISECONDS_IN_SECOND = 1000

export default {
  props: {
    toDate: Date
  },
  data () {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },
  created () {
    let today = new Date()
    let delta = Math.floor((this.toDate - today) / MILLISECONDS_IN_SECOND)
    this.seconds = delta % 60
    delta = Math.floor(delta / 60)
    this.minutes = delta % 60
    delta = Math.floor(delta / 60)
    this.hours = delta % 24
    delta = Math.floor(delta / 24)
    this.days = delta
  }
}
