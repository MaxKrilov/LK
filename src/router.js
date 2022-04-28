import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

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
// Страница с информацией об инструкции
import InstructionPage from './components/pages/cabinet/SupportPages/InstructionPage/InstructionPage.vue'

// Платежи
/// Главная
import PaymentIndexPage from './components/pages/cabinet/PaymentPages/IndexPage/index'

/// История
import PaymentHistoryPage from '@/components/pages/cabinet/PaymentPages/HistoryPage/index'

/// Обещанный платёж
import PromisePaymentPage from '@/components/pages/cabinet/PaymentPages/PromisePaymentPage/index'

/// Оплата картой
import CardPaymentPage from '@/components/pages/cabinet/PaymentPages/CardPaymentPage/index'

/// Результат платежа
import PaymentResultPage from '@/components/pages/cabinet/PaymentPages/PaymentResultPage/index'

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

import IpTransitPage from '@/components/pages/internet/ip-transit/index'

// Создание клиента (для DMP)
import DMPFormPage from './components/pages/dmp-form/index'

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

// ОАТС
import OATSMainPage from './components/pages/oats/main-page/index'
import GoToOATSPortal from './components/pages/oats/components/GoToOATSPortal'
import OATSStatisticPage from './components/pages/oats/statistic/index'

// Видеоконтроль
import VCTemplate from './components/pages/videocontrol/index'
import VCGuessProduct from './components/pages/videocontrol/guess-product'
import VCProductIndex from './components/pages/videocontrol/ProductIndex/index'
// import VCCameraConfigPage from './components/pages/videocontrol/camera-config/index'
import VCCameraPage from './components/pages/videocontrol/camera-page'
import VCAddonListPage from './components/pages/videocontrol/analytics/list/index'
import VCAddonDetailPage from './components/pages/videocontrol/analytics/detail/index'
import VCGoToForpost from './components/pages/videocontrol/components/GoToForpostPortal'
import AddCameraPage from './components/pages/videocontrol/AddCameraPage/index.vue'

// Опрос
import SurveyPage from './components/pages/survey/index'

// Телефония
import TelephonyTemplate from './components/templates/TelephonyTemplate/index'
import TelephonyStatisticPage from './components/pages/telephony/statistic/index'
// import TelephonyRedirectionsPage from './components/pages/telephony/redirection/index'
import TelephonyRedirectionsPage from './components/pages/telephony/RedirectionPage/index'
import TelephonyBlacklistPage from '@/components/pages/telephony/blacklist/index'

import WifiTemplate from './components/templates/WiFiTemplate/index'
import WifiIndexPage from './components/pages/wifi/index/index'
import WifiPromo from './components/pages/wifi/promo/index'
import WifiServiceAuth from './components/pages/wifi/service-auth/index'
import WifiPersonalizationPage from '@/components/pages/wifi/personalization/index'
// WiFi аналитика
import ErtAnalyticsPage from '@/components/pages/wifi/AnalyticsPage'
import WifiRadarPage from '@/components/pages/wifi/radar/index.vue'

// WiFi PRO
import ErtWifiPro from '@/components/pages/wifi/pro/index'

import TVPromoPage from './components/pages/tv/promo-page/index'
import TVMainPage from './components/pages/tv/index'
import TVPackagesPage from './components/pages/tv/tv-packages/index'
import ChannelListPage from './components/pages/tv/channel-list/index'
import PackageListPage from './components/pages/tv/tv-package-list/index'

import VPNMainPage from './components/pages/vpn/index'
import VPNPromoPage from './components/pages/vpn/promo-page/index'

// Страницы с ошибками
import OldBrowserPage from './components/pages/errors/old-browsers'

import ErtEcommerceCreateClient from '@/components/pages/ecommerce/create-client/index'

// ECommerce
/// Шаблон (необходимо для установки шрифтов)
import ECommerceTemplate from './components/templates/ECommerceTemplate/index'

/// Подписание документов
import ECommerceSigningOfDocuments from './components/pages/ecommerce/signing-of-documents/index'

/// Оплата картой
import ECommercePayment from './components/pages/ecommerce/payments/index'

/// Результат платежа
import ECommercePaymentResult from './components/pages/ecommerce/payments-result/index'

// Wifi контент фильтрация
import WifiContentFilter from './components/pages/wifi/content-filter/index'
import WifiContentFilterPromo from './components/pages/wifi/content-filter/components/promo/index'
import WifiFilterEdit from '@/components/pages/wifi/content-filter/components/edit-filter/index'

Vue.use(Router)

