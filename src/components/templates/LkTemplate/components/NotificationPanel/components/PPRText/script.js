import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
import { strToTimestamp } from '@/functions/date';
import moment from 'moment';
let PPRText = class PPRText extends Vue {
    constructor() {
        super(...arguments);
        this.name = 'ppr-text';
    }
    get addressList() {
        let result = [];
        this.data.affected_customer_products.forEach((el) => {
            el.affected_account_product.forEach((el) => {
                result.push(el.affectedLocation.formattedAddress);
            });
        });
        return result;
    }
    formatDate(date) {
        return moment(date).format('DD.MM.YYYY');
    }
    get startDate() {
        const timestamp = strToTimestamp(this.data.actual_start_date_and_time_of_outage);
        const result = this.formatDate(timestamp);
        return result;
    }
    get endDate() {
        const timestamp = strToTimestamp(this.data.actual_end_date_and_time_of_outage);
        const result = this.formatDate(timestamp);
        return result;
    }
};
__decorate([
    Prop()
], PPRText.prototype, "data", void 0);
PPRText = __decorate([
    Component
], PPRText);
export default PPRText;
//# sourceMappingURL=script.js.map