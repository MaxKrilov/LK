import 'core-js'
import 'regenerator-runtime/runtime'

import Vue, { DirectiveFunction, DirectiveOptions } from 'vue'
import router from './router'
import store from './store'
// @ts-ignore
import App from './App'
import WorkInProgressPage from './components/pages/errors/work-in-progress.vue'

import { eachArray, eachObject, isLocalhost } from './functions/helper'
import { API } from './functions/api'
import * as Filters from './functions/filters'
import Directives from './directives'
import moment from 'moment'
// @ts-ignore
import Vuebar from 'vuebar'
import VueScrollTo from 'vue-scrollto'
// @ts-ignore
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import Skeleton from 'vue-loading-skeleton'
import Portal from 'portal-vue'

import * as ErtComponents from './components/UI2'
import { install } from '@/install'

import * as Sentry from '@sentry/vue'
// import VueGtm from './utils/gtm'

// Подключение стилей
import './assets/scss/main.scss'

// Подключение полифиллов
import './functions/polyfill'
import { logInfo } from '@/functions/logging'

Vue.prototype.$api = new API()

// Регистрация UI компонентов
const requireComponent = require.context('./components/UI', true, /Er[A-Z]\w+\/index\.(vue|js|ts|tsx)$/)
eachArray(requireComponent.keys(), (fileName: string) => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^\.\/(.*)\/index\.\w+$/, '$1')
  Vue.component(componentName, componentConfig.default || componentConfig)
})

// Регистрация UI2 компонентов
install(Vue, { components: ErtComponents })

// Регистрация директив
eachObject(Directives, (config: DirectiveOptions | DirectiveFunction, directiveName: string) => {
  Vue.directive(directiveName, config)
})

Vue.directive('resize', {
  bind: function (el, { value = {} }) {
    el.addEventListener('load', () => iFrameResize(value, el))
  }
})

// Регистрация общих фильтров
eachObject(Filters, (config: any, filterName: any) => {
  Vue.filter(filterName, config)
})

// Подключение Lodash
Vue.prototype._ = require('lodash')

// Подключение moment и установка русской локали
Vue.prototype.$moment = moment
Vue.prototype.$moment.locale('ru')

// Кастомный скроллбар
Vue.use(Vuebar)

// Прокрутка с анимацией
Vue.use(VueScrollTo)

Vue.use(Skeleton)
Vue.use(Portal)

// отображать страницу "Ведутся технические работы" до запроса авторизации
const WORK_IN_PROGRESS_BEFORE_AUTH = false

// отображать страницу "Ведутся технические работы" после авторизации
const WORK_IN_PROGRESS_AFTER_AUTH = false

const DEFAULT_CONFIG = {
  router,
  store,
  render: (h: any) => h(App, {
    props: { isWorkInProgress: WORK_IN_PROGRESS_AFTER_AUTH }
  })
}

const WIP_CONFIG = {
  render: (h: any) => h(WorkInProgressPage, {
    props: { showLogoutButton: false }
  })
}

const CONFIG = WORK_IN_PROGRESS_BEFORE_AUTH
  ? WIP_CONFIG
  : DEFAULT_CONFIG

if (!isLocalhost()) {
  Sentry.init({
    Vue,
    dsn: 'https://d166b464d46041a2bc1ccd386370e885@sentry.ertelecom.ru/125'
  })
}

/**
 * Заглушка для накатов на бой (для отката)
 */
logInfo('roll-forward-04-03-21-2')

// Vue.use(VueGtm, {
//   id: 'G-BB74PC3KGX',
//   vueRouter: router
// })

new Vue(CONFIG).$mount('#app')
