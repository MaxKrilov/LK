import { Vue, Component, Prop } from 'vue-property-decorator'

const components = {}
@Component({ components })
export default class BlacklistRow extends Vue {
  @Prop({ type: String, default: '' }) readonly id!: string
  @Prop({ type: String, default: '' }) readonly phone!: string
  @Prop({ type: String, default: '' }) readonly comment!: string

  onDelete () {
    this.$emit('delete')
  }

  onChange (payload: object) {
    this.$emit('change', payload)
  }

  onPhoneChange (value: string): void {
    const payload = {
      id: this.id,
      phone: value,
      comment:
      this.comment
    }

    this.onChange(payload)
  }

  onCommentChange (value: string) {
    const payload = {
      id: this.id,
      phone: value,
      comment:
      this.comment
    }

    this.$emit('change', payload)
  }
}
