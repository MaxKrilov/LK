import { Component, Vue, Watch } from 'vue-property-decorator'
import CardInstructionsComponent from '../blocks/CardInstructionsComponent'
import SlideUpDownWithTitleComponent from '../blocks/SlideUpDownWithTitleComponent/index'
import RequestItemComponent from '../blocks/RequestItemComponent/index'
import CreateRequestComponent from '../blocks/CreateRequestComponent/index'
import ContactInfoComponent from '../blocks/ContactInfoComponent/index'
import DirectorFeedback from '../blocks/DirectorFeedback/index'
import ErtInstructionSelect from '../../../../blocks2/ErtInstructionSelect/index'
import { FETCH_REQUEST_LIST } from '@/store/actions/request'

import { mapGetters, mapState } from 'vuex'
import { formatPhone } from '@/functions/filters'
import { isObject } from '@/functions/helper2'
import { DEFAULT_REQUESTS_PER_PAGE, SORT_FIELDS } from '@/constants/request'
import { FETCH_ACTIVE_REQUEST_LIST } from '../../../../../store/actions/request'

import uniq from 'lodash/uniq'

import { dataLayerPush } from '../../../../../functions/analytics'

const TYPE_FILTER_REQUEST_ALL = 'all'
const TYPE_FILTER_REQUEST_ACTIVE = 'active'

const SORT_ASC = 'asc'
const SORT_DESC = 'desc'

const VISIBLE_REQUEST = DEFAULT_REQUESTS_PER_PAGE

const CHANNEL_DMP = '9156762963913869573'

const mapRequestItem = item => {
  const result = {}
  result.ticketId = item.ticket_id
  result.ticketName = item.ticket_name
  result.ticketType = item.ticket_type
  // eslint-disable-next-line camelcase
  result.affectedProduct = item?.affected_product?.[0]?.name
  result.location = isObject(item.location)
    ? item.location['formatted_Address']
    : item.location
  result.createdWhen = item.created_when ? Number(item.created_when) : undefined
  result.inProgressWhen = item.in_progress_when ? Number(item.in_progress_when) : undefined
  result.onHoldWhen = item.on_hold_when ? Number(item.on_hold_when) : undefined
  result.resolvedWhen = item.resolved_when ? Number(item.resolved_when) : undefined
  result.closedWhen = item.closed_when ? Number(item.closed_when) : undefined
  result.modifiedWhen = item.modified_when ? Number(item.modified_when) : undefined
  result.cancelledWhen = item.cancelled_when ? Number(item.cancelled_when) : undefined
  result.type = isObject(item.type) ? item.type.name : item.type
  result.status = item.status
  result.listFile = item.attachmentIds
  result.channel = item.channel
  return result
}

