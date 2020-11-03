import Vue from 'vue'
import Component from 'vue-class-component'
import { IButtons } from '@/components/pages/wifi/personalization/types'
import { ErtColorPickerColor, fromHex, fromHSLA, fromRGBA } from '@/components/UI2/ErtColorPicker/util'
import { clamp } from '@/functions/helper2'

import { cloneDeep } from 'lodash'

const MAX_WIDTH = 674

const GUEST_AUTH = [
  { title: 'SMS', name: 'sms', iconType: 'none', field: 'field_phone_confirm_sms' },
  { title: 'Входящий звонок', name: 'call', iconType: 'none', field: 'field_phone_confirm_callback' },
  // { title: 'Госуслуги', name: 'esia', iconType: 'img', src: require('@/components/pages/wifi/personalization/images/esia.svg') },
  { title: 'Вконтакте', name: 'vk', iconType: 'icon', iconName: 'vk', field: 'field_social_auth_vk' },
  { title: 'Одноклассники', name: 'ok', iconType: 'icon', iconName: 'odnoklassniki', field: 'field_social_auth_ok' },
  { title: 'Facebook', name: 'fb', iconType: 'icon', iconName: 'facebook', field: 'field_social_auth_fb' },
  { title: 'Instagram', name: 'instagram', iconType: 'icon', iconName: 'instagram', field: 'field_social_auth_in' },
  { title: 'Twitter', name: 'twitter', iconType: 'icon', iconName: 'twitter', field: 'field_social_auth_tw' }
]

function parseColor (color: string): ErtColorPickerColor {
  if (~color.indexOf('#')) {
    return fromHex(color)
  }
  if (~color.indexOf('rgb')) {
    const [r, g, b] = color.split(',')
    return fromRGBA({
      r: Number(r.replace(/[\D]+/g, '')),
      g: Number(g.replace(/[\D]+/g, '')),
      b: Number(b.replace(/[\D]+/g, '')),
      a: 1
    })
  }
  throw Error('Unknown color type')
}

@Component<InstanceType<typeof ErtWifiPersonalizationDialogButton>>({
  props: {
    value: Boolean,
    buttons: {
      type: Object,
      default: () => ({})
    },
    buttonStyles: {
      type: Object,
      default: () => ({})
    },
    socialNetworks: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    buttons (val) {
      this.lazyButtons = cloneDeep(val)
    },
    buttonStyles (val) {
      this.lazyButtonStyle = cloneDeep(val)
    },
    parsedBackgroundColor (val) {
      if (this.lazyButtonStyle.boxShadow !== 'none') {
        let hsla = val.hsla
        hsla.l -= 0.1
        hsla.l = clamp(hsla.l)
        this.lazyButtonStyle.boxShadow = `0 2px 0 ${fromHSLA(hsla).hex}`
      }
    },
    socialNetworks (val) {
      this.lazySocialNetworks = cloneDeep(val)
    }
  }
})
export default class ErtWifiPersonalizationDialogButton extends Vue {
  // Props
  readonly value!: boolean
  readonly buttons!: IButtons
  readonly buttonStyles!: Record<string, string>
  readonly socialNetworks!: Record<string, number>

  // Data
  dialogMaxWidth = MAX_WIDTH

  isVisibleEditStyles = false
  isVisibleGuestAuth = false

  isShowColorPicker = false

  guestAuthList = GUEST_AUTH

  /// Lazy Data
  lazyButtons = cloneDeep(this.buttons)
  lazyButtonStyle = cloneDeep(this.buttonStyles)
  lazySocialNetworks = cloneDeep(this.socialNetworks)

  // Computed
  get parsedBackgroundColor () {
    return parseColor(this.lazyButtonStyle.backgroundColor)
  }

  // Proxy
  get internalValue () {
    return this.value
  }

  set internalValue (val: boolean) {
    this.$emit('input', val)
  }

  // Methods
  onCloseDialog () {
    this.internalValue = false
  }

  onToggleVisibleEditStyles () {
    this.isVisibleEditStyles = !this.isVisibleEditStyles
  }

  onToggleVisibleGuestAuth () {
    this.isVisibleGuestAuth = !this.isVisibleGuestAuth
  }

  setBoxShadow (e: boolean) {
    if (e) {
      const color = this.parsedBackgroundColor
      let hsla = color.hsla
      hsla.l -= 0.1
      hsla.l = clamp(hsla.l)
      this.lazyButtonStyle.boxShadow = `0 2px 0 ${fromHSLA(hsla).hex}`
    } else {
      this.lazyButtonStyle.boxShadow = 'none'
    }
  }

  onOpenColorPicker () {
    this.isShowColorPicker = true
  }

  onSave () {
    this.$emit('save', {
      buttons: this.lazyButtons,
      buttonStyle: this.lazyButtonStyle,
      socialNetworks: this.lazySocialNetworks
    })

    this.internalValue = false
  }

  onCancel () {
    this.lazyButtons = cloneDeep(this.buttons)
    this.lazyButtonStyle = cloneDeep(this.buttonStyles)
    this.lazySocialNetworks = cloneDeep(this.socialNetworks)

    this.internalValue = false
  }
}
