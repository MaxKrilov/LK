import Vue from 'vue'

export default Vue.extend({
  name: 'ddos-plug-page' as string,
  data () {
    return {
      pre: 'ddos-plug-page' as string,
      ips: ['10.95.217.183', '46.146.208.164', '46.146.208.165', '46.146.208.166', '46.146.208.167']
    }
  }
})
