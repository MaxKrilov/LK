var StatisticPage_1;
import { __decorate } from "tslib";
import Component, { mixins } from 'vue-class-component';
import ErTableFilter from '@/components/blocks/ErTableFilter';
import InternetStatisticComponent from './blocks/InternetStatisticComponent';
import moment from 'moment';
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue';
import FileComponent from './blocks/FileComponent/index.vue';
import ErFileGetStatisticMixin from '@/mixins/ErFileGetStatisticMixin';
import { Cookie } from '@/functions/storage';
const getHtmlVolume = (volume) => {
    const tb = 2 ** 40;
    const gb = 2 ** 30;
    const mb = 2 ** 20;
    const kb = 2 ** 10;
    if (volume >= tb)
        return `<span>${(volume / tb).toFixed(3)}</span> ТБ`;
    if (volume >= gb)
        return `<span>${(volume / gb).toFixed(3)}</span> ГБ`;
    if (volume >= mb)
        return `<span>${(volume / mb).toFixed(3)}</span> МБ`;
    if (volume >= kb)
        return `<span>${(volume / mb).toFixed(3)}</span> КБ`;
    return `<span>${volume}</span> Б`;
};
// eslint-disable-next-line no-use-before-define
let StatisticPage = StatisticPage_1 = class StatisticPage extends mixins(ErFileGetStatisticMixin) {
    constructor() {
        super(...arguments);
        /**
         * Список логинов и IP адресов
         */
        this.listLogin = [];
        /**
         * Выбранный для показа статистики логин или IP адрес
         */
        this.currentLogin = null;
        /**
         * Период для показа статистики (по-умолчанию - последний месяц)
         */
        this.period = [];
        this.listStatistic = [];
        this.isLoading = true;
        this.isLoadingFile = false;
        this.isShowDialogForFile = false;
        this.isShowDialogForFileSuccess = false;
        this.sortField = '';
        this.sortDirection = 'asc';
    }
    get getTloName() {
        return this.customerProduct?.tlo.name || '';
    }
    get getInternetTraffic() {
        const value = this.listStatistic.reduce((acc, item) => {
            return acc + (item.type.toLowerCase() === 'internet' ? item.bytes : 0);
        }, 0);
        return getHtmlVolume(value);
    }
    get computedListStatistic() {
        return this.listStatistic.sort((first, second) => {
            if (this.sortField === '')
                return 0;
            if (!first.hasOwnProperty(this.sortField) || !second.hasOwnProperty(this.sortField))
                return 0;
            if (this.sortDirection === 'asc') {
                return first[this.sortField] < second[this.sortField]
                    ? -1
                    : first[this.sortField] > second[this.sortField]
                        ? 1
                        : 0;
            }
            else {
                return first[this.sortField] < second[this.sortField]
                    ? 1
                    : first[this.sortField] > second[this.sortField]
                        ? -1
                        : 0;
            }
        });
    }
    getStatistic() {
        const fromDate = moment(this.period[0]).format();
        const toDate = moment(this.period[1]).format();
        this.isLoading = true;
        this.$store.dispatch('internet/getStatistic', {
            fromDate,
            toDate,
            productInstance: this.customerProduct.tlo.id
        })
            .then((response) => {
            this.listStatistic = response.map(item => ({
                ip: Math.random() > 0.5 ? '255.255.255.255' : '0.0.0.0',
                start: item.createdDate,
                bytes: Number(item.duration),
                type: item.priceEventSpecification.name
            }));
        })
            .finally(() => {
            this.isLoading = false;
        });
    }
    getFileStatistic() {
        const fromDate = moment(this.period[0]).toISOString();
        const toDate = moment(this.period[1]).toISOString();
        this.isLoadingFile = true;
        this.$store.dispatch('internet/getFileStatistic', {
            fromDate,
            toDate,
            productInstance: this.customerProduct.tlo.id
        })
            .then((response) => {
            this.isShowDialogForFileSuccess = true;
            Cookie.set('is-loading', '1', { expires: 30 * 24 * 60 * 60 });
            Cookie.set('statistic-file', response.fileName, { expires: 30 * 24 * 60 * 60 });
            this.setIntervalForFile();
        })
            .finally(() => {
            this.isShowDialogForFile = false;
            this.isLoadingFile = false;
        });
    }
    sortBy(field, direction) {
        this.sortField = field;
        this.sortDirection = direction;
    }
    mounted() {
        const today = new Date();
        const beforeMonth = new Date();
        // TBAPI возвращает только до 30 дней. В противном случае надо запрашивать файл
        beforeMonth.setDate(beforeMonth.getDate() - 29);
        this.period = [
            beforeMonth,
            today
        ];
    }
};
StatisticPage = StatisticPage_1 = __decorate([
    Component({
        props: {
            customerProduct: {
                type: Object,
                default: null
            }
        },
        components: {
            ErTableFilter,
            InternetStatisticComponent,
            ErActivationModal,
            FileComponent
        },
        watch: {
            customerProduct(val) {
                if (val !== null) {
                    this.$nextTick(() => {
                        this.getStatistic();
                    });
                }
            },
            period(val) {
                if (!this.customerProduct)
                    return;
                const diff = Math.abs(moment(val[0]).diff(val[1], 'days'));
                // Если меньше 30 дней, то перезапрашиваем данные
                if (diff < 30) {
                    this.listStatistic = [];
                    this.isLoading = true;
                    this.getStatistic();
                }
                else { // В противном случае предлагаем скачать файл
                    this.isShowDialogForFile = true;
                }
            }
        }
    })
], StatisticPage);
export default StatisticPage;
//# sourceMappingURL=script.js.map