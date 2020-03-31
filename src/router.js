import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { API } from '@/functions/api.ts'

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

// DDoS
import DDoSPage from '@/components/pages/internet/ddos/index'
import DDoSPromoPage from '@/components/pages/internet/ddos/promo/index'
import DDoSPlugPage from '@/components/pages/internet/ddos/plug/index'
// Интернет
// Шаблон Интернета
import InternetTemplate from '@/components/templates/InternetTemplate'
// Промо страница
import PromoPageInternet from '@/components/pages/internet/PromoPage/index'
// Главная страница Интернета
import IndexPageInternet from '@/components/pages/internet/IndexPage/index'
// Обратные зоны
import ReverceZonesPage from '@/components/pages/internet/ReverceZonesPage/index'
// Статистика
import StatisticInternetPage from '@/components/pages/internet/StatisticPage/index'

// Создание клиента (для DMP)
import DMPFormPage from './components/pages/dmp-form/index'

import OATSMainPage from './components/pages/oats/index'

// Интернет Контент-фильтрация
import ContentFilterPromoPage from './components/pages/internet/content-filter/promo/index'
import ContentFilterPlugPage from './components/pages/internet/content-filter/plug/index'
import ContentFilterMainPage from './components/pages/internet/content-filter/index'
// import OATSMainPage from './components/pages/oats/index'
import OATSPromoPage from './components/pages/oats/promo/index'

// Опрос
import SurveyPage from './components/pages/survey/index'

// Страницы с ошибками
import OldBrowserPage from './components/pages/errors/old-browsers'

Vue.use(Router)

const api = new API()

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
      meta: { requiresAuth: true },
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
          path: 'add-funds',
          component: AddFunds
        },
        {
          path: 'add-funds/payments-on',
          component: PaymentsOn
        },
        {
          path: 'promise-pay',
          component: PromisePay
        },
        {
          path: 'history-pay',
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
        },
        {
          name: 'survey',
          path: 'survey/:id',
          component: SurveyPage,
          props: true
        },
        {
          path: 'internet/content-filter/promo',
          component: ContentFilterPromoPage
        },
        {
          path: 'internet/content-filter/plug',
          component: ContentFilterPlugPage
        },
        {
          path: 'internet/content-filter',
          component: ContentFilterMainPage
        },
        {
          path: 'internet',
          component: InternetTemplate,
          children: [
            {
              path: 'promo',
              component: PromoPageInternet
            },
            {
              path: '/',
              component: IndexPageInternet,
              meta: {
                name: 'Интернет'
              }
            },
            {
              path: 'reverce-zones',
              component: ReverceZonesPage,
              meta: {
                name: 'Обратные зоны'
              }
            },
            {
              path: 'statistic',
              component: StatisticInternetPage,
              meta: {
                name: 'Статистика'
              }
            }
          ]
        },
        {
          path: 'internet/ddos/plug',
          component: DDoSPlugPage
        },
        {
          path: 'internet/ddos',
          component: DDoSPage
        },
        {
          path: 'internet/ddos/promo',
          component: DDoSPromoPage
        }
      ]
    },
    {
      path: '/create-client',
      name: 'create-client',
      meta: { requiresAuth: true },
      component: DMPFormPage
    },
    {
      path: '/old-browser',
      component: OldBrowserPage,
      meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const hasAccess = store.getters['auth/hasAccess']

  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!hasAccess) {
      const tokenIsFetching = store.state.auth.refreshedToken.isFetching
      const serverError = store.getters['auth/serverErrorMessage']
      if (!tokenIsFetching && !serverError) {
        store.dispatch('auth/checkAuth', { api })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
