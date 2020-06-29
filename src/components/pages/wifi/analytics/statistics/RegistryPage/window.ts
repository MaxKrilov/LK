import Vue from 'vue'

export default new Vue({
  data () {
    return {
      scrollY: window.scrollY,
      innerWidth: window.innerWidth
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth
    })
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY
    })
  }
})
