import iFrameResize from 'iframe-resizer/js/iframeResizer'

const SSO_IFRAME = 'https://sso-balancer.testing.srv.loc/auth/admin/user/console?iframe=1&hiddenHeader=true'

function clearTokenAndReload () {
  window.localStorage.removeItem('lkb2b')
  document.location.reload()
}

function handleMessage (msg) {
  if (msg.data === 'post-selected') {
    console.log('let\'s clear token')
    clearTokenAndReload()
  }
}

export default {
  name: 'change-organization-popup',
  props: {
    active: Boolean
  },
  data () {
    return {
      frameUrl: SSO_IFRAME
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    }
  },
  mounted () {
    iFrameResize({
      sizeHeight: true
    }, this.$refs.iframe)

    window.addEventListener('message', handleMessage)
  },
  destroyed () {
    window.removeEventListener('message', handleMessage)
  }
}
