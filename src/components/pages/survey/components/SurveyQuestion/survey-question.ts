import { Vue, Component, Prop } from 'vue-property-decorator'
import { isTextQuestion } from '@/functions/survey.ts'

@Component
export default class SurveyQuestion extends Vue {
  @Prop([String, Number]) readonly id!: string | number
  @Prop(String) readonly title!: string
  @Prop({ type: Array, default: () => [] }) readonly variants!: any[]
  @Prop(String) readonly type!: string

  text: string = ''

  get isTextQuestion (): boolean {
    return isTextQuestion(this.type)
  }

  onInput (variant: any): void {
    this.$emit('selected', variant)
  }

  onInputText (value: string): void {
    this.$emit('input-text', value)
  }
}
