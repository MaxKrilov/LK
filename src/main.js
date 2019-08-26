import Vue from 'vue'
import router from './router'
import App from './App'
import { eachArray, eachObject } from './functions/helper'
import { API } from './functions/api'
import Directives from './directives'
import moment from 'moment'
import Vuebar from 'vuebar'

// Подключение стилей
import './assets/scss/main.scss'

Vue.prototype.$api = new API()

// Регистрация UI компонентов
const requireComponent = require.context('./components/UI', true, /Er[A-Z]\w+\/index\.(vue|js)$/)
eachArray(requireComponent.keys(), fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^\.\/(.*)\/index\.\w+$/, '$1')
  Vue.component(componentName, componentConfig.default || componentConfig)
})

// Регистрация директив
eachObject(Directives, (config, directiveName) => {
  Vue.directive(directiveName, config)
})

// Подключение Lodash
Vue.prototype._ = require('lodash')

// Подключение moment и установка русской локали
Vue.prototype.$moment = moment
Vue.prototype.$moment.locale('ru')

// Кастомный скроллбар
Vue.use(Vuebar)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
