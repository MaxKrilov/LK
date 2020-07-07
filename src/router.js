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
// Страница компании
import EditCompanyPage from './components/pages/cabinet/ProfilePage/pages/EditCompanyPage'
import EditCompanyInn from './components/pages/cabinet/ProfilePage/pages/EditCompanyPage/pages/EditCompanyInn'
import EditCompanyForm from './components/pages/cabinet/ProfilePage/pages/EditCompanyPage/pages/EditCompanyForm'
import EditCompanySuccess from './components/pages/cabinet/ProfilePage/pages/EditCompanyPage/pages/EditCompanySuccess'

// Страница заказов
import Orders from './components/pages/cabinet/Orders'

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

/*
// Обещанный платеж
import PromiseOn from './components/pages/cabinet/PayPage/components/PromiseOn/index'
*/

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

// Телефония
import TelephonyPromoPage from './components/pages/telephony/promo/index'
import TelephonyPlugPage from './components/pages/telephony/plug/index'
import TelephonyPage from './components/pages/telephony/index'
// Интернет
import IpPage from './components/pages/internet/ip/index'
// Интернет Контент-фильтрация
import ContentFilterPromoPage from './components/pages/internet/content-filter/promo/index'
import ContentFilterPlugPage from './components/pages/internet/content-filter/plug/index'
import ContentFilterMainPage from './components/pages/internet/content-filter/index'
// import OATSMainPage from './components/pages/oats/index'
import OATSPromoPage from './components/pages/oats/promo/index'

// Видеоконтроль
import VideocontrolTemplate from './components/pages/videocontrol/index'
import VideocontrolProductPage from './components/pages/videocontrol/products/index'
import VCCameraConfigPage from './components/pages/videocontrol/camera-config/index'
import VCAddonListPage from './components/pages/videocontrol/analytics/list/index'
import VCAddonDetailPage from './components/pages/videocontrol/analytics/detail/index'
import VCGoToForpost from './components/pages/videocontrol/components/GoToForpostPortal'

// Опрос
import SurveyPage from './components/pages/survey/index'

// Телефония
import TelephonyTemplate from './components/templates/TelephonyTemplate/index'
import TelephonyStatisticPage from './components/pages/telephony/statistic/index'
import TelephonyRedirectionsPage from './components/pages/telephony/redirection/index'
import TelephonyBlacklistPage from '@/components/pages/telephony/blacklist/index'

import WifiTemplate from './components/templates/WiFiTemplate/index'
import WifiIndexPage from './components/pages/wifi/index/index'
// WiFi аналитика
import WifiAnalyticsPromo from './components/pages/wifi/analytics/promo'
import WifiAnalyticsChoice from './components/pages/wifi/analytics/choice'
import WifiAnalyticsStatistics from './components/pages/wifi/analytics/statistics'
import WifiAnalyticsVisitors from '@/components/pages/wifi/analytics/statistics/VisitorsPage'
import WifiAnalyticsDevices from '@/components/pages/wifi/analytics/statistics/DevicesPage'
import WifiUsersRegistry from '@/components/pages/wifi/analytics/statistics/RegistryPage'

// Страницы с ошибками
import OldBrowserPage from './components/pages/errors/old-browsers'

Vue.use(Router)

const MANAGER_AUTH_PATH = '/manager'
const api = new API()

const router = new Router({
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
            },
            {
              path: 'company',
              name: 'company',
              component: EditCompanyPage,
              children: [
                {
                  path: 'edit',
                  name: 'company-edit',
                  component: EditCompanyForm
                }, {
                  path: 'inn',
                  name: 'company-inn',
                  component: EditCompanyInn
                }, {
                  path: 'success',
                  name: 'company-success',
                  component: EditCompanySuccess
                }
              ]
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
          component: AddFunds,
          props: true
        },
        {
          path: 'payment-result',
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
          name: 'orders',
          path: 'orders',
          component: Orders
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
          path: 'telephony/promo',
          component: TelephonyPromoPage
        },
        {
          name: 'plug-packages',
          path: 'telephony/plug',
          component: TelephonyPlugPage,
          props: true
        },
        {
          path: 'telephony',
          component: TelephonyPage
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
              name: 'support',
              path: '/',
              component: SupportIndexPage
            }
          ]
        },
        {
          path: 'telephony',
          component: TelephonyTemplate,
          children: [
            {
              path: 'statistic',
              component: TelephonyStatisticPage
            },
            {
              path: 'redirections',
              component: TelephonyRedirectionsPage
            },
            {
              path: 'blacklist',
              component: TelephonyBlacklistPage
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
          path: 'internet/ip',
          component: IpPage
        },
        {
          path: 'internet/ddos/promo',
          component: DDoSPromoPage
        },
        {
          path: 'videocontrol',
          component: VideocontrolTemplate,
          children: [
            {
              path: '/',
              component: VideocontrolProductPage
            },
            {
              path: 'analytics',
              component: VCAddonListPage
            },
            {
              path: 'analytics/:code',
              component: VCAddonDetailPage,
              props: true
            },
            {
              path: 'camera/:id',
              component: VCCameraConfigPage,
              props: true
            },
            {
              path: 'go-to-forpost',
              component: VCGoToForpost
            }
          ]
        },
        {
          path: 'wifi',
          component: WifiTemplate,
          children: [
            {
              path: '/',
              component: WifiIndexPage
            }
          ]
        },
        {
          name: 'wifi-analytics-promo',
          path: 'wifi/analytics/promo',
          component: WifiAnalyticsPromo
        },
        {
          name: 'wifi-analytics-choice',
          path: 'wifi/analytics/choice',
          component: WifiAnalyticsChoice
        },
        {
          name: 'wifi-analytics-statistics',
          path: 'wifi/analytics/statistics',
          component: WifiAnalyticsStatistics,
          redirect: 'wifi/analytics/statistics/visitors',
          children: [
            {
              path: 'visitors',
              name: 'analytics-visitors',
              component: WifiAnalyticsVisitors
            },
            {
              path: 'devices',
              name: 'analytics-devices',
              component: WifiAnalyticsDevices
            },
            {
              path: 'registry',
              name: 'analytics-users-registry',
              component: WifiUsersRegistry
            }
          ]
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
    },
    {
      path: MANAGER_AUTH_PATH,
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        next('/lk')
      }
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
  const queryKeys = Object.keys(to.query)

  if (
    (to.path === MANAGER_AUTH_PATH || (to.path === '/create-client' && queryKeys.includes('as_manager'))) &&
    queryKeys.includes('customerId')
  ) {
    const customerId = to.query.customerId
    store.dispatch('auth/enableManagerAuth')
    store.dispatch('auth/setUserToms', customerId)
    Object.keys(to.query).includes('dmpID') &&
    store.dispatch('auth/setDmpId', to.query.dmpID)
  }

  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!hasAccess) {
      const tokenIsFetching = store.state.auth.refreshedToken.isFetching
      const serverError = store.getters['auth/serverErrorMessage']
      if (!tokenIsFetching && !serverError) {
        store.dispatch('auth/checkAuth', { api })
          .then(data => data && next())
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
