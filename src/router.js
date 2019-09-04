import Vue from 'vue'
import Router from 'vue-router'
// Шаблоны
import LkTemplate from './components/templates/LkTemplate/index'

// Страницы сервисной части
// Главная страница
import IndexPage from './components/pages/cabinet/IndexPage/index'
// Страница документы
import DocumentPage from './components/pages/cabinet/DocumentPage/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/lk'
    },
    {
      path: '/lk',
      component: LkTemplate,
      children: [
        {
          path: '/',
          component: IndexPage
        },
        {
          path: 'documents',
          component: DocumentPage
        }
      ]
    }
  ]
})
