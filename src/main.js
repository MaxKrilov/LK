import 'core-js';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import router from './router';
import store from './store';
// @ts-ignore
import App from './App';
import { eachArray, eachObject } from './functions/helper';
import { API } from './functions/api';
import * as Filters from './functions/filters';
import Directives from './directives';
import moment from 'moment';
// @ts-ignore
import Vuebar from 'vuebar';
import VueScrollTo from 'vue-scrollto';
// @ts-ignore
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import Skeleton from 'vue-loading-skeleton';
// Подключение стилей
import './assets/scss/main.scss';
// Подключение полифиллов
import './functions/polyfill';
Vue.prototype.$api = new API();
// Регистрация UI компонентов
const requireComponent = require.context('./components/UI', true, /Er[A-Z]\w+\/index\.(vue|js|ts|tsx)$/);
eachArray(requireComponent.keys(), (fileName) => {
    const componentConfig = requireComponent(fileName);
    const componentName = fileName.replace(/^\.\/(.*)\/index\.\w+$/, '$1');
    Vue.component(componentName, componentConfig.default || componentConfig);
});
// Регистрация директив
eachObject(Directives, (config, directiveName) => {
    Vue.directive(directiveName, config);
});
Vue.directive('resize', {
    bind: function (el, { value = {} }) {
        el.addEventListener('load', () => iFrameResize(value, el));
    }
});
// Регистрация общих фильтров
eachObject(Filters, (config, filterName) => {
    Vue.filter(filterName, config);
});
// Подключение Lodash
Vue.prototype._ = require('lodash');
// Подключение moment и установка русской локали
Vue.prototype.$moment = moment;
Vue.prototype.$moment.locale('ru');
// Кастомный скроллбар
Vue.use(Vuebar);
// Прокрутка с анимацией
Vue.use(VueScrollTo);
Vue.use(Skeleton);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
//# sourceMappingURL=main.js.map