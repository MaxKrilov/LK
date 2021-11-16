import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TBodyCollapser extends Vue {
  @Prop(Number) readonly columns!: number
  @Prop(String) readonly title!: string
  @Prop(Boolean) readonly startOpened!: boolean

  isVisible = this.startOpened

  onToggle () {
    this.isVisible = !this.isVisible
  }
}
