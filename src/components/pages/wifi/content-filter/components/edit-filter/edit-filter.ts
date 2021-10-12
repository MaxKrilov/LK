import { Component, Mixins, Watch } from 'vue-property-decorator'
import FilterFolder from './filter-folder/index.vue'
import LocationSelect from '../location-select/index.vue'
import ErListSection from '@/components/blocks/ErListSection/index.vue'
import { IPointItem } from '@/interfaces/point'
import WifiContentFilterPageMixin from '@/components/pages/wifi/content-filter/WifiContentFilterPageMixin'
import { FILTER_ALLOW_TYPE, FILTER_BLOCK_TYPE } from '@/constants/wifi-filter'
import { ErtPageWithDialogsMixin } from '@/mixins2/ErtPageWithDialogsMixin'
import AddressCheckbox from '@/components/pages/wifi/content-filter/components/address-checkbox/index.vue'

const components = {
  AddressCheckbox,
  FilterFolder,
  LocationSelect,
  ErListSection
}
const props = {
  create: Boolean,
  id: String
}

interface IUrl {
  // eslint-disable-next-line camelcase
  url_id: string
  value: string
  isNew?: boolean
}

const TOP_MENU_HEIGHT = -70
const SCROLL_TO_DELAY = 500
const urlWithId = (id: string) => (url: IUrl) => url.url_id === id

const MESSAGES = {
  NEED_ONE_OR_MORE_URL: 'Необходимо указать хотя бы один URL',
  TITLE_IS_EMPTY: 'Название не может быть пустым',
  DESCRIPTION_IS_EMPTY: 'Описание не может быть пустым',
  NEED_ONE_OR_MORE_SUBSCRIPTION: 'Нужно подключить хотя бы одну категорию',
  UNKNOWN_ERROR: 'При заказе произошла ошибка, обратитесь к вашему персональному менеджеру'
}

@Component({ components, props })
export default class WifiFilterEdit extends Mixins(WifiContentFilterPageMixin, ErtPageWithDialogsMixin) {
  stateList = [
    'loading',
    'create',
    'edit',
    'not-found'
  ]

  title: string = ''
  description: string = ''
  isAllowList: boolean = false

  selectedLocations: [] = []
  enabledFilters: Record<string, any> = {}

  urlExist: IUrl[] = []
  urlToAdd: IUrl[] = []
  urlToDelete: IUrl[] = []
  urlError: string = MESSAGES.NEED_ONE_OR_MORE_URL

  isLocationsLoaded: boolean = false
  isPublicSubsLoaded: boolean = false

  titleErrorMessages: string[] = []
  descriptionErrorMessages: string[] = []
  urlErrorMessages: string[] = []

  get urlList () {
    return [...this.urlExist, ...this.urlToAdd]
  }

  get addressList () {
    return this.pointList.map((el: IPointItem) => {
      return {
        label: el.fulladdress,
        bpi: el.bpi
      }
    })
  }

  get filterList () {
    return this.$store.state.wifiFilter.addFilterList
  }

  get pageActionLabel () {
    return this.activeState === 'create'
      ? 'Создать фильтр'
      : 'Изменить фильтр'
  }

  get pageTitle () {
    return this.activeState === 'create'
      ? 'Создать новый фильтр'
      : 'Редактировать фильтр'
  }

  get currentLocationBpi () {
    const location = this.pointList.find((el: any) => el.bpi === this.selectedLocations)

    return location?.bpi
  }

  get currentLocationVlan () {
    return this.getVlanByBPI(this.currentLocationBpi)
  }

  get payload () {
    return {
      city_id: this.cityId,
      subscription_name: this.title,
      description: this.description,
      public_subscriptions: this.publicSubscriptions
    }
  }

  get publicSubscriptions () {
    return Object.keys(this.enabledFilters).filter(
      (el: any) => this.enabledFilters[el]
    )
  }

  get isUrlListEmpty () {
    return this.urlList.length
      ? !this.urlList[0].value.length
      : true
  }

  get cleanUrlToAdd () {
    return this.urlToAdd.filter(el => el.value.length)
  }

  get nextEmptyUrl (): IUrl {
    return {
      value: '',
      isNew: true,
      url_id: `new-${Object.keys(this.urlList).length}`
    }
  }

  getVlanByBPI (bpi: any) {
    return this.$store.state.wifiFilter.vlan
      // @ts-ignore
      .find(({ bpiId }) => bpiId === bpi)
      ?.vlan?.[0]
  }

