import './_style.scss'
import { mapState } from 'vuex'
import { API_DADATA } from '../../../store/actions/api'
import ErSelect from '../ErSelect'
import Highlighter from 'vue-highlight-words'

export default {
  name: 'er-dadata',
  mixins: [ ErSelect ],
  components: {
    Highlighter
  },
  data () {
    return {
      pre: 'er-dadata',
      xhr: null,
      dQuery: this.query || '',
      inputQuery: this.query || '',
      inputFocused: false,
      suggestions: [],
      suggestionIndex: -1,
      suggestionsVisible: true,
      isValid: false
    }
  },
  props: {
    /**
     * Текст placeholder
     */
    placeholder: String,
    /**
     * Начальное значение поля ввода
     */
    query: String,
    /**
     * Если true, то запрос на получение подсказок будет инициирован в фоне сразу, после монтирования компонента
     */
    autoload: Boolean,
    count: Number,
    /**
     * параметр описывающий автозаполнение поля, например street-address, если не задан, будет установлен как off
     */
    autocomplete: String,
    validate: Function,
    className: String,
    disabled: Boolean,
    fromBound: {
      type: String,
      validate: val => ['region', 'area', 'city', 'settlement', 'street', 'house'].includes(val)
    },
    toBound: {
      type: String,
      validate: val => ['region', 'area', 'city', 'settlement', 'street', 'house'].includes(val)
    },
    address: Object,
    trackId: {
      type: String,
      default: 'id'
    }
  },
  computed: {
    ...mapState({ token: state => state.api[API_DADATA] })
  },
  watch: {
    filterMobile () {
      this.fetchSuggestions()
    }
  },
  methods: {
    __getEventsForActivator (on) {
      return Object.assign(
        ErSelect.methods.__getEventsForActivator.call(this, on),
        {
          input: e => {
            this.isOnInput = true
            this.internalValue = e
            this.fetchSuggestions()
          }
        }
      )
    },
    __generateItems () {
      return this.$createElement('div', {
        staticClass: `${this.__getClass()}__items`
      }, this._.isEmpty(this.suggestions)
        ? [
          this.$createElement('div', {
            staticClass: `${this.__getClass()}__item`,
            class: 'not-found'
          }, [this.notFoundText])
        ]
        : this.suggestions.map(item => this.isMobile ? this.generateItemMobile(item) : this.generateItem(item))
      )
    },
    __generateItem (item) {
      return this.$createElement('a', {
        staticClass: `${this.__getClass()}__item`,
        attrs: {
          'data-id': item?.data['fias_id']
        },
        on: {
          click: this.onSelectItem
        }
      }, [
        this.$createElement('Highlighter', {
          props: {
            autoEscape: true,
            searchWords: this.getHighlightWords(),
            textToHighlight: item.value,
            highlightTag: 'b'
          }
        })
      ])
    },
    fetchSuggestions () {
      if (this.xhr) {
        this.xhr.abort()
      }
      this.xhr = new XMLHttpRequest()
      this.xhr.open('POST', 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address?5')
      this.xhr.setRequestHeader('Accept', 'application/json')
      this.xhr.setRequestHeader('Authorization', `Token ${this.token}`)
      this.xhr.setRequestHeader('Content-Type', 'application/json')
      let requestPayload = {
        query: this.isMobile ? this.filterMobile : this.internalValue,
        count: this.count || 5
      }
      if (this.fromBound && this.toBound) {
        if (!this.address) {
          throw new Error('You have to pass address property with DaData address object to connect separate components')
        }
        requestPayload.from_bound = { value: this.fromBound }
        requestPayload.to_bound = { value: this.toBound }
        requestPayload.restrict_value = true
        if (this.address.data) {
          let location = {}
          if (this.address.data.region_fias_id) {
            location.region_fias_id = this.address.data.region_fias_id
          }
          if (this.address.data.city_fias_id) {
            location.city_fias_id = this.address.data.city_fias_id
          }
          if (this.address.data.settlement_fias_id) {
            location.settlement_fias_id = this.address.data.settlement_fias_id
          }
          if (this.address.data.street_fias_id) {
            location.street_fias_id = this.address.data.street_fias_id
          }
          requestPayload.locations = [location]
        }
      }
      this.xhr.send(JSON.stringify(requestPayload))
      this.xhr.onreadystatechange = () => {
        if (!this.xhr || this.xhr.readyState !== 4) return
        if (this.xhr.status === 200) {
          const responseJson = JSON.parse(this.xhr.response)
          if (responseJson && responseJson.suggestions) {
            this.suggestions = responseJson.suggestions
            this.suggestionIndex = -1
          }
        }
      }
    },
    getHighlightWords () {
      const wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д']
      let words = this[this.isMobile ? 'filterMobile' : 'internalValue'].replace(',', '').split(' ')
      words = words.filter(word => !~wordsToPass.indexOf(word))
      return words
    },
    onSelectItem (e) {
      const id = e.target.closest('a').dataset.id
      const result = this.suggestions.find(item => id === item.data['fias_id'])
      if (!result) {
        throw new Error('Unknow error')
      }
      this.$emit('input', result)
      this.isOpenDialog = false
      this.isSelected = true
      this.filterMobile = ''
    }
  },
  mounted () {
    if (this.autoload && this.dQuery) {
      this.fetchSuggestions()
    }
  }
}
