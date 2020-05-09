export default {
  name: 'telephony-plug-page',

  data () {
    return {
      pre: 'telephony-plug-page',
      isOpenDescription: true,
      hideButtons: true,
      isOpenStickyButtons: false,
      shadowIcon: {
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowOffset: {
          x: '-4px',
          y: '4px'
        },
        shadowRadius: '4px'
      }
    }
  },
  methods: {
    handleScroll: function () {
      const packets = document.querySelector('#chosen-packets')
      const stickyPackets = document.querySelector('#chosen-packets-sticky')
      const packetsTop = packets.getBoundingClientRect().top
      const stickyPacketsTop = stickyPackets.getBoundingClientRect().top + stickyPackets.getBoundingClientRect().height + 20
      this.hideButtons = packetsTop < stickyPacketsTop
    }
  },
  created: function () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
