import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'er-file-get-statistic-mixin',
  computed: {
    ...mapGetters({
      allOtherDocuments: 'fileinfo/getListOtherDocument'
    }),
    getListFileStatistic () {
      return (this as any).allOtherDocuments.filter((item: any) =>
        !Array.isArray(item) && item.fileName.toLowerCase().match(/statistics/))
    }
  },
  methods: {}
})
