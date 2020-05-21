import { __decorate } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import TariffComponent from '@/components/pages/internet/blocks/TariffComponent/index.vue';
import SpeedComponent from '@/components/pages/internet/blocks/SpeedComponent/index.vue';
import ServicesComponent from '@/components/pages/internet/blocks/ServicesComponent/index.vue';
import PriceServicesComponent from '@/components/pages/internet/blocks/PriceServicesComponent/index.vue';
let IndexPage = class IndexPage extends Vue {
};
IndexPage = __decorate([
    Component({
        components: {
            TariffComponent,
            SpeedComponent,
            ServicesComponent,
            PriceServicesComponent
        },
        props: {
            customerProduct: {
                type: Object,
                default: null
            },
            isLoadingCustomerProduct: Boolean,
            locationId: [String, Number]
        }
    })
], IndexPage);
export default IndexPage;
//# sourceMappingURL=script.js.map