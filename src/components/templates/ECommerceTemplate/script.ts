import Vue from 'vue'

const CLASSNAME_ERTH = 'erth'
const CLASSNAME_ECOMMERCE = 'e-commerce'

export default Vue.extend({
  name: 'e-commerce-template',
  mounted () {
    // Применяем другие стили для UI компонентов
    const app = document.querySelector('.app')
    if (app) {
      app.classList.remove(CLASSNAME_ERTH)
      app.classList.add(CLASSNAME_ECOMMERCE)
    }
  },
  beforeDestroy () {
    const app = document.querySelector('.app')
    if (app) {
      app.classList.remove(CLASSNAME_ECOMMERCE)
      app.classList.add(CLASSNAME_ERTH)
    }
  }
})
