import './_style.scss'

export default {
  name: 'er-file-input',
  data: () => ({
    pre: 'er-file-input',
    file: null
  }),
  props: {
    id: {
      type: String,
      default: function () {
        return `er-file-input__${this._uid}`
      }
    },
    label: {
      type: String,
      default: 'Выберите файл'
    },
    value: null
  },
  methods: {
    onChange (e) {
      this.file = this._.head(e.target.files)
      this.convertToBase64(this.file)
        .then(result => {
          this.$emit('input', result)
        })
    },
    convertToBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    cancelDocument () {
      this.file = null
      this.$emit('input', null)
    }
  },
  render (h) {
    return (
      <div class={this.pre}>
        <input id={this.id} type="file" onChange={this.onChange}/>
        {
          this.file?.name
            ? (
              <div class={`${this.pre}__filename`}>
                { this.file.name }
                <div class={`${this.pre}__cancel`} onClick={this.cancelDocument}>
                  <er-icon name="cancel" />
                </div>
              </div>
            )
            : (
              <label for={this.id}>
                { this.label }
              </label>
            )
        }
      </div>
    )
  }
}
