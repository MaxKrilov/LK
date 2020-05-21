import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
import ConnectionRow from '../ConnectionRow/index.vue';
import TBodyCollapser from '../TBodyCollapser/index.vue';
import { MISSED_CALL, INCOMING_CALL, OUTGOING_CALL } from '@/constants/telephony_statistic';
import ErTableFilter from '@/components/blocks/ErTableFilter/index';
const REGION_01 = 'Москва';
// const REGION_02 = 'Санкт-Петербург'
// const REGION_03 = 'Владивосток'
const MockupCallItemMissed = {
    type: MISSED_CALL,
    phone: '8111000111',
    datetime: 1585849341,
    region: REGION_01,
    duration: 123,
    price: '0.22',
    totalPrice: '0.25'
};
const MockupCallItemIn = {
    type: INCOMING_CALL,
    phone: '8225000440',
    datetime: 1585142341,
    region: REGION_01,
    duration: 136,
    price: '0.20',
    totalPrice: '0.22'
};
const MockupCallItemOut = {
    type: OUTGOING_CALL,
    phone: '8225000440',
    datetime: 1585142341,
    region: REGION_01,
    duration: 136,
    price: '0.20',
    totalPrice: '0.22'
};
const MockupCallList = [
    MockupCallItemMissed,
    MockupCallItemIn,
    MockupCallItemOut,
    MockupCallItemOut,
    MockupCallItemIn,
    MockupCallItemMissed,
    MockupCallItemMissed
];
const components = {
    ConnectionRow,
    ErTableFilter,
    'tbody-collapser': TBodyCollapser
};
let PhoneStatistic = class PhoneStatistic extends Vue {
    constructor() {
        super(...arguments);
        this.currentPhonePage = 1;
        this.log = MockupCallList;
    }
};
__decorate([
    Prop({ type: Array, default: () => ([]) })
], PhoneStatistic.prototype, "list", void 0);
PhoneStatistic = __decorate([
    Component({ components })
], PhoneStatistic);
export default PhoneStatistic;
//# sourceMappingURL=script.js.map