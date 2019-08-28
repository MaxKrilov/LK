import { eachArray, getScreenWidth } from '@/functions/helper'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import RightInfoPanelComponent from '../RightInfoPanelComponent/index.vue'

export default {
  name: 'menu-component',
  components: {
    RightInfoPanelComponent
  },
  data: () => ({
    pre: 'menu-component',
    openLeftMenu: false,
    openSubMenuBackground: false,
    isDesktop: false,
    isOpenRightPanel: false,
    menu: [
      {
        name: 'Главная',
        icon: 'home',
        isOpen: false,
        subitem: [
          { name: 'Профиль' },
          { name: 'Платежи' },
          { name: 'Документы' }
        ]
      },
      {
        name: 'Интернет',
        icon: 'internet',
        isOpen: false,
        subitem: [
          { name: 'Статистика' },
          { name: 'Контент-фильтрация' },
          { name: 'Скорость' }
        ]
      }
    ]
  }),
  computed: {
    isOpenSubMenu () {
      return !!this.menu.filter(item => item.isOpen).length
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
    }
  },
  mounted () {
    this.isDesktop = getScreenWidth() >= BREAKPOINT_XL
    if (this.isDesktop) {
      // this.openLeftMenu = true
      this.openSubMenuBackground = true
      this.menu[0].isOpen = true
    }
  }
}
