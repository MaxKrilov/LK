import OperationComponent from './components/OperationComponent/index.vue'

export default {
  name: 'pay-page',
  components: {
    OperationComponent
  },
  data: () => ({
    windowWidth: window.innerWidth,
    clientsTestimonialsPages: 'xl',

    pre: 'pay-page',
  }),
  computed: {
  },
  created () {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
      this.winWidth()
    }
  },
  methods: {
    winWidth: function () {
      var w = this.windowWidth
      if (w >= 1200) {
        document.querySelector('.menu-component__left').style.display = 'block'
      }
      if (w < 1200) {
        document.querySelector('.menu-component__left').style.display = 'none'
      }
      if (w < 576) {
        this.clientsTestimonialsPages = 'cols'
      } else if (w >= 576 && w < 768) {
        this.clientsTestimonialsPages = 'sm'
      } else if (w >= 768 && w < 992) {
        this.clientsTestimonialsPages = 'md'
      } else if (w >= 992 && w < 1200) {
        this.clientsTestimonialsPages = 'lg'
      } else if (w >= 1200) {
        this.clientsTestimonialsPages = 'xl'
      }
    },
  }
}
