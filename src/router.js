import Vue from 'vue'
import Router from 'vue-router'

// Шаблоны
import LkTemplate from './components/templates/LkTemplate/index'

// Страницы сервисной части
// Главная страница
import IndexPage from './components/pages/cabinet/IndexPage/index'

// Страница Профиля
import ProfilePage from './components/pages/cabinet/ProfilePage/index'
import EditProfilePage from './components/pages/cabinet/ProfilePage/pages/EditProfilePage'
import MainProfilePage from './components/pages/cabinet/ProfilePage/pages/MainProfilePage'

// Страница документы
import DocumentPage from './components/pages/cabinet/DocumentPage/index'
import OrderDocumentPage from './components/pages/cabinet/OrderDocumentPage'
import DocumentDuplicatePage from './components/pages/cabinet/DocumentDuplicatePage/index'

// Поддержка
// Шаблон поддержки
import SupportTemplate from './components/templates/SupportTemplate'
// Главная поддержки
import SupportIndexPage from './components/pages/cabinet/SupportPages/IndexPage/index'

// Страница платежи
import PayPage from './components/pages/cabinet/PayPage/index'

// Успешный платеж
import PaymentsOn from './components/pages/cabinet/PayPage/components/PaymentsOn/index'

// Страница обещанный платеж
import PromisePay from './components/pages/cabinet/PayPage/PromisePay/index'

// Страница история платежей
import HistoryPay from './components/pages/cabinet/PayPage/HistoryPay/index'

// Страница пополнения счета
import AddFunds from './components/pages/cabinet/PayPage/AddFunds/index'

// Цифровые продукты (от DMP)
import DigitalProductsIndexPage from './components/pages/digital-products/IndexPage/index'

// Создание клиента (для DMP)
import DMPFormPage from './components/pages/dmp-form/index'

import OATSMainPage from './components/pages/oats/index'
import OATSPromoPage from './components/pages/oats/promo/index'

// Страницы с ошибками
import OldBrowserPage from './components/pages/errors/old-browsers'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: {
        name: 'index'
      }
    },
    {
      path: '/lk',
      component: LkTemplate,
      children: [
        {
          path: '/',
          name: 'index',
          component: IndexPage
        },
        {
          path: 'profile',
          component: ProfilePage,
          children: [
            {
              path: '',
              name: 'profile',
              component: MainProfilePage
            },
            {
              path: 'edit',
              name: 'profile-edit',
              component: EditProfilePage
            }
          ]
        },
        {
          path: 'payments',
          component: PayPage
        },
        {
          name: 'add-funds',
          path: '/add-funds',
          component: AddFunds,
        },
        {
          path: '/add-funds/payments-on',
          component: PaymentsOn
        },
        {
          path: '/promise-pay',
          component: PromisePay
        },
        {
          path: '/history-pay',
          component: HistoryPay
        },
        {
          name: 'documents',
          path: 'documents/',
          component: DocumentPage
        },
        {
          name: 'documents.order',
          path: 'documents/order',
          component: OrderDocumentPage
        },
        {
          name: 'documents.duplicates',
          path: 'documents/duplicates',
          component: DocumentDuplicatePage
        },
        {
          path: 'digital-products',
          component: DigitalProductsIndexPage
        },
        {
          path: 'oats',
          component: OATSMainPage
        },
        {
          path: 'oats/promo',
          component: OATSPromoPage
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
      name: 'create-client',
      component: DMPFormPage
    },
    {
      path: '/old-browser',
      component: OldBrowserPage
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