  @Watch('enabledFilters')
  onEnabledFilters () {
    // pass
  }

  hasPointFilter (bpi: string) {
    /*
    let hasFilter = false

    const vlan = this.$store.state.wifiFilter.vlan
      .find((el: any) => el.bpi_id === bpi)?.vlan?.[0]

    console.log('vlan?', vlan)

    if (vlan) {
      console.log('vlan!', vlan)
      this.$store.dispatch('wifiFilter/getClientSubscrsByVLAN', {
        city_id: vlan.cityId,
        vlan: vlan.number
      }).then(data => {
        console.log('filters?', data)
        if (data?.terminal_resource?.row?.length) {
          console.log('yes')
          hasFilter = true
        }
      })
    }

    return hasFilter
    */
    return !bpi
  }

  fetchData () {
    this.initData()
  }

  initData () {
    if (this.$props.create) {
      this.setState('create')
      this.fetchAllData()
    } else { // edit mode
      this.$store.dispatch('wifiFilter/getSubscriptionInfo', this.$props.id)
        .then(data => {
          this.title = data.subscription_name
          this.description = data.description
          this.isAllowList = data.subscription_type_id === FILTER_ALLOW_TYPE.toString()

          if (data.subscriptions && data.subscriptions.subscription) {
            this.enabledFilters = data.subscriptions.subscription.reduce(
              (acc: any, item: any) => {
                return { ...acc, [item.subscription_id]: item['is_active'] === '1' }
              }, {}
            )
          }

          if (data['url_list'] && data['url_list'].url) {
            // @ts-ignore
            this.urlExist = [...data['url_list'].url]
          }

          this.fetchAllData()
          this.setState('edit')
        })
        .catch(errorMessage => {
          this.setState('not-found')
          console.error(errorMessage)
        })
    }
  }

  fetchAllData () {
    this.$store.dispatch('wifiFilter/pullAvailableSubscriptions')
    this.$store.dispatch('wifiFilter/pullAdditPublicSubscriptions')
      .then(() => {
        this.isPublicSubsLoaded = true
      })

    this.pullLocations()
      .then(() => {
        this.pullVlan()
          .then(() => {
            this.isLocationsLoaded = true
          })
      })
  }

  getCategoryValue (categoryName: string) {
    const category = this.filterList.find((el: any) => el.category_name === categoryName)
    return category.items.every((el: any) => {
      // @ts-ignore
      return this.enabledFilters?.[el.subscription_id] || false
    })
  }

  getEnabledFilterCount (list: []) {
    // @ts-ignore
    return list.filter(el => this.enabledFilters?.[el.subscription_id]).length
  }

  onToggleSubFilter (status: boolean, subscriptionId: string) {
    if (status) {
      this.$store.dispatch('wifiFilter/getSubscriptionInfo', subscriptionId)
    }
  }

  onCancel () {
    this.$router.push({ name: 'wifi-content-filter' })
  }

  onSave () {
    let saveAction!: Function

    this.onValidateForm()
      .then(() => {
        if (this.activeState === 'create') {
          saveAction = this.createSubscription
        } else {
          saveAction = this.updateSubscription
        }
        saveAction()
          .catch(() => {
            this.onError({ message: MESSAGES.UNKNOWN_ERROR, title: 'Ошибка' })
            throw new Error('неизвестная ошибка')
          })
          .then((response: any) => {
            if (response === 'Ok') {
              this.$router.push({ name: 'wifi-content-filter' })
            }
          })
      })
  }

  cleanupUrlList () {
    this.$set(this, 'urlToAdd', this.cleanUrlToAdd)
  }

  cleanupFieldErrors () {
    this.titleErrorMessages = []
    this.descriptionErrorMessages = []
    this.urlErrorMessages = []
    this.cleanupUrlList()
  }

