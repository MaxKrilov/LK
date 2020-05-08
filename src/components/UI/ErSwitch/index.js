import { Vue, Component } from 'vue-property-decorator'
import './_style.scss'

@Component({
  props: {
    labels: {
      type: Array,
      default: () => ([])
    },
    name: String,
    value: null
  }
})
export default class ErSwitch extends Vue {
  get computedTranslateX () {
    return this.computedIndexChecked * 100
  }
  get computedWidthSelection () {
    return `calc(${100 / (this.labels.length || 1)}% - 3px)`
  }
  get computedIndexChecked () {
    return this.labels.findIndex(item => item.value === this.value) || 0
  }
  render (h) {
    return (
      <div class="er-switch">
        <span
          class="er-switch__selection"
          style={{
            width: this.computedWidthSelection,
            transform: `translateX(${this.computedTranslateX}%)`
          }}
        />
        {
          this.labels.map((item, index) => (
            <label key={index} class={item?.disabled ? 'is-disabled' : ''}>
              <input
                type="radio"
                name={this.name}
                disabled={item?.disabled}
                checked={this.value === item.value}
                onChange={() => this.onChange(item.value)}
              />
              <span class="er-switch__toggle--outer">
                <span class="er-switch__toggle--inner">
                  <er-icon name={'ok'}/>
                </span>
              </span>
              <span class="er-switch__text">{item.label}</span>
            </label>
          ))
        }
      </div>
    )
  }
  onChange (value) {
    this.$emit('input', value)
  }
}
