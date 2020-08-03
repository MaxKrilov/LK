import { eachArray } from '@/functions/helper'
import { mapState, mapGetters } from 'vuex'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import { SCREEN_WIDTH } from '../../../../../store/actions/variables'

import RightInfoPanelComponent from '../RightInfoPanelComponent/index.vue'
import ChangeOrganizationPopup from '../ChangeOrganizationPopup/index'

import { formatPhone, price } from '../../../../../functions/filters'
import { SET_ACTIVE_BILLING_ACCOUNT, SET_ACTIVE_BILLING_ACCOUNT_NUMBER } from '../../../../../store/actions/user'
import { Cookie } from '../../../../../functions/storage'
import MenuItemList from './menu'

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
      openSubMenuBackground: false,
      isOpenRightPanel: false,
      showChangeOrganizationPopup: false,
      notificationCount: 0,
      menu: MenuItemList(this.listProductByService || [])
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
      this.menu = MenuItemList(val || [])
    }
  },
  computed: {
    ...mapGetters({
      SCREEN_WIDTH,
      getManagerInfo: 'user/getManagerInfo',
      getBillingAccountsGroupByContract: 'user/getBillingAccountsGroupByContract',
      menuComponentBillingAccount: 'loading/menuComponentBillingAccount',
      menuComponentBalance: 'loading/menuComponentBalance',
      menuComponentManager: 'loading/menuComponentManager',
      notificationCountPromise: 'campaign/getCount',
      listProductByService: 'user/getListProductByService'
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
    },
    isAutopay () {
      return this.balanceInfo?.paymentMethod?.id === IS_ENABLED_AUTOPAY
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
      this.$router.push(menuItem.url)
    },
    toggleRightPanel () {
      this.isOpenRightPanel = !this.isOpenRightPanel
    },
    onClickChat () {
      this.$emit('click-chat')
    },
    onClickNotifications () {
      this.$emit('click-notifications')
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
        Cookie.set('billingAccountId', billingAccountId)
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
    }
  },
  mounted () {
    if (this.isDesktop) {
      this.openSubMenuBackground = true
    }
  }
}
