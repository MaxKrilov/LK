import Vue from 'vue'
import { SSO_CHANGE_CUSTOMER_IFRAME as SSO_IFRAME } from '@/constants/url'
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import { logInfo } from '@/functions/logging'
import { isIE11 } from '@/functions/broswer-detect'

function clearTokenAndReload () {
  window.localStorage.removeItem('lkb2b')
  document.location = document.location.href.split('?')[0]
}

function handleMessage (msg) {
  if (msg.data === 'post-selected') {
    logInfo('let\'s clear token')
    clearTokenAndReload()
  }
}

Vue.directive('resize', {
  bind: function (el, { value = {} }) {
    el.addEventListener('load', () => iFrameResize(value, el))
  }
})

export default {
  name: 'change-organization-popup',
  props: {
    active: Boolean
  },
  data () {
    return {
      frameUrl: ''
    }
  },
  watch: {
    active (val) {
      this.frameUrl = val ? SSO_IFRAME : ''
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
    }
  },
  mounted () {
    window.addEventListener('message', handleMessage)
  },
  destroyed () {
    window.removeEventListener('message', handleMessage)
  }
}
