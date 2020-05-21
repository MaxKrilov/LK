import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
const components = {};
let PeriodSelect = class PeriodSelect extends Vue {
    constructor() {
        super(...arguments);
        this.period = {};
        this.active = false;
    }
    onOpen() {
        this.active = true;
        this.$emit('open');
    }
    onAddPeriod() {
        this.$emit('add', this.period);
    }
    onCancel() {
        this.$emit('cancel');
    }
};
PeriodSelect = __decorate([
    Component({
        name: 'period-select',
        components
    })
], PeriodSelect);
export default PeriodSelect;
//# sourceMappingURL=script.js.map