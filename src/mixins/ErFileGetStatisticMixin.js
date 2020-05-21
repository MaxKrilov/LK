import Vue from 'vue';
import { Cookie } from '@/functions/storage';
import { mapGetters } from 'vuex';
export default Vue.extend({
    name: 'er-file-get-statistic-mixin',
    computed: {
        ...mapGetters({
            allOtherDocuments: 'fileinfo/getListOtherDocument'
        }),
        getListFileStatistic() {
            return this.allOtherDocuments.filter((item) => !Array.isArray(item) && item.fileName.toLowerCase().match(/statistics/));
        }
    },
    methods: {
        setIntervalForFile() {
            this.$store.commit('timer/setInterval', {
                id: 'GET_FILE_STATISTIC',
                delay: 5000,
                cb: () => {
                    this.$store.dispatch('fileinfo/downloadListDocument', { api: this.$api })
                        .then(() => {
                        const fileName = Cookie.get('statistic-file');
                        const findingDocument = this.getListFileStatistic.find(document => !Array.isArray(document) && document.fileName === fileName);
                        if (findingDocument) {
                            Cookie.remove('statistic-file');
                            Cookie.remove('is-loading');
                            this.$store.commit('timer/clearInterval', 'GET_FILE_STATISTIC');
                        }
                    });
                }
            });
        }
    }
});
//# sourceMappingURL=ErFileGetStatisticMixin.js.map