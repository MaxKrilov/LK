import Vue from 'vue'
import Component from 'vue-class-component'

import { mapState } from 'vuex'
import { SCREEN_WIDTH } from '@/store/actions/variables'
import { BREAKPOINT_MD } from '@/constants/breakpoint'

import { IColor } from '@/types'
import { fromHex } from '@/components/UI2/ErtColorPicker/util'
import { Hex } from '@/utils/colorUtils'

import { fileName as fileNameFormatted } from '@/functions/filters'

import { head } from 'lodash'

const white = fromHex('#FFFFFF')

const MAX_SIZE_BYTES = 300 * 1024

@Component<InstanceType<typeof ErtWifiPersonalizationDialogBackground>>({
  filters: {
    fileNameFormatted
  },
  props: {
    value: Boolean,
    customBodyStyle: [Object, Boolean],
    backgroundImage: [String, Boolean],
    banner: [String, Boolean],
    isFullscreen: Boolean
  },
  computed: {
    ...mapState({
      screenWidth: (state: any) => state.variables[SCREEN_WIDTH]
    })
  },
  watch: {
    value (val: boolean) {
      this.lazyValue = val
    },
    backgroundColorHex (val: Hex) {
      this.backgroundColor = fromHex(val)
    },
    colorText (val) {
      if (val.length > 1) {
        this.colorText = val.slice(1)
      }
    },
    customBodyStyle (val) {
      if (typeof val !== 'boolean') {
        this.backgroundColor = fromHex(val.backgroundColor)
        this.colorText = [val.color]
      }
    },
    backgroundColor (val) {
      this.backgroundColorHex = val.hex
    },
    backgroundImage (val) {
      this.lazyBackgroundImage = val
    },
    banner (val) {
      this.lazyBanner = val
    },
    isFullscreen (val) {
      this.lazyIsFullscreen = val
    }
  }
})
export default class ErtWifiPersonalizationDialogBackground extends Vue {
  // Options
  $refs!: {
    'file-background-image': HTMLInputElement,
    'file-banner': HTMLInputElement,
  }

  // Props
  readonly value!: boolean
  readonly customBodyStyle!: { backgroundColor: string, color: string } | false
  readonly backgroundImage!: string | false
  readonly banner!: string | false
  readonly isFullscreen!: boolean

  // Data
  lazyValue: boolean = this.value
  backgroundColor: IColor = typeof this.customBodyStyle !== 'boolean'
    ? fromHex(this.customBodyStyle.backgroundColor)
    : white
  backgroundColorHex: Hex = this.backgroundColor.hex
  isShowColorPicker: boolean = false
  colorText: string[] = typeof this.customBodyStyle !== 'boolean'
    ? [this.customBodyStyle.color]
    : ['black']

  /// Errors
  errorLoadedBackgroundImage = ''
  errorLoadedBanner = ''

  /// Lazy Data
  lazyBackgroundImage = this.backgroundImage
  lazyBanner = this.banner
  lazyIsFullscreen = this.isFullscreen

  /// Internal Background Image
  backgroundImageFile: File | null = null
  backgroundImageBase64: string = ''

  /// Internal Banner
  bannerFile: File | null = null
  bannerBase64: string = ''

  // Vuex
  readonly screenWidth!: number

  // Computed
  get internalValue (): boolean {
    return this.lazyValue
  }

  set internalValue (val: boolean) {
    this.lazyValue = val

    this.$emit('input', val)
  }

  get isFullscreenDialog () {
    return this.screenWidth < BREAKPOINT_MD
  }

  get computedTransition () {
    return this.isFullscreenDialog ? 'dialog-bottom-transition' : 'dialog-transition'
  }

  get computedMaxWidth () {
    return this.isFullscreenDialog ? 'none' : 680
  }

  get issetServerBackgroundImage () {
    return !!this.lazyBackgroundImage
  }

  get issetServerBanner () {
    return !!this.lazyBanner
  }

  get previewStyles () {
    return (this.backgroundImageFile || this.lazyBackgroundImage) && this.lazyIsFullscreen
      ? { backgroundImage: `url(${this.backgroundImageFile ? this.backgroundImageBase64 : this.lazyBackgroundImage})` }
      : { backgroundColor: this.backgroundColor.hex }
  }

  get getBannerPreviewStyles () {
    return (this.backgroundImageFile || this.lazyBackgroundImage) && !this.lazyIsFullscreen
      ? { backgroundImage: `url(${this.backgroundImageFile ? this.backgroundImageBase64 : this.lazyBackgroundImage})` }
      : { backgroundColor: (this.backgroundImageFile || this.lazyBackgroundImage) ? 'transparent' : this.backgroundColor.hex }
  }

