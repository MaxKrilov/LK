import { eachArray } from '@/functions/helper'
import { BREAKPOINT_XL } from '@/constants/breakpoint'
import RightInfoPanelComponent from '../RightInfoPanelComponent/index.vue'
import { mapGetters } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'

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
    },
    ...mapGetters([
      SCREEN_WIDTH
    ]),
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
    }
  },
  mounted () {
    if (this.isDesktop) {
      this.openSubMenuBackground = true
      this.menu[0].isOpen = true
    }
  }
}
