var InternetTemplate_1;
import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import ListPointComponent from '@/components/templates/InternetTemplate/blocks/ListPointComponent/index.vue';
import { getFirstElement, uniq } from '@/functions/helper';
import { mapState } from 'vuex';
const transformListPoint = (listPoint) => uniq(listPoint.map(item => ({
    id: item.id,
    fulladdress: item.fulladdress,
    bpi: item.bpi,
    offerName: item.offer.name
})), 'id');
// eslint-disable-next-line no-use-before-define
let InternetTemplate = InternetTemplate_1 = class InternetTemplate extends Vue {
    constructor() {
        super(...arguments);
        // Data
        /**
         * Список точек
         */
        this.listPoint = [];
        /**
         * Активная точка
         */
        this.activePoint = null;
        /**
         * Список клиентских продуктов
         */
        this.customerProduct = null;
        /**
         * Флаг, отвечающий за загрузку списка точек
         */
        this.isLoadingListPoint = true;
        /**
         * Флаг, отвечающий за загрузку клиентских продуктов
         */
        this.isLoadingCustomerProduct = true;
    }
    // Computed
    get computedPageName() {
        return this.$route.meta?.name || 'Интернет';
    }
    getCustomerProduct() {
        this.isLoadingCustomerProduct = true;
        this.$store.dispatch('productnservices/customerProduct', {
            api: this.$api,
            parentId: this.activePoint.bpi
        })
            .then(response => {
            this.customerProduct = response;
        })
            .catch(() => {
            this.customerProduct = null;
        })
            .finally(() => {
            this.isLoadingCustomerProduct = false;
        });
    }
    init() {
        this.isLoadingListPoint = true;
        this.isLoadingCustomerProduct = true;
        this.$store.dispatch('productnservices/locationOfferInfo', {
            api: this.$api,
            productType: 'Интернет'
        })
            .then(response => {
            this.listPoint = transformListPoint(response);
            this.activePoint = getFirstElement(this.listPoint);
            this.$nextTick(this.getCustomerProduct);
        })
            .catch(() => {
            this.listPoint = [];
            this.activePoint = null;
        })
            .finally(() => {
            this.isLoadingListPoint = false;
        });
    }
    created() {
        if (!this.loadingBillingAccount) {
            this.init();
        }
    }
    render(h) {
        return h('div', {
            staticClass: 'internet-template main-content--top-menu-fix'
        }, [
            h('er-page-header', {
                staticClass: 'main-content main-content--padding pb-0',
                props: { title: this.computedPageName }
            }),
            h('list-point-component', {
                staticClass: 'main-content main-content--padding mb-16 py-0',
                props: {
                    list: this.listPoint,
                    value: this.activePoint
                },
                on: {
                    input: (e) => { this.activePoint = e; }
                }
            }),
            h('router-view', {
                attrs: {
                    locationId: this.activePoint?.id,
                    customerProduct: this.customerProduct,
                    isLoadingCustomerProduct: this.isLoadingCustomerProduct
                }
            })
        ]);
    }
};
InternetTemplate = InternetTemplate_1 = __decorate([
    Component({
        components: {
            ListPointComponent
        },
        computed: {
            ...mapState({
                loadingBillingAccount: (state) => state.loading.menuComponentBillingAccount,
                billingAccountId: (state) => state.user.activeBillingAccount
            })
        },
        watch: {
            loadingBillingAccount(val) {
                if (!val) {
                    this.init();
                }
            },
            billingAccountId(val, oldVal) {
                // Вызываем ининициализацию, если переключение л/с было вызывано пользователем
                // В противном случае инициализация происходит в watch loadingBillingAccount
                if (oldVal !== '') {
                    this.init();
                }
            }
        }
    })
], InternetTemplate);
export default InternetTemplate;
//# sourceMappingURL=index.jsx.map