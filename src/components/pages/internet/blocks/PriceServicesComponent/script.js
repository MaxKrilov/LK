import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import { price } from '@/functions/filters';
let PriceServicesComponent = class PriceServicesComponent extends Vue {
    constructor() {
        super(...arguments);
        this.isOpenList = false;
    }
    toggleList() {
        this.isOpenList = !this.isOpenList;
    }
    get priceOfServices() {
        // todo Скидки
        if (this.customerProduct === null)
            return [];
        const result = [];
        // Стоимость TLO
        result.push({
            name: this.customerProduct.tlo.offer.originalName,
            price: Number(this.customerProduct.tlo.purchasedPrices.recurrentTotal.value),
            currency: `${this.customerProduct.tlo.purchasedPrices.recurrentTotal.currency.currencyCode}/месяц`
        });
        this.customerProduct.slo.forEach(slo => {
            if (slo.activated) {
                result.push({
                    name: slo.originalName,
                    price: typeof slo.purchasedPrices !== 'string' ? Number(slo.purchasedPrices.recurrentTotal.value) : 0,
                    currency: typeof slo.purchasedPrices !== 'string'
                        ? `${slo.purchasedPrices.recurrentTotal.currency.currencyCode}/месяц`
                        : ''
                });
            }
        });
        return result;
    }
    get totalSummary() {
        return this.priceOfServices.reduce((acc, item) => {
            return acc + item.price;
        }, 0);
    }
    get currency() {
        return this.priceOfServices[0]?.currency || '';
    }
};
PriceServicesComponent = __decorate([
    Component({
        filters: {
            price
        },
        props: {
            customerProduct: {
                type: Object,
                default: () => ({})
            }
        }
    })
], PriceServicesComponent);
export default PriceServicesComponent;
//# sourceMappingURL=script.js.map