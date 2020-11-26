import ErTextarea from '../../UI/ErTextarea'
import './style.scss'

function returnFileSize (number) {
  if (number < 1024) {
    return number + 'bytes'
  } else if (number > 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'KB'
  } else if (number > 1048576) {
    return (number / 1048576).toFixed(1) + 'MB'
  }
}

export default {
  name: 'er-textarea-with-file',
  props: {
    maxFileSize: [Number, String]
  },
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
          attrs: {
            type: 'file',
            id,
            accept: '.doc, .docx, .pdf, .csv, .xls, .xslx, .jpeg, .jpg, .gif, .png, .tiff, .bmp'
          },
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
      const file = e.target.files[0]
      const allowedExtensions = /(\.doc|\.docx|\.pdf|\.csv|\.xls|\.xslx|\.jpeg|\.jpg|\.gif|\.png|\.tiff|\.bmp)$/i
      this.messages.pop()
      if (file) {
        if (!allowedExtensions.exec(file.name)) {
          this.messages.push(`Некорректный формат файла`)
        } else if (this.maxFileSize && file.size > parseInt(this.maxFileSize)) {
          this.messages.push(`Размер файла не должен превышать ${returnFileSize(parseInt(this.maxFileSize))}`)
        } else {
          this.fileName = e?.target?.files[0]?.name
          this.$emit('file-append', e.target.files[0])
        }
      }
    }
  }
}