const MANAGER_AUTH_PATH = '/manager'
// const api = new API()

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
          component: PaymentIndexPage
        },
        {
          path: 'payments/history',
          component: PaymentHistoryPage
        },
        {
          path: 'payments/promise-payments',
          component: PromisePaymentPage
        },
        {
          path: 'add-funds',
          redirect: 'payments/card-payment'
        },
        {
          path: 'payments/card-payment',
          component: CardPaymentPage
        },
        {
          path: 'payments/result',
          component: PaymentResultPage
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
          name: 'go-to-oats-portal',
          path: 'oats/go-to-portal',
          component: GoToOATSPortal
        },
        {
          name: 'oats-statistic',
          path: 'oats/statistic',
          component: OATSStatisticPage,
          props: true
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
          path: 'support',
          component: SupportTemplate,
          children: [
            {
              name: 'support',
              path: '/',
              props: true,
              component: SupportIndexPage
            },
            {
              path: 'instructions/:id',
              component: InstructionPage,
              props: true
            }
          ]
        },
        {
          path: 'telephony',
          component: TelephonyTemplate,
          children: [
            {
              name: 'telephony-statistic',
              path: 'statistic',
              component: TelephonyStatisticPage,
              props: true
            },
            // {
            //   path: 'redirections',
            //   component: TelephonyRedirectionsPage
            // },
            {
              path: 'blacklist',
              component: TelephonyBlacklistPage
            }
          ]
        },
        {
          path: 'telephony/redirections',
          component: TelephonyRedirectionsPage
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
          path: 'internet/ip-transit',
          component: IpTransitPage
        },
        {
          path: 'internet',
          component: InternetTemplate,
          children: [
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
          path: 'internet/promo',
          component: PromoPageInternet
        },
        {
          path: 'videocontrol/',
          component: VCGuessProduct
        },
        {
          path: 'videocontrol/:type',
          component: VCTemplate,
          props: true,
          children: [
            {
              path: '/',
              name: 'vc-index',
              component: VCProductIndex
            },
            {
              path: 'products',
              name: 'vc-product-list',
              component: VCAddonListPage
            },
            {
              path: 'products/:tomsId',
              name: 'vc-product-detail',
              component: VCAddonDetailPage,
              props: true
            },
            {
              path: 'camera/add',
              component: AddCameraPage,
              name: 'vc-add-camera'
            },
            {
              path: 'camera/:id',
              component: VCCameraPage,
              name: 'vc-camera',
              props: true
            },
            { // только для Forpost
              name: 'go-to-forpost',
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
            },
            {
              path: 'promo',
              component: WifiPromo
            },
            // {
            //   path: 'auth-services',
            //   component: WifiAuthService
            // },
            {
              path: 'personalization',
              name: 'wifi-personalization',
              component: WifiPersonalizationPage
            }
          ]
        },
        {
          path: 'wifi/radar',
          name: 'wifi-radar',
          component: WifiRadarPage
        },
        {
          path: 'wifi/analytics',
          name: 'wifi-analytics',
          component: ErtAnalyticsPage
        },
        {
          path: 'wifi/services-auth',
          name: 'wifi-services-auth',
          component: WifiServiceAuth
        },
        {
          path: 'wifi/content-filter',
          name: 'wifi-content-filter',
          component: WifiContentFilter
        },
        {
          path: 'wifi/content-filter/promo',
          component: WifiContentFilterPromo
        },
        {
          path: 'wifi/content-filter/edit/:id',
          component: WifiFilterEdit,
          props: true
        },
        {
          path: 'wifi/content-filter/create',
          component: WifiFilterEdit,
          props: { create: true }
        },
        {
          path: 'wifi/pro',
          component: ErtWifiPro
        },
        {
          path: 'tv',
          component: TVMainPage
        },
        {
          path: 'tv/promo',
          component: TVPromoPage,
          meta: {
            name: 'Промо-страница Бизнес ТВ'
          }
        },
        {
          path: 'tv/channel-list/:packId',
          props: true,
          component: ChannelListPage,
          meta: {
            name: 'ChannelList'
          }
        },
        {
          path: 'tv/packages-list',
          props: true,
          component: PackageListPage,
          meta: {
            name: 'PackageList'
          }
        },
        {
          path: 'tv/packages',
          component: TVPackagesPage,
          props: true,
          name: 'tv-packages',
          meta: {
            name: 'Пакеты каналов'
          }
        },
        {
          path: 'vpn',
          component: VPNMainPage,
          meta: {
            name: 'Промо-страница Бизнес ТВ'
          }
        },
        {
          path: 'vpn/promo',
          component: VPNPromoPage,
          meta: {
            name: 'Промо-страница Бизнес ТВ'
          }
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
      path: '/ecommerce',
      component: ECommerceTemplate,
      children: [
        {
          path: 'create-client',
          name: 'ecommerce-create-client',
          component: ErtEcommerceCreateClient
        },
        {
          path: 'signing-of-documents',
          name: 'ecommerce-signing-of-documents',
          component: ECommerceSigningOfDocuments
        },
        {
          path: 'payment',
          name: 'ecommerce-payments',
          component: ECommercePayment
        },
        {
          path: 'payment-result',
          name: 'ecommerce-payment-result',
          component: ECommercePaymentResult
        }
      ]
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

  if (queryKeys.includes('clean')) {
    store.dispatch('auth/clean')
    next()
  }

  if (to.matched.some(r => r.meta.requiresAuth)) {
    next()
    if (!hasAccess) {
      // const tokenIsFetching = store.state.auth.refreshedToken.isFetching
      // const serverError = store.getters['auth/serverErrorMessage']
      // if (!tokenIsFetching && !serverError) {
      //   store.dispatch('auth/checkAuth', { api })
      //     .then(data => data && next())
      // }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
