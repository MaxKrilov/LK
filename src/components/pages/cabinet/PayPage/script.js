import OperationComponent from './components/OperationComponent/index.vue'

export default {
  name: 'pay-page',
  components: {
    OperationComponent
  },
  data: () => ({
    pre: 'pay-page'
  }),
  created () {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
      this.winWidth()
    }
  },
  methods: {
    winWidth: function () {
      let w = this.windowWidth
      if (w >= 1200) {
        document.querySelector('.menu-component__left').style.display = 'block'
      }
      if (w < 1200) {
        document.querySelector('.menu-component__left').style.display = 'none'
      }
    }
  }
}
