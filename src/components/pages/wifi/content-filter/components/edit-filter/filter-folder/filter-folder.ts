import { Vue, Component } from 'vue-property-decorator'

const props = {
  title: String,
  value: Boolean,
  totalCount: Number,
  count: Number,
  isLoaded: {
    type: Boolean,
    default: true
  }
}

@Component({ name: 'filter-folder', props })
export default class WifiFilterEdit extends Vue {
  name = 'content-filter-folder'
  isOpened: boolean = false

  onToggle () {
    this.isOpened = !this.isOpened
  }
}
