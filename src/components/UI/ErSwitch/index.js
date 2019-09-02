import './_style.scss'

export default {
  name: 'er-switch',
  data: () => ({
    pre: 'er-switch'
  }),
  props: {
    labels: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      default: function () {
        return `er-switch__${this._uid}`
      }
    },
    value: null
  },
  methods: {
    toggle (event) {
      this.$emit('input', event.target.value)
    }
  },
  render (h) {
    return (
      <ul class={this.pre}>
        {
          this.labels.map(label => (
            <li class={`${this.pre}__item`}>
              <input
                type="radio"
                value={label.value}
                id={`${this.id}--${label.value}`}
                name={this.name}
                vOn:change={this.toggle}
                checked={this.value === label.value}
                class={`${this.pre}__input`}
              />
              <label
                for={`${this.id}--${label.value}`}
                class={`${this.pre}__label`}
              >
                <span class={`${this.pre}__toggle__wrapper`}>
                  <span class={`${this.pre}__toggle`}>
                    <er-icon name="ok" />
                  </span>
                </span>
                {label.label}
              </label>
            </li>
          ))
        }
      </ul>
    )
  }
}
