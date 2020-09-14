import Vue from 'vue'
import { LK_STORAGE_KEY } from '@/constants/keys'
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import { isIE11 } from '@/functions/broswer-detect'
import { isCombat, isServer } from '@/functions/helper'
import {
  PROD_SSO_CHANGE_CUSTOMER_IFRAME,
  PSI_SSO_CHANGE_CUSTOMER_IFRAME,
  TEST_SSO_CHANGE_CUSTOMER_IFRAME
} from '@/constants/url'

// TODO: переместить в @/directives/resize.js как iframe-resize
Vue.directive('resize', {
  bind: function (el, { value = {} }) {
    el.addEventListener('load', () => iFrameResize(value, el))
  }
})

function getCurrentIframeUrl () {
  return isCombat()
    ? PROD_SSO_CHANGE_CUSTOMER_IFRAME
    : isServer('psi2') || isServer('psi3')
      ? PSI_SSO_CHANGE_CUSTOMER_IFRAME
      : TEST_SSO_CHANGE_CUSTOMER_IFRAME
}
const SSO_CUSTOMER_IFRAME_URL = getCurrentIframeUrl()

const WAIT_SSO_QUERY_TIMEOUT = 2700
const NEED_SSO_TIMEOUT = false

function waitSSO () {
  return new Promise((resolve, reject) => {
    if (NEED_SSO_TIMEOUT) {
      setTimeout(() => {
        resolve()
      }, WAIT_SSO_QUERY_TIMEOUT)
    } else {
      resolve()
    }
  })
}

export default {
  name: 'change-organization-popup',
  props: {
    active: Boolean
  },
  data () {
    return {
      SSO_IFRAME: '',
      frameUrl: '',
      isWaitMode: false
    }
  },
  watch: {
    active (val) {
      this.frameUrl = val ? this.SSO_IFRAME : ''
    }
  },
  computed: {
    isIE11 () {
      return isIE11()
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    clearTokenAndReload () {
      window.localStorage.removeItem(LK_STORAGE_KEY)
      document.location = document.location.href.split('?')[0]
    },
    handleMessage (msg) {
      if (msg.data === 'post-selected') {
        this.isWaitMode = true
        // Делаем задержку чтобы браузер успел сделать запрос переключения во фрейме SSO
        waitSSO()
          .then(() => {
            this.clearTokenAndReload()
          })
      }
    }
  },
  created () {
    this.SSO_IFRAME = SSO_CUSTOMER_IFRAME_URL
  },
  mounted () {
    window.addEventListener('message', this.handleMessage)
  },
  destroyed () {
    window.removeEventListener('message', this.handleMessage)
  }
}
