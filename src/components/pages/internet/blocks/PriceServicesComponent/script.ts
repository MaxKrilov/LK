import { Vue, Component } from 'vue-property-decorator'

@Component
export default class PriceServicesComponent extends Vue {
  isOpenList = false

  toggleList () {
    this.isOpenList = !this.isOpenList
  }
}
