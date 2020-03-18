import { eachArray } from '@/functions/helper'
import { mapState, mapGetters } from 'vuex'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import { SCREEN_WIDTH } from '../../../../../store/actions/variables'

import RightInfoPanelComponent from '../RightInfoPanelComponent/index.vue'
import ChangeOrganizationPopup from '../ChangeOrganizationPopup/index'

import { formatPhone, price } from '../../../../../functions/filters'
import { SET_ACTIVE_BILLING_ACCOUNT, SET_ACTIVE_BILLING_ACCOUNT_NUMBER } from '../../../../../store/actions/user'

export default {
  name: 'menu-component',
  components: {
    ChangeOrganizationPopup,
    RightInfoPanelComponent
  },
  data: () => ({
    pre: 'menu-component',
    openLeftMenu: false,
    openSubMenuBackground: false,
    isOpenRightPanel: false,
    showChangeOrganizationPopup: false,
    menu: [
      {
        name: 'Главная',
        icon: 'home',
        isOpen: false,
        url: '/lk',
        subitem: [
          {
            name: 'Профиль',
            url: '/lk/profile'
          },
          {
            name: 'Платежи',
            url: '/lk/payments'
          },
          {
            name: 'Документы',
            url: '/lk/documents'
          },
          {
            name: 'Поддержка',
            url: '/lk/support'
          },
          {
            name: 'Цифровые продукты',
            url: '/lk/digital-products'
          }
        ]
      },
      {
        name: 'Интернет',
        icon: 'internet',
        isOpen: false,
        url: '/lk/internet',
        subitem: [
          {
            name: 'Статистика',
            url: '/lk/statistic'
          },
          {
            name: 'Контент-фильтрация',
            url: '/lk/filter'
          },
          {
            name: 'Скорость',
            url: '/lk/speed'
          }
        ]
      },
      {
        name: 'Облачная телефония',
        icon: 'cloud_telephone',
        isOpen: false,
        url: '/lk/oats/promo',
        subitem: [{ name: 'Портал ОАТС', url: '/lk/oats' }]
      }
    ]
  }),
  filters: {
    formatPhone,
    price
  },
  computed: {
    ...mapGetters({
      SCREEN_WIDTH,
      getManagerInfo: 'user/getManagerInfo',
      getBillingAccountsGroupByContract: 'user/getBillingAccountsGroupByContract',
      menuComponentBillingAccount: 'loading/menuComponentBillingAccount',
      menuComponentBalance: 'loading/menuComponentBalance',
      menuComponentManager: 'loading/menuComponentManager'
    }),
    ...mapState({
      legalName: state => state.user.clientInfo.legalName,
      activeBillingAccountId: state => state.user.activeBillingAccount,
      activeBillingAccountNumber: state => state.user.activeBillingAccountNumber,
      balanceInfo: state => state.user.paymentInfo
    }),
    isOpenSubMenu () {
      return !!this.menu.filter(item => item.isOpen).length
    },
    isDesktop () {
      return this[SCREEN_WIDTH] >= BREAKPOINT_XL
    }
  },
  methods: {
    toggleLeftMenu () {
      this.openLeftMenu = !this.openLeftMenu
    },
    closeSubMenu () {
      eachArray(this.menu, item => (item.isOpen = false))
    },
    closeSubMenuNBackground () {
      this.closeSubMenu()
      this.openSubMenuBackground = false
    },
    openSubMenu (menuItem) {
      this.closeSubMenu()
      !this.openSubMenuBackground && (this.openSubMenuBackground = true)
      menuItem.isOpen = true
    },
    toggleRightPanel () {
      this.isOpenRightPanel = !this.isOpenRightPanel
    },
    signOut () {
      this.$store.dispatch('auth/signOut', { api: this.$api })
    },
    onChangeOrganization () {
      this.showChangeOrganizationPopup = true
    },
    onChangeBillingAccount (billingAccountId, accountNumber) {
      // Устанавливаем загрузку для отслеживания
      this.$store.commit('loading/rebootBillingAccount', true)
      this.$store.commit(`user/${SET_ACTIVE_BILLING_ACCOUNT}`, billingAccountId)
      this.$store.commit(`user/${SET_ACTIVE_BILLING_ACCOUNT_NUMBER}`, accountNumber)
      this.$nextTick(() => {
        this.$store.commit('loading/rebootBillingAccount', false)
      })
    }
  },
  mounted () {
    if (this.isDesktop) {
      this.openSubMenuBackground = true
      this.menu[0].isOpen = true
    }
  }
}