  onValidateForm () {
    this.cleanupFieldErrors()

    return new Promise((resolve, reject) => {
      if (!this.title.length) {
        this.titleErrorMessages.push(MESSAGES.TITLE_IS_EMPTY)

        this.$scrollTo(
          // @ts-ignore
          this.$refs.titleField.$el,
          SCROLL_TO_DELAY,
          { offset: TOP_MENU_HEIGHT }
        )
        reject(MESSAGES.TITLE_IS_EMPTY)
      } else if (!this.description.length) {
        this.descriptionErrorMessages.push(MESSAGES.DESCRIPTION_IS_EMPTY)

        this.$scrollTo(
          // @ts-ignore
          this.$refs.descriptionField.$el,
          SCROLL_TO_DELAY,
          { offset: TOP_MENU_HEIGHT }
        )
        reject(MESSAGES.DESCRIPTION_IS_EMPTY)
      } else if (this.isAllowList && this.isUrlListEmpty) {
        this.urlToAdd.push(this.nextEmptyUrl)
        this.urlErrorMessages.push(MESSAGES.NEED_ONE_OR_MORE_URL)
        this.$scrollTo(
          // @ts-ignore
          this.$refs.urlSection.$el,
          SCROLL_TO_DELAY,
          { offset: TOP_MENU_HEIGHT }
        )
        reject(MESSAGES.NEED_ONE_OR_MORE_URL)
      } else if (!this.isAllowList && !this.publicSubscriptions.length) {
        this.$scrollTo(
          // @ts-ignore
          this.$refs.registrySection.$el,
          SCROLL_TO_DELAY,
          { offset: TOP_MENU_HEIGHT }
        )
        reject(MESSAGES.NEED_ONE_OR_MORE_SUBSCRIPTION)
      } else {
        resolve()
      }
    })
  }

  get selectedVlanNumbers () {
    return this.selectedLocations.map(
      bpi => this.getVlanByBPI(bpi).number
    ).join(';')
  }

  get cityId () {
    // @ts-ignore
    const firstSelectedLocationBPI = this.selectedLocations?.[0] || ''

    const location = this.$store.getters['wifiFilter/vlanByBPI'](firstSelectedLocationBPI)?.[0]?.vlan
    return this.$props.create
      // это для создания фильтра на выбранной точке
      ? location?.[0]?.cityId || ''
      // это для редактирования фильтра
      : this.$store.getters['wifiFilter/firstVlan'] // TODO: переделать
  }

  createSubscription () {
    const vlans = this.selectedVlanNumbers

    const createPayload = {
      ...this.payload,
      city_id: this.cityId,
      subscription_type_id: this.isAllowList ? FILTER_ALLOW_TYPE : FILTER_BLOCK_TYPE,
      vlans,
      url: this.urlToAdd.map(el => el.value)
    }
    return this.$store.dispatch('wifiFilter/addSubscription', createPayload)
  }

  updateSubscription () {
    this.urlToDelete.forEach(el => {
      this.$store.dispatch('wifiFilter/deleteUrlInSubscription', el.url_id)
    })

    this.urlToAdd.forEach(el => {
      this.$store.dispatch('wifiFilter/addUrlToSubscription', {
        subscription_id: this.$props.id,
        url: el.value
      })
    })

    const editData = {
      ...this.payload,
      subscription_id: this.$props.id
    }

    return this.$store.dispatch('wifiFilter/editSubscription', editData)
  }

  onLocationSelect (value: boolean, bpi: string) {
    let newSelecteLocations = []
    if (value) {
      newSelecteLocations = [...this.selectedLocations, bpi]
    } else {
      newSelecteLocations = this.selectedLocations.filter(el => el !== bpi)
    }

    this.$set(this, 'selectedLocations', newSelecteLocations)
  }

  onChangeCategory (status: boolean, categoryName: any) {
    this.filterList
      .find((el: any) => el.category_name === categoryName)
      .items.forEach(
      // @ts-ignore
      // eslint-disable-next-line camelcase
        ({ subscription_id }) => {
          this.$set(this.enabledFilters, subscription_id, status)
        }
      )
  }

  onRemoveUrl (id: string) {
    const targetUrl = this.urlList.find(urlWithId(id))

    if (targetUrl && targetUrl.isNew) {
      const idx = this.urlToAdd.findIndex(urlWithId(id))
      this.urlToAdd.splice(idx, 1)
    } else if (targetUrl) {
      const idx = this.urlExist.findIndex(urlWithId(id))
      this.urlExist.splice(idx, 1)
      this.urlToDelete.push(targetUrl)
    }
  }

  onAddUrl () {
    this.urlToAdd.push(this.nextEmptyUrl)
  }

  onChangeUrl (id: string, url: string) {
    this.urlList.filter(urlWithId(id))
      .forEach((el: IUrl) => {
        el.value = url
      })
  }
}
