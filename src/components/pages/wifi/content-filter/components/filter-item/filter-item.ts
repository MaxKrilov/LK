import { Component, Vue } from 'vue-property-decorator'
import FilterItemActions from './filter-item-actions.vue'
import FilterItemRule from './filter-item-rule.vue'

const components = {
  FilterItemActions,
  FilterItemRule
}

const props = {
  item: {},
  info: {},
  isInfoLoaded: Boolean,
  active: {
    type: Boolean,
    default: false
  }
}

@Component({ components, props })
export default class FilterItem extends Vue {
  isOpened: boolean = false
  activeValue: boolean = true

  get portalNameOne () {
    return `${this._uid}-portal-1`
  }
  get portalNameTwo () {
    return `${this._uid}-portal-2`
  }
  get portalNameThree () {
    return `${this._uid}-portal-3`
  }

  onSomeAction (actionName: string) {
    this.$emit(actionName, this.$props.item.subscription_id)
  }

  onEdit () {
    this.onSomeAction('edit')
  }

  onDelete () {
    this.onSomeAction('delete')
  }

  onToggle () {
    this.onSomeAction('toggle')
  }
}
