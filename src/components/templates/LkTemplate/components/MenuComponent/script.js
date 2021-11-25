import { eachArray } from '@/functions/helper'
import { mapState, mapGetters } from 'vuex'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import { SCREEN_WIDTH } from '../../../../../store/actions/variables'

import RightInfoPanelComponent from '../RightInfoPanelComponent/index.vue'
import ChangeOrganizationPopup from '../ChangeOrganizationPopup/index'

import { formatPhone, price } from '../../../../../functions/filters'
import { Cookie } from '../../../../../functions/storage'
import MenuItemList from './menu'
import head from 'lodash/head'
import { dataLayerPush } from '../../../../../functions/analytics'

const IS_ENABLED_AUTOPAY = '9149184122213604836'

export default {
  name: 'menu-component',
  components: {
    ChangeOrganizationPopup,
    RightInfoPanelComponent
  },
  data () {
    return {
      pre: 'menu-component',
      openLeftMenu: false,
      openSubMenuBackground: true,
      isOpenRightPanel: false,
      showChangeOrganizationPopup: false,
      notificationCount: 0,
      menu: MenuItemList(this.listProductByService || [], this.oatsPortalLink),
      openingMenuItemIndex: 0,
      isOpenBillingAccountMenu: false,
      isOpenedCornerButton: false
    }
  },
  filters: {
    formatPhone,
    price
  },
  watch: {
    notificationCountPromise (promise) {
      promise.then(data => {
        this.notificationCount = data
      })
    },
    listProductByService (val) {
      this.menu = MenuItemList(val || [], this.oatsPortalLink)
      this.$nextTick(() => {
        this.openSubMenu(this.menu[this.openingMenuItemIndex], this.openingMenuItemIndex, null)
      })
    },
    isDesktop (val) {
      if (val) {
        this.openSubMenuBackground = true
        const firstMenuItem = head(this.menu)
        if (firstMenuItem && !firstMenuItem.isOpen) {
          this.openSubMenu(firstMenuItem, 0, null)
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      SCREEN_WIDTH,
      getManagerInfo: 'user/getManagerInfo',
      getBillingAccountsGroupByContract: 'payments/getBillingAccountsGroupByContract',
      menuComponentBillingAccount: 'loading/menuComponentBillingAccount',
      menuComponentBalance: 'loading/menuComponentBalance',
      menuComponentManager: 'loading/menuComponentManager',
      notificationCountPromise: 'campaign/getCount',
      listProductByService: 'user/getListProductByService',
      activeBillingAccountId: 'payments/getActiveBillingAccount',
      activeBillingAccountNumber: 'payments/getActiveBillingAccountNumber',
      oatsPortalLink: 'profile/oatsPortalLink'
    }),
    ...mapState({
      legalName: state => state.user.clientInfo.legalName,
      balanceInfo: state => state.payments.billingInfo
    }),
    isOpenSubMenu () {
      return !!this.menu.filter(item => item.isOpen).length
    },
    isDesktop () {
      return this[SCREEN_WIDTH] >= BREAKPOINT_XL
    },
    isAutopay () {
      return this.balanceInfo?.paymentMethod?.id === IS_ENABLED_AUTOPAY
    },
    balance () {
      return this.balanceInfo.hasOwnProperty('balance')
        ? 0 - Number(this.balanceInfo.balance)
        : 0
    }
  },
  methods: {
    openCornerButton (val) {
      this.isOpenedCornerButton = val
    },
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
    openSubMenu (menuItem, index, event) {
      this.closeSubMenu()
      if (!this.openSubMenuBackground) {
        this.openSubMenuBackground = true
      }
      if (event && !event.target.closest('.menu-component__left__body-item__sub-items')) {
        this.$router.push(menuItem.url)
      }
      menuItem.isOpen = true

      this.openingMenuItemIndex = index
    },
    toggleRightPanel () {
      this.isOpenRightPanel = !this.isOpenRightPanel
    },
    onClickChat () {
      this.$emit('click-chat')
      this.dataLayerPush({ category: 'header', action: 'click', label: 'supportchat' })
    },
    onClickNotifications () {
      this.$emit('click-notifications')
      this.dataLayerPush({ category: 'header', action: 'click', label: 'notifications' })
    },
    signOut () {
      this.$store.dispatch('auth/signOut', { api: this.$api })
      this.dataLayerPush({ category: 'header', action: 'click', label: 'exit' })
    },
    onChangeOrganization () {
      this.showChangeOrganizationPopup = true
    },
    onChangeBillingAccount (billingAccount) {
      // Устанавливаем загрузку для отслеживания
      this.$store.commit('loading/rebootBillingAccount', true)
      this.$store.commit('payments/setActiveBillingAccount', billingAccount)
      this.$nextTick(() => {
        this.$store.commit('loading/rebootBillingAccount', false)
        Cookie.set('billingAccountId', billingAccount.billingAccountId)

        this.isOpenBillingAccountMenu = false
      })
    },
    getBellClass () {
      const badgeClass = `${this.pre}__top__badge`
      const emptyBadgeClass = `${this.pre}__top__badge--empty`
      const notificationClass = `${this.pre}__top__notification`

      return {
        [emptyBadgeClass]: !this.notificationCount,
        [notificationClass]: true,
        [badgeClass]: true
      }
    },
    dataLayerPush (payload) {
      dataLayerPush(payload)
    }
  },
  mounted () {
    if (this.isDesktop) {
      this.openSubMenuBackground = true
    }
  }
}
