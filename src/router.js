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

// Цифровые продукты (от DMP)
import DigitalProductsIndexPage from './components/pages/digital-products/IndexPage/index'

// Интернет
// Шаблон Интернета
import InternetTemplate from '@/components/templates/InternetTemplate'
// Промо страница
import PromoPageInternet from '@/components/pages/internet/PromoPage/index'
// Главная страница Интернета
import IndexPageInternet from '@/components/pages/internet/IndexPage/index'
// Обратные зоны
import ReverceZonesPage from '@/components/pages/internet/ReverceZonesPage/index'

// Создание клиента (для DMP)
import DMPFormPage from './components/pages/dmp-form/index'

import OATSPromoPage from './components/pages/oats/promo/index'
import OATSMainPage from './components/pages/oats/index'
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
          path: 'oats/promo',
          component: OATSPromoPage
        },
        {
          path: 'oats',
          component: OATSMainPage
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
