import { Vue, Component, Watch } from 'vue-property-decorator'
import CardInstructionsComponent from '../blocks/CardInstructionsComponent'
import SlideUpDownWithTitleComponent from '../blocks/SlideUpDownWithTitleComponent/index'
import RequestItemComponent from '../blocks/RequestItemComponent/index'
import CreateRequestComponent from '../blocks/CreateRequestComponent/index'
import ContactInfoComponent from '../blocks/ContactInfoComponent/index'
import { GET_REQUEST } from '../../../../../store/actions/request'
import { mapState, mapGetters } from 'vuex'
import { formatPhone } from '../../../../../functions/filters'

const TYPE_FILTER_REQUEST_ALL = 'all'
const TYPE_FILTER_REQUEST_ACTIVE = 'active'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const VISIBLE_REQUEST = 6
const TOTAL_VISIBLE_PAGINATION = 7

@Component({
  components: {
    CardInstructionsComponent,
    SlideUpDownWithTitleComponent,
    RequestItemComponent,
    CreateRequestComponent,
    ContactInfoComponent
  },
  filters: {
    filterTypeFilterRequest: val => val === 'all' ? 'Все заявки' : 'Активные заявки',
    formatPhone
  },
  computed: {
    ...mapGetters({
      getManagerInfo: 'user/getManagerInfo'
    }),
    ...mapState({
      listCity: state => state.request.listRequest?.cities || [],
      vListRequest: state => state.request.listRequest?.request || [],
      loadingRequest: state => state.loading.loadingRequest
    })
  }
})
export default class SupportIndexPage extends Vue {
  /**
   * Список городов по заявкам
   * @type {Array<String>}
   */
  // listCity = {}
  city = []
  /**
   * Тип заявок (для фильтрации)
   * @type {string}
   */
  typeFilterRequest = TYPE_FILTER_REQUEST_ACTIVE
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

  listRequest = []

  currentPage = 1

  @Watch('vListRequest')
  onVListRequestChange (val) {
    this.setListRequest(val)
  }

  @Watch('currentPage')
  onCurrentPageChange () {
    this.$scrollTo('.support-page')
  }

  get getLengthPagination () {
    return Math.ceil(this.listRequestComputed.length / VISIBLE_REQUEST)
  }

  get getTotalVisiblePagination () {
    return TOTAL_VISIBLE_PAGINATION
  }

  get getListShowRequestByCity () {
    return this.city.reduce((result, item) => result.concat(this.listCity[item]), [])
  }

  get listRequestComputed () {
    const mapped = this.listRequest
    mapped.sort((a, b) => {
      if (this.sortBy === '') {
        return 0
      }
      let sortBy = this.sortBy === 'request'
        ? 'ticketName'
        : this.sortBy === 'address'
          ? 'location'
          : this.sortBy === 'status'
            ? 'status'
            : 'modifiedWhen'
      return this.orderSort === SORT_ASC
        ? a[sortBy] > b[sortBy] ? 1 : (a[sortBy] < b[sortBy] ? -1 : 0)
        : a[sortBy] > b[sortBy] ? -1 : (a[sortBy] < b[sortBy] ? 1 : 0)
    })
    const filteredByActive = mapped.filter(item => this.typeFilterRequest === TYPE_FILTER_REQUEST_ACTIVE ? !item.resolvedWhen && !item.cancelledWhen : true)
    return this.city.length === 0
      ? filteredByActive
      : filteredByActive.filter(item => this.getListShowRequestByCity.includes(item.ticketId))
  }

  get listRequestComputedByPagination () {
    return this.listRequestComputed.slice((this.currentPage - 1) * VISIBLE_REQUEST, this.currentPage * VISIBLE_REQUEST - 1)
  }

  /**
   * Получает количество всех заявок
   * @return {number}
   */
  get getCountRequest () {
    return this.listRequest.length
  }

  /**
   * Получает количество активных заявок
   * @return {number}
   */
  get getCountActiveRequest () {
    return this.listRequest.filter(item => !item.resolvedWhen && !item.cancelledWhen).length
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
  get getListNameCity () {
    return Object.keys(this.listCity)
  }
  get getVisibleRequest () {
    return VISIBLE_REQUEST
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
  setListRequest (listRequest) {
    this.listRequest = listRequest.map(item => {
      const result = {}
      result.ticketId = item.ticket_id
      result.ticketName = item.ticket_name
      result.ticketType = item.ticket_type
      // eslint-disable-next-line camelcase
      result.affectedProduct = item?.affected_product?.[0]?.name
      result.location = item.location
      result.createdWhen = item.created_when ? Number(item.created_when) : undefined
      result.inProgressWhen = item.in_progress_when ? Number(item.in_progress_when) : undefined
      result.onHoldWhen = item.on_hold_when ? Number(item.on_hold_when) : undefined
      result.resolvedWhen = item.resolved_when ? Number(item.resolved_when) : undefined
      result.closedWhen = item.closed_when ? Number(item.closed_when) : undefined
      result.modifiedWhen = item.modified_when ? Number(item.modified_when) : undefined
      result.cancelledWhen = item.cancelled_when ? Number(item.cancelled_when) : undefined
      result.type = item.type
      result.status = item.status
      result.listFile = item.attachmentIds
      return result
    })
  }
  cancelRequest (e) {
    const { id } = e
    const index = this.listRequest.findIndex(item => item.ticketId === id)
    if (index > -1) {
      this.listRequest[index].cancelledWhen = this.listRequest[index].modifiedWhen = Number(new Date())
    }
  }
  async created () {
    this.setListRequest(this.vListRequest)
  }
}
