import Vue, { DirectiveFunction, DirectiveOptions } from 'vue'
import router from './router'
import store from './store'
// @ts-ignore
import App from './App'
import { eachArray, eachObject } from './functions/helper'
import { API } from './functions/api'
import Directives from './directives'
import moment from 'moment'
// @ts-ignore
import Vuebar from 'vuebar'

// Подключение стилей
import './assets/scss/main.scss'

// Подключение полифиллов
import './functions/polyfill'

Vue.prototype.$api = new API()

// Регистрация UI компонентов
const requireComponent = require.context('./components/UI', true, /Er[A-Z]\w+\/index\.(vue|js)$/)
eachArray(requireComponent.keys(), (fileName: string) => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^\.\/(.*)\/index\.\w+$/, '$1')
  Vue.component(componentName, componentConfig.default || componentConfig)
})

// Регистрация директив
eachObject(Directives, (config: DirectiveOptions | DirectiveFunction, directiveName: string) => {
  Vue.directive(directiveName, config)
})

// Подключение Lodash
Vue.prototype._ = require('lodash')

// Подключение moment и установка русской локали
Vue.prototype.$moment = moment
Vue.prototype.$moment.locale('ru')

// Кастомный скроллбар
Vue.use(Vuebar)

// На старых браузерах - редирект с предложением обновить

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
