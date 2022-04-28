import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters, mapState } from 'vuex'
import { IBillingInfo } from '@/tbapi/payments'

import ErtResponsiveMixin from '@/mixins2/ErtResponsiveMixin'
import { roundUp } from '@/functions/helper'

const services = require('./json/services.json')

const SCROLL_STEP = 400

@Component<InstanceType<typeof ErtNavigationComponent>>({
  computed: {
    ...mapState({
      balanceInfo: (state: any) => state.payments.billingInfo
    }),
    ...mapGetters({
      managerInfo: 'user/getManagerInfo'
    })
  },
  watch: {
    sumToPay (val) {
      if (val) {
        this.amountToPayment = String(
          Number(roundUp(val, 2)).toFixed(2).replace('.', ',')
        )
      }
    },
    listFlag (val) {
      val.every((item: boolean) => !item) && this.removeActiveClass()
    },
    '$route' (val, oldVal) {
      if (val && oldVal && val.path !== oldVal.path) {
        this.listFlag = [false, false, false, false, false]
      }
    }
  }
})
export default class ErtNavigationComponent extends ErtResponsiveMixin {
  /// Options
  $refs!: {
    'tabs-container': HTMLDivElement
    'tabs': HTMLDivElement,
    'mobile-tabs': HTMLDivElement[]
  }

  /// Data
  listMenuItem = ['Услуги', 'Баланс', 'Документы', 'Поддержка', 'Заказы']
  listFlag = [false, false, false, false, false]

  menuItemModel: number = 0
  isOpenMenu: boolean = false

  serviceList = services

  amountToPayment: string = ''

  menuOffset: number = 0

  isShowPrevNextIcon: boolean = false

  isEndScroll: boolean = false
  isStartScroll: boolean = true

  isEndScrollMobileHead: boolean = false
  isStartScrollMobileHead: boolean = true

  offsetTabsHead: number = 0

  /// Vuex state
  readonly balanceInfo!: IBillingInfo

  /// Vuex getters
  readonly managerInfo!: { name: string, phone: string, email: string }

  /// Computed
  get menuAttrs () {
    return {
      'offsetY': true,
      'minWidth': 'calc(100vw - 17px)',
      'contentClass': 'ert-bottom-navigation__menu',
      'closeOnContentClick': false,
      'positionY': this.menuOffset
    }
  }

  get balance () {
    return this.balanceInfo.hasOwnProperty('balance')
      ? 0 - Number((this.balanceInfo as IBillingInfo).balance)
      : 0
  }

  get sumToPay () {
    return this.balance < 0
      ? Math.abs(this.balance)
      : 0
  }

  get dialogAttrs () {
    return {
      'fullscreen': true,
      transition: 'none'
    }
  }

  get getManagerName () {
    return (('name' in this.managerInfo) && this.managerInfo.name) || ''
  }

  get getManagerPhone () {
    return (('phone' in this.managerInfo) && this.managerInfo.phone) || '+ 7 800 333 9000'
  }

  get styles () {
    return {
      transform: `translateX(${this.offsetTabsHead}px)`
    }
  }

  get isMobile () {
    return this.isXS || this.isSM || this.isMD
  }

  /// Methods
  removeActiveClass () {
    const activeTab = this.$refs['tabs-container'].querySelector('.ert-bottom-navigation-tabs__item--active')
    activeTab && activeTab.classList.remove('ert-bottom-navigation-tabs__item--active')
  }

  onSetFlagHandler (index: number, val: boolean) {
    Vue.set(this.listFlag, index, val)
  }

  onCloseDialogHandler () {
    this.listFlag = [false, false, false, false, false]
  }

  onTabClickHandler (index: number) {
    this.menuItemModel = index
    this.onSetFlagHandler(index, true)
  }

  onResizeHandler () {
    this.isShowPrevNextIcon = this.$refs['tabs-container'].offsetWidth < this.$refs.tabs.scrollWidth
  }

  onNextClickHandler () {
    this.$refs.tabs.scrollLeft = this.$refs.tabs.scrollLeft + SCROLL_STEP

    this.isEndScroll = this.$refs.tabs.scrollWidth <=
      this.$refs.tabs.offsetWidth +
      this.$refs.tabs.scrollLeft +
      SCROLL_STEP

    this.isStartScroll = false
  }

  onNextMobileHeadHandler () {
    this.offsetTabsHead = this.offsetTabsHead - 100
    this.isStartScrollMobileHead = false
    this.isEndScrollMobileHead = this.$refs['mobile-tabs'][0].scrollWidth <=
      this.$refs['mobile-tabs'][0].offsetWidth +
      Math.abs(this.offsetTabsHead)
  }

  onPrevClickHandler () {
    this.$refs.tabs.scrollLeft =
      this.$refs.tabs.scrollLeft - SCROLL_STEP

    this.isEndScroll = false

    this.isStartScroll = this.$refs.tabs.scrollLeft - SCROLL_STEP <= 0
  }

  onPrevMobileHeadHandler () {
    this.offsetTabsHead = this.offsetTabsHead <= -100
      ? this.offsetTabsHead + 100
      : 0
    this.isEndScrollMobileHead = false
    this.isStartScrollMobileHead = this.offsetTabsHead === 0
  }

  mounted () {
    this.removeActiveClass()
    this.menuOffset = this.$parent.$el.clientHeight

    this.$nextTick(() => {
      this.onResizeHandler()
    })

    window.addEventListener('resize', this.onResizeHandler)

    this.amountToPayment = String(
      Number(roundUp(this.sumToPay, 2)).toFixed(2).replace('.', ',')
    )
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeHandler)
  }
}