  // Methods
  onCloseDialog () {
    this.internalValue = false
  }

  onOpenColorPicker () {
    this.isShowColorPicker = true
  }

  assignmentBackgroundImage (file: File) {
    return new Promise((resolve, reject) => {
      if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
        reject('Неверный формат файла')
        return
      }
      if (file.size > MAX_SIZE_BYTES) {
        reject('Размер изображения не должен превышать 300 Кб')
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        const result = reader.result
        if (typeof result !== 'string') {
          reject('Произошла неизвестная ошибка')
          return
        }
        const img = new Image()
        img.src = result

        img.addEventListener('load', () => {
          if (
            (img.width < 1024 || img.width > 1920) ||
            (img.height < 300 || img.height > 1080)
          ) {
            reject('Формат изображения должен быть не менее 1024х300 и не более 1920х1080')
          } else {
            this.backgroundImageFile = file
            this.backgroundImageBase64 = result as string

            this.errorLoadedBackgroundImage = ''
            resolve()
          }
        })
      })
    })
  }

  onLoadBackgroundImage (e: InputEvent) {
    if (
      e.target &&
      (e.target as HTMLInputElement).files !== null &&
      (e.target as HTMLInputElement).files!.length > 0) {
      this.assignmentBackgroundImage((e.target as HTMLInputElement).files![0])
        .catch(error => {
          this.errorLoadedBackgroundImage = error
        })
    }
  }

  assignmentBanner (file: File) {
    return new Promise((resolve, reject) => {
      if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
        reject('Неверный формат файла')
        return
      }
      if (file.size > MAX_SIZE_BYTES) {
        reject('Размер изображения не должен превышать 300 Кб')
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        const result = reader.result
        if (typeof result !== 'string') {
          reject('Произошла неизвестная ошибка')
          return
        }
        const img = new Image()
        img.src = result

        img.addEventListener('load', () => {
          if (
            (img.width < 1024 || img.width > 1920) ||
            (img.height < 300 || img.height > 1080)
          ) {
            reject('Формат изображения должен быть не менее 1024х300 и не более 1920х1080')
          } else {
            this.bannerFile = file
            this.bannerBase64 = result as string

            this.errorLoadedBanner = ''
            resolve()
          }
        })
      })
    })
  }

  onLoadBanner (e: InputEvent) {
    if (
      e.target &&
      (e.target as HTMLInputElement).files !== null &&
      (e.target as HTMLInputElement).files!.length > 0) {
      this.assignmentBanner((e.target as HTMLInputElement).files![0])
        .catch(error => {
          this.errorLoadedBanner = error
        })
    }
  }

  removeBackgroundImage () {
    if (this.issetServerBackgroundImage) {
      this.lazyBackgroundImage = ''
    } else {
      this.backgroundImageFile = null
      this.backgroundImageBase64 = ''
      this.$refs['file-background-image'].value = ''
    }
  }

  removeBanner () {
    if (this.issetServerBanner) {
      this.lazyBanner = ''
    } else {
      this.bannerFile = null
      this.bannerBase64 = ''
      this.$refs['file-banner'].value = ''
    }
  }

  cancel () {
    this.backgroundImageFile = null
    this.backgroundImageBase64 = ''

    this.bannerFile = null
    this.bannerBase64 = ''

    this.lazyBackgroundImage = this.backgroundImage
    this.lazyBanner = this.banner
    this.lazyIsFullscreen = this.isFullscreen

    this.backgroundColor = typeof this.customBodyStyle !== 'boolean'
      ? fromHex(this.customBodyStyle.backgroundColor)
      : white
    this.colorText = typeof this.customBodyStyle !== 'boolean'
      ? [this.customBodyStyle.color]
      : ['black']

    this.onCloseDialog()
  }

  save () {
    this.$emit('change', {
      backgroundImageFile: this.backgroundImageFile,
      backgroundImageBase64: this.backgroundImageBase64,
      backgroundImageServer: this.lazyBackgroundImage,

      bannerFile: this.bannerFile,
      bannerBase64: this.bannerBase64,
      bannerServer: this.lazyBanner,

      isFullscreen: this.lazyIsFullscreen,

      backgroundColor: this.backgroundColor.hex,
      colorText: head(this.colorText)!
    })
    this.onCloseDialog()
  }
}
