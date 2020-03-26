/**
 * Компонент для промостраниц продуктов
 */
import ErPromo from '@/components/blocks/ErPromo'

export default {
  name: 'content-filter-plug-page',
  components: {
    ErPromo
  },
  data () {
    return {
      detail: false,
      hideButtons: true,
      hoveredColumn: null,
      isShowDifferent: true,
      pre: 'content-filter-plug-page',
      tariffs: [
        {
          id: 101161,
          name: 'Бизнес',
          price: '460',
          profileCount: '5',
          networkCount: '5',
          schedule: true,
          exportStatistics: true,
          personalPageLock: true,
          perodStorageStatistics: '1 год',
          modeAdblock: true,
          whiteListMode: true,
          advancedListMode: true,
          editCodePageLock: true,
          whiteListModeCount: '500',
          blackListModeCount: '500',
          safeModeSearch: true
        },
        {
          id: 101170,
          name: 'Бизнес+',
          price: '760,00',
          profileCount: '100',
          networkCount: '9',
          schedule: true,
          exportStatistics: true,
          personalPageLock: true,
          perodStorageStatistics: '2 года',
          modeAdblock: true,
          whiteListMode: true,
          advancedListMode: true,
          editCodePageLock: true,
          whiteListModeCount: '9999',
          blackListModeCount: '9999',
          safeModeSearch: true
        },
        {
          id: 101169,
          name: 'Школа',
          price: '460,00',
          profileCount: '10',
          networkCount: '10',
          schedule: true,
          exportStatistics: true,
          personalPageLock: true,
          perodStorageStatistics: '1 год',
          modeAdblock: true,
          whiteListMode: true,
          advancedListMode: true,
          editCodePageLock: false,
          whiteListModeCount: '200',
          blackListModeCount: '200',
          safeModeSearch: true
        }
      ]
    }
  },
  computed: {
    transformTariffs () {
      if (this.tariffs.length < 1) {
        return [
          {
            propertyType: '',
            property: [],
            propertyName: ''
          }
        ]
      }
      const result = [
        {
          propertyType: 'name',
          propertyName: this.getTextOfProperty('name'),
          property: this.tariffs.map(e => e.name)
        },
        {
          propertyType: 'schedule',
          propertyName: this.getTextOfProperty('schedule'),
          property: this.tariffs.map(e => e.schedule)
        },
        {
          propertyType: 'personalPageLock',
          property: this.tariffs.map(e => e.personalPageLock),
          propertyName: this.getTextOfProperty('personalPageLock')
        },
        {
          propertyType: 'exportStatistics',
          property: this.tariffs.map(e => e.exportStatistics),
          propertyName: this.getTextOfProperty('exportStatistics')
        },
        {
          propertyType: 'modeAdblock',
          property: this.tariffs.map(e => e.modeAdblock),
          propertyName: this.getTextOfProperty('modeAdblock')
        },
        {
          propertyType: 'safeModeSearch',
          property: this.tariffs.map(e => e.safeModeSearch),
          propertyName: this.getTextOfProperty('safeModeSearch')
        },
        {
          propertyType: 'whiteListMode',
          property: this.tariffs.map(e => e.whiteListMode),
          propertyName: this.getTextOfProperty('whiteListMode')
        },
        {
          propertyType: 'advancedListMode',
          property: this.tariffs.map(e => e.advancedListMode),
          propertyName: this.getTextOfProperty('advancedListMode')
        },
        {
          propertyType: 'profileCount',
          propertyName: this.getTextOfProperty('profileCount'),
          property: this.tariffs.map(e => e.profileCount)
        },
        {
          propertyType: 'editCodePageLock',
          propertyName: this.getTextOfProperty('editCodePageLock'),
          property: this.tariffs.map(e => e.editCodePageLock)
        },
        {
          propertyType: 'networkCount',
          property: this.tariffs.map(e => e.networkCount),
          propertyName: this.getTextOfProperty('networkCount')
        },
        {
          propertyType: 'price',
          property: this.tariffs.map(e => e.price),
          propertyName: this.getTextOfProperty('price')
        }
      ]
      if (!this.isShowDifferent) {
        return result.filter(el => Array.from(new Set(el.property)).length !== 1)
      }
      return result
    }
  },
  methods: {
    getTextOfProperty (property) {
      switch (property) {
        case 'name':
          return 'Тариф'
        case 'price':
          return 'Абонентская плата, с НДС'
        case 'profileCount':
          return 'Количество профилей'
        case 'exportStatistics':
          return 'Экспорт статистики'
        case 'networkCount':
          return 'Количество сетей (IP-адресов)'
        case 'schedule':
          return 'Расписание'
        case 'personalPageLock':
          return 'Персональная страница блокировки'
        case 'perodStorageStatistics':
          return 'Период хранения статистики'
        case 'modeAdblock':
          return 'Режим антибаннера'
        case 'whiteListMode':
          return 'Режим белого списка'
        case 'advancedListMode':
          return 'Расширенное управление ч/б списками'
        case 'editCodePageLock':
          return 'Редактирование кода страницы блокировки'
        case 'whiteListModeCount':
          return 'Размер белого списка'
        case 'blackListModeCount':
          return 'Размер чёрного списка'
        case 'safeModeSearch':
          return 'Режим безопасного поиска'
        default:
          return ''
      }
    },
    mouseover (index) {
      this.hoveredColumn = index
    },
    mouseleave (index) {
      this.hoveredColumn = null
    },
    handleScroll: function () {
      console.log(this.$refs.buttons.getBoundingClientRect())
      console.log(this.$refs.sbuttons.getBoundingClientRect())
      const staticButtonsTop = this.$refs.sbuttons.getBoundingClientRect().top
      const buttonsTop = this.$refs.buttons.getBoundingClientRect().top
      this.hideButtons = staticButtonsTop < buttonsTop + 50
    }
  },
  created: function () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
