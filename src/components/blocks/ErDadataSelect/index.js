import { Vue, Component, Watch } from 'vue-property-decorator'
import ErSelect from '../../UI/ErSelect'
import { mapState } from 'vuex'
import { API_DADATA } from '../../../store/actions/api'

@Component({
  computed: {
    ...mapState({
      token: state => state.api[API_DADATA]
    })
  }
})
export default class ErDadataSelect extends ErSelect {
  internalItems = []
  /**
   * @type {XMLHttpRequest}
   */
  xhr = null

  @Watch('internalSearch')
  onInternalValueChange (val) {
    if (val !== '') {
      this.fetchSuggestion()
    }
  }

  generateEmptyItem () {
    return this.$createElement('div', {
      staticClass: 'er-select__item'
    }, [
      this.$createElement('div', {
        staticClass: 'er-select__item--inner',
        class: 'empty'
      }, [
        this.internalSearch !== ''
          ? this.notFoundText
          : 'Введите информацию'
      ])
    ])
  }

  generateListItem () {
    return this.internalItems.map((item, i) => this.generateItem(item, i))
  }

  fetchSuggestion () {
    if (this.xhr) {
      this.xhr.abort()
    }
    this.xhr = new XMLHttpRequest()
    this.xhr.open('POST', 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address?5')
    this.xhr.setRequestHeader('Accept', 'application/json')
    this.xhr.setRequestHeader('Authorization', `Token ${this.token}`)
    this.xhr.setRequestHeader('Content-Type', 'application/json')
    const requestPayload = {
      query: this.internalSearch,
      count: 5
    }
    this.xhr.send(JSON.stringify(requestPayload))
    this.xhr.onreadystatechange = () => {
      if (!this.xhr || this.xhr.readyState !== 4) return
      if (this.xhr.status === 200) {
        const responseJson = JSON.parse(this.xhr.response)
        this.internalItems = responseJson.suggestions
      }
    }
  }
}
