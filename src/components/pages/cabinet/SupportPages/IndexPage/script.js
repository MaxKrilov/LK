import { Vue, Component } from 'vue-property-decorator'
import CardInstructionsComponent from '../blocks/CardInstructionsComponent'
import SlideUpDownWithTitleComponent from '../blocks/SlideUpDownWithTitleComponent'
import RequestItemComponent from '../blocks/RequestItemComponent/index'

const TYPE_FILTER_REQUEST_ALL = 'all'
const TYPE_FILTER_REQUEST_ACTIVE = 'active'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

@Component({
  components: {
    CardInstructionsComponent,
    SlideUpDownWithTitleComponent,
    RequestItemComponent
  },
  filters: {
    filterTypeFilterRequest: val => val === 'all' ? 'Все заявки' : 'Активные заявки'
  }
})
export default class SupportIndexPage extends Vue {
  /**
   * Список городов по заявкам
   * @type {Array<String>}
   */
  listCity = [
    'Пермь',
    'Екатеринбург',
    'Уфа'
  ]
  /**
   * Тип заявок (для фильтрации)
   * @type {string}
   */
  typeFilterRequest = TYPE_FILTER_REQUEST_ALL
  /**
   * Список заголовков таблицы с заявками
   * @type {Array<{id: <string>, name: <string>}>}
   */
  listHeadTitle = [
    { id: 'request', name: 'Заявка' },
    { id: 'address', name: 'Адрес' },
    { id: 'status', name: 'Статус' },
    { id: 'date', name: 'Дата обновления' }
  ]
  /**
   * Поле, по которому следует сортировать
   * @type {string}
   */
  sortBy = ''
  /**
   * Сортировка по возрастанию/убыванию
   * @type {string}
   */
  orderSort = SORT_ASC

  listRequest = [
    {
      ticketId: '79736922',
      ticketType: 'Технический инцидент',
      affectedProduct: 'Интернет',
      location: 'г. Санкт-Петербург, Большая Константинопольская, 100, корп. 234, офис 123',
      createdWhen: 1560474171000,
      inProgressWhen: 1560474171000,
      onHoldWhen: 1560474171000,
      category: 'Услуга не функционирует',
      modifiedWhen: 1560474171000
    },
    {
      ticketId: '79736923',
      ticketType: 'Технический инцидент',
      affectedProduct: 'Интернет',
      location: 'г. Санкт-Петербург, Большая Константинопольская, 100, корп. 234, офис 123',
      createdWhen: 1560474171000,
      category: 'Услуга не функционирует',
      modifiedWhen: 1560474171000
    }
  ]

  /**
   * Получает количество всех заявок
   * todo Считать на основе списка заявок
   * @return {number}
   */
  get getCountRequest () {
    return 25
  }

  /**
   * Получает количество активных заявок
   * todo Считать на основе списка заявок
   * @return {number}
   */
  get getCountActiveRequest () {
    return 3
  }

  /**
   * Получает фильтр для всех заявок
   * @return {string}
   */
  get getTypeFilterRequestAll () {
    return TYPE_FILTER_REQUEST_ALL
  }

  /**
   * Получает фильтр для активных заявок
   * @return {string}
   */
  get getTypeFilterRequestActive () {
    return TYPE_FILTER_REQUEST_ACTIVE
  }
  get isDesc () {
    return this.orderSort === SORT_DESC
  }

  /**
   * Переключает фильтр типа заявок (все/активные)
   */
  toggleFilterRequest () {
    this.typeFilterRequest = this.typeFilterRequest === TYPE_FILTER_REQUEST_ALL
      ? TYPE_FILTER_REQUEST_ACTIVE
      : TYPE_FILTER_REQUEST_ALL
  }

  /**
   * Устанавливает тип фильтра (все/активные)
   * @param {string} type Тип
   */
  setFilterRequest (type) {
    this.typeFilterRequest = type
  }

  /**
   * Проверяет, является ли текущий тип фильтра активным
   * @param {string} type Тип
   * @return {boolean}
   */
  isActiveFilterRequest (type) {
    return type === this.typeFilterRequest
  }
  isSortField (id) {
    return this.sortBy === id
  }
  setSortField (id) {
    if (this.isSortField(id)) {
      this.orderSort = this.orderSort === SORT_ASC
        ? SORT_DESC
        : SORT_ASC
    } else {
      this.orderSort = SORT_ASC
      this.sortBy = id
    }
  }
}
