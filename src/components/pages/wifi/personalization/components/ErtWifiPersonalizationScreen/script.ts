import Vue, { PropType } from 'vue'
import { IButtons } from '@/components/pages/wifi/personalization/types'

const i18nPersonalization = require('@/i18n/personalization.json')

export default Vue.extend({
  name: 'ert-wifi-personalization-screen',
  props: {
    language: {
      type: String,
      default: 'RUS'
    },
    orientation: {
      type: String,
      default: 'landscape'
    } as unknown as PropType<'landscape' | 'portrait'>,
    logo: {
      type: [String, Boolean]
    } as unknown as PropType<false | string>,
    customBodyStyle: {
      type: [Object, Boolean]
    } as unknown as PropType<false | { backgroundColor: string, color: string }>,
    banner: {
      type: [String, Boolean]
    } as unknown as PropType<false | string>,
    backgroundImage: {
      type: [String, Boolean]
    } as unknown as PropType<false | string>,
    isFullscreen: {
      type: Boolean
    },
    buttons: {
      type: Object
    } as unknown as PropType<IButtons>,
    buttonStyles: {
      type: Object
    } as unknown as PropType<Record<string, string>>
  },
  data () {
    return {
      i18nPersonalization
    }
  },
  computed: {
    classes (): object {
      return {
        [`ert-wifi-personalization-screen--${this.orientation}`]: true
      }
    },
    flagSrc () {
      return require(`@/components/pages/wifi/personalization/images/flags/${this.language}.svg`)
    },
    isLandscape () {
      return this.orientation === 'landscape'
    },
    isPortrait () {
      return this.orientation === 'portrait'
    },
    getLogoUrl () {
      return this.logo ? this.logo : undefined
    },
    getBackgroundColor () {
      return typeof this.customBodyStyle !== 'boolean'
        ? this.customBodyStyle.backgroundColor
        : null
    },
    getColorText () {
      return typeof this.customBodyStyle !== 'boolean'
        ? this.customBodyStyle.color
        : null
    },
    getScreenStyles () {
      const styles: Record<string, string> = {
        color: (this as any).getColorText
      }

      if (this.backgroundImage && this.isFullscreen) {
        styles.backgroundImage = `url(${this.backgroundImage})`
      } else {
        styles.backgroundColor = (this as any).getBackgroundColor
      }

      return styles
    },
    getStyleBackgroundSetting () {
      if (this.backgroundImage && !this.isFullscreen) {
        return { backgroundImage: `url(${this.backgroundImage})` }
      }

      return null
    }
  }
})
