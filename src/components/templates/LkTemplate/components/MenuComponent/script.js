import { eachArray } from '@/functions/helper'
import { mapGetters } from 'vuex'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import RightInfoPanelComponent from '../RightInfoPanelComponent/index.vue'
import { SCREEN_WIDTH } from '../../../../../store/actions/variables'
import { formatPhone } from '../../../../../functions/filters'

export default {
  name: 'menu-component',
  components: {
    RightInfoPanelComponent
  },
  data: () => ({
    pre: 'menu-component',
    openLeftMenu: false,
    openSubMenuBackground: false,
    isOpenRightPanel: false,
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
    formatPhone
  },
  computed: {
    ...mapGetters({
      SCREEN_WIDTH,
      getManagerInfo: 'user/getManagerInfo'
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
    }
  },
  mounted () {
    // console.log(this['user/getManagerInfo'])
    if (this.isDesktop) {
      this.openSubMenuBackground = true
      this.menu[0].isOpen = true
    }
  }
}