@Component({
  components: {
    CardInstructionsComponent,
    SlideUpDownWithTitleComponent,
    RequestItemComponent,
    CreateRequestComponent,
    ContactInfoComponent,
    DirectorFeedback,
    ErtInstructionSelect
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
    { id: 'request', name: 'Заявка', label: 'sortbynumber' },
    { id: 'address', name: 'Адрес', label: 'sortbyaddress' },
    { id: 'status', name: 'Статус', label: 'sortbystatus' },
    { id: 'date', name: 'Дата обновления', label: 'sortbydate' }
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

  allRequestList = []
  activeRequestList = []

  currentPage = 1
  totalPages = 0
  allRequestListCount = 0
  itemsPerPage = DEFAULT_REQUESTS_PER_PAGE
  isVisibleDirectorFeedback = false
  listCity = {}
  listOfInstructions = []
  chosenInstruction = {}
  instructionInfo = ''

  @Watch('currentPage')
  onCurrentPageChange () {
    this.$scrollTo('.support-page')
    this.updateAllRequestList()
  }

  @Watch('sortBy')
  onChangeSortBy (value) {
    this.updateAllRequestList()
  }

  @Watch('orderSort')
  onChangeOrderSort (value) {
    this.updateAllRequestList()
  }

  @Watch('chosenInstruction')
  onChosenInstructionValueChange (value) {
    if (value) {
      this.$router.push(`support/instructions/${value.id}`)
    }
  }

  getFetchParams () {
    const payload = {
      pageNumber: this.currentPage
    }

    if (this.orderSort === SORT_DESC) {
      payload.sortOrder = 'DESC'
    }

    if (this.sortBy === 'request') {
      payload.sortBy = SORT_FIELDS.TICKET_NAME
    } else if (this.sortBy === 'status') {
      payload.sortBy = SORT_FIELDS.STATUS
    }

    return payload
  }

  get getListShowRequestByCity () {
    return this.city.reduce((result, item) => result.concat(this.listCity[item]), [])
  }

  /**
   * @deprecated
   * @return {*[]|T[]}
   */
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
    const filteredByActive = mapped
      .filter(item => this.typeFilterRequest === TYPE_FILTER_REQUEST_ACTIVE
        ? !item.cancelledWhen && !item.closedWhen
        : true
      )
    return this.city.length === 0
      ? filteredByActive
      : filteredByActive.filter(item => this.getListShowRequestByCity.includes(item.ticketId))
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

  get allFilteredByCities () {
    return this.allRequestList.filter(this.filterByCities)
  }

  get activeFilteredByCities () {
    return this.activeRequestList.filter(this.filterByCities)
  }

  fetchRequestList (payload) {
    return this.$store.dispatch(`request/${FETCH_REQUEST_LIST}`,
      { api: this.$api, ...payload }
    )
      .then(response => {
        const toNumber = n => parseInt(n, 10)
        if (response.range) {
          // eslint-disable-next-line no-unused-vars
          const [ startIndex, endIndex, totalItems ] = response.range
            .split(/[-/]/)
            .map(toNumber)

          this.allRequestListCount = totalItems
          const delta = totalItems % this.itemsPerPage > 0 ? 1 : 0
          this.totalPages = toNumber(totalItems / this.itemsPerPage) + delta
        }

        this.listRequest = response.request
        return response
      })
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

  filterByCities (requestListItem) {
    return this.city.length === 0
      ? requestListItem
      : this.getListShowRequestByCity.includes(requestListItem.ticketId)
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
    this.$nextTick(() => {
      this.allRequestList = listRequest
        .map(mapRequestItem)
        .filter(item => item.channel.id !== CHANNEL_DMP)
    })
  }

  cancelRequest (e) {
    const { id } = e
    const index = this.listRequest.findIndex(item => item.ticketId === id)
    if (index > -1) {
      this.listRequest[index].cancelledWhen = this.listRequest[index].modifiedWhen = Number(new Date())
    }
  }

  cancellRequest (requestItem) {
    requestItem.cancelledWhen = requestItem.modifiedWhen = Number(new Date())
  }

  onShowDirectorFeedback () {
    this.isVisibleDirectorFeedback = true
  }

  getCurrentRequestList () {
    return this.isActiveFilterRequest(this.getTypeFilterRequestActive) ? this.activeRequestList : this.allRequestList
  }

  setListCity (cities) {
    this.listCity = {
      ...this.listCity,
      ...cities
    }
  }

  updateAllRequestList () {
    this.allRequestList = []

    this.fetchRequestList(this.getFetchParams())
      .then(({ request, cities }) => {
        this.setListRequest(request)
        this.setListCity(cities)
      })
  }

  created () {
    this.updateAllRequestList()

    this.$store.dispatch(`request/${FETCH_ACTIVE_REQUEST_LIST}`,
      { api: this.$api }
    )
      .then(data => {
        this.activeRequestList = data
          .map(mapRequestItem)
          .filter(item => item.channel.id !== CHANNEL_DMP)

        // Следует установить города
        const internalListCity = data.reduce((acc, item) => {
          if (
            item.channel.id === CHANNEL_DMP ||
            !item.hasOwnProperty('city')
          ) return acc
          const cityName = item.city.name
          const ticketId = item.ticket_id
          if (this.listCity.hasOwnProperty(cityName) && !this.listCity[cityName].includes(ticketId)) {
            this.listCity[item.city.name].push(ticketId)
            return acc
          }

          if (!acc.hasOwnProperty(cityName)) {
            acc[cityName] = []
          }

          acc[cityName].push(ticketId)

          return acc
        }, {})

        for (const city in internalListCity) {
          if (!internalListCity.hasOwnProperty(city)) continue
          // Если города нет в "исходном" списке
          if (!this.listCity.hasOwnProperty(city)) {
            this.listCity[city] = internalListCity[city]
          } else {
            this.listCity[city] = uniq(this.listCity[city].concat(internalListCity[city]))
          }
        }
      })
  }

  getInstructions () {
    this.$store.dispatch('instructions/getInstructions')
      .then((response) => {
        this.listOfInstructions = response
        this.getInstructionsLinks()
      })
  }

  getInstructionsLinks () {
    this.listOfInstructions.forEach((category, idx) => {
      this.listOfInstructions[idx].links = []
      this.listOfInstructions[idx].links.push(...category.list.map(instruction => ({ to: `support/instructions/${instruction.id}`, name: instruction.name })))
    })
  }

  mounted () {
    this.getInstructions()
  }

  dataLayerPush = dataLayerPush
}
