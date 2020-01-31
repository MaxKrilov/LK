import ErTextarea from '../../UI/ErTextarea'
import './style.scss'

export default {
  name: 'er-textarea-with-file',
  data: () => ({
    childPre: 'er-textarea-with-file',
    fileName: ''
  }),
  mixins: [
    ErTextarea
  ],
  methods: {
    generateTextFieldSlot () {
      return this.$createElement('div', {
        staticClass: `${this.pre}__slot`
      }, [
        this.generateInput(),
        this.generateLabel(),
        this.isShowSuccess && this.isSuccess && this.generateSuccessIcon(),
        this.labelChanged && this.generateLabelChanged(),
        this.generateFileInput()
      ])
    },
    generateFileInput () {
      const id = `${this.pre}__file-input__${this._uid}`
      return this.$createElement('div', {
        staticClass: `${this.childPre}__file-input`
      }, [
        this.$createElement('input', {
          attrs: { type: 'file', id },
          on: {
            change: this.onChange
          }
        }),
        this.$createElement('label', {
          attrs: { for: id }
        }, [
          this.$createElement('er-icon', { props: { name: 'husks' } }),
          this.$createElement('span', {}, this.fileName || 'Прикрепить')
        ])
      ])
    },
    onChange (e) {
      this.fileName = e?.target?.files[0]?.name
      toBase64(e.target.files[0])
        .then(result => {
          this.$emit('file-append', result)
        })
      // todo Сделать нужную обработку файла после того, как будет известно, в каком формате будем отправлять файл
    }
  }
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
})
