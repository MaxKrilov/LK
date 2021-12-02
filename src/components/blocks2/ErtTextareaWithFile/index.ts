import './style.scss'

import Component from 'vue-class-component'
import ErtTextarea from '@/components/UI2/ErtTextarea'
import ErtIcon from '@/components/UI2/ErtIcon'

function returnFileSize (number: number) {
  if (number < 1024) {
    return number + 'б'
  } else if (number > 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + 'КБ'
  } else if (number > 1048576) {
    return (number / 1048576).toFixed(1) + 'МБ'
  }
}

const MAX_FILE_COUNT = 10

@Component({
  props: {
    maxFileSize: [Number, String]
  }
})
export default class ErtTextareaWithFile extends ErtTextarea {
  $refs!: typeof ErtTextarea.options.$refs & {
    'file-input': HTMLInputElement
  }

  readonly maxFileSize!: number | string

  listFile: File[] = []

  get classes (): object {
    return {
      ...ErtTextarea.options.computed.classes.get.call(this),
      'ert-textarea-with-file': true
    }
  }

  get fileInputID () {
    return `ert-textarea-with-file__${this._uid}`
  }

  get allowsFileFormat () {
    return '.doc, .docx, .pdf, .csv, .xls, .xslx, .jpeg, .jpg, .gif, .png, .tiff, .bmp'
  }

  get allowsFileFormatRegExp () {
    return /(\.doc|\.docx|\.pdf|\.csv|\.xls|\.xslx|\.jpeg|\.jpg|\.gif|\.png|\.tiff|\.bmp)$/i
  }

  genDefaultSlot () {
    const children = ErtTextarea.options.methods.genDefaultSlot.call(this)

    return [
      ...children,
      this.genFileField()
    ]
  }

  genInput () {
    const input = ErtTextarea.options.methods.genInput.call(this)

    input!.data.on.paste = this.pasteHandler

    return input
  }

  genFileField () {
    return this.$createElement('div', {
      staticClass: 'ert-textarea-with-file__file-field'
    }, [
      this.genListFile(),
      this.genFileInput()
    ])
  }

  genFileInput () {
    if (this.listFile.length >= MAX_FILE_COUNT) return null

    return this.$createElement('div', {
      staticClass: 'ert-textarea-with-file__file-input'
    }, [
      this.$createElement('input', {
        attrs: {
          type: 'file',
          id: this.fileInputID,
          accept: this.allowsFileFormat,
          multiple: true,
          'data-ga-category': 'support',
          'data-ga-label': 'appaddfile'
        },
        on: {
          change: this.onChangeFileInput
        },
        ref: 'file-input'
      }),
      this.$createElement('label', {
        attrs: {
          for: this.fileInputID
        }
      }, [
        this.$createElement(ErtIcon, {
          props: {
            name: 'husks'
          }
        }),
        this.$createElement('span', 'Добавить файл')
      ])
    ])
  }

  genListFile () {
    return this.$createElement('div', {
      staticClass: 'ert-textarea-with-file__list-file'
    }, this.listFile.map(this.genFileItem))
  }

  genFileItem (file: File, index: number) {
    return this.$createElement('div', {
      staticClass: 'ert-textarea-with-file__file-item',
      key: index
    }, [
      this.$createElement('span', {
        staticClass: 'file-name'
      }, file.name),
      this.$createElement('button', {
        staticClass: 'remove-file',
        on: {
          click: () => { this.onRemoveFile(index) }
        }
      }, [this.$createElement(ErtIcon, {
        props: {
          name: 'close',
          small: true
        }
      })])
    ])
  }

  onChangeFileInput (e: InputEvent) {
    const listFile = [...(e.target as HTMLInputElement).files || []]

    this.addFiles(listFile)
  }

  onRemoveFile (index: number) {
    this.listFile.splice(index, 1)
    this.$emit('change:remove', index)
  }

  addFiles (listFile: File[]) {
    const filterListFileByFormat = listFile.filter(file => this.allowsFileFormatRegExp.exec(file.name))
    const filterListFileBySize = this.maxFileSize
      ? filterListFileByFormat.filter(file => file.size < parseInt(this.maxFileSize))
      : filterListFileByFormat
    const filterListFileByCount = this.listFile.length + filterListFileBySize.length > MAX_FILE_COUNT
      ? filterListFileBySize
      : filterListFileBySize.slice(0, MAX_FILE_COUNT - this.listFile.length)

    if (!listFile.every(file => this.allowsFileFormatRegExp.exec(file.name))) {
      this.$emit('change:error', 'Некоторые файлы имеют некорректный формат. Были добавлены не все файлы')
    }
    if (this.maxFileSize && !listFile.every(file => file.size < parseInt(this.maxFileSize))) {
      this.$emit('change:error', `Размер некоторых файлов превышает ${returnFileSize(parseInt(this.maxFileSize))}. Были добавлены не все файлы`)
    }
    if (this.listFile.length + filterListFileBySize.length > MAX_FILE_COUNT) {
      this.$emit('change:error', `Максимальное количество файлов: ${MAX_FILE_COUNT}. Были добавлены не все файлы`)
    }

    if (filterListFileByCount.length > 0) {
      this.listFile.push(...listFile)
      this.$emit('change:add', listFile)
    }
  }

  pasteHandler (e: Event) {
    if (!this.isFocused) return
    if ((e as ClipboardEvent).clipboardData) {
      const items = (e as ClipboardEvent).clipboardData!.items

      if (items) {
        for (let i = 0; i < items.length; i++) {
          const file = items[i].getAsFile()

          if (file) {
            this.addFiles([file])
          }
        }
      }
    }
  }

  mounted () {
    if (document.querySelector('.contenteditable')) return
    if (!window.Clipboard) {
      const pasteCatcher = document.createElement('div')
      // Firefox вставляет все изображения в элементы с contenteditable
      pasteCatcher.setAttribute('contenteditable', '')
      pasteCatcher.classList.add('contenteditable')

      pasteCatcher.style.display = 'none'
      document.body.appendChild(pasteCatcher)

      // элемент должен быть в фокусе
      pasteCatcher.focus()
      document.addEventListener('click', function () {
        pasteCatcher.focus()
      })
    }
  }
}
