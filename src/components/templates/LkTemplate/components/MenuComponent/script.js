import { eachArray, getScreenWidth } from '@/functions/helper'
import { BREAKPOINT_XL } from '@/constants/breakpoint'

export default {
  name: 'menu-component',
  data: () => ({
    pre: 'menu-component',
    openLeftMenu: false,
    openSubMenuBackground: false,
    isDesktop: false,
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
