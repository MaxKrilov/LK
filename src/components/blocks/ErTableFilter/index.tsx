import './_style.scss'
import Vue, { CreateElement, VNode } from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    title: String,
    value: Boolean,
    order: {
      type: String,
      default: 'asc'
    }
  }
})
export default class ErTableFilter extends Vue {
  // Props
  readonly title!: string
  readonly value!: boolean
  readonly order!: 'asc' | 'desc'
  // Methods
  setFilter () {
    if (!this.value) {
      this.$emit('change-filter', 'asc')
    } else {
      this.$emit('change-filter', this.order === 'asc' ? 'desc' : 'asc')
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <button class={[
        'er-table-filter',
        {
          'sort': this.value,
          'desc': this.order === 'desc'
        }
      ]}
      onClick={() => this.setFilter()}
      >
        <span class={'icon'}>
          <er-icon name={'funnel'} />
        </span>
        <span class={'title'}>{ this.title }</span>
      </button>
    )
  }
}
