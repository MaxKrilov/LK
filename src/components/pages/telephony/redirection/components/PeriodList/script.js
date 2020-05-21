import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
const components = {};
let PeriodList = class PeriodList extends Vue {
};
__decorate([
    Prop({ type: Array, default: () => ([]) })
], PeriodList.prototype, "list", void 0);
PeriodList = __decorate([
    Component({
        name: 'period-list',
        components
    })
], PeriodList);
export default PeriodList;
//# sourceMappingURL=script.js.map