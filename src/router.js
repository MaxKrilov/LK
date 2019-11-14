import Vue from 'vue'
import Router from 'vue-router'
// Шаблоны
import LkTemplate from './components/templates/LkTemplate/index'

// Страницы сервисной части
// Главная страница
import IndexPage from './components/pages/cabinet/IndexPage/index'
// Страница документы
import DocumentPage from './components/pages/cabinet/DocumentPage/index'
// Поддержка
// Шаблон поддержки
import SupportTemplate from './components/templates/SupportTemplate'
// Главная поддержки
import SupportIndexPage from './components/pages/cabinet/SupportPages/IndexPage/index'

// Цифровые продукты (от DMP)
import DigitalProductsIndexPage from './components/pages/digital-products/IndexPage/index'

// Создание клиента (для DMP)
import DMPFormPage from './components/pages/dmp-form/index'

// Страницы с ошибками
import OldBrowserPage from './components/pages/errors/old-browsers'

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
        },
        {
          path: 'digital-products',
          component: DigitalProductsIndexPage
        },
        {
          path: 'support',
          component: SupportTemplate,
          children: [
            {
              path: '/',
              component: SupportIndexPage
            }
          ]
        }
      ]
    },
    {
      path: '/create-client',
      component: DMPFormPage
    },
    {
      path: '/old-browser',
      component: OldBrowserPage
    }
  ]
})
