import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
import PhoneStatistic from './components/PhoneStatistic/index.vue';
import PhoneFolder from './components/PhoneFolder/index.vue';
import { MockupPhoneList } from './mockupData';
const components = {
    PhoneFolder,
    PhoneStatistic
};
let TelephonyStatisticPage = class TelephonyStatisticPage extends Vue {
    constructor() {
        super(...arguments);
        this.currentAddress = 0;
        this.hasNewFile = true;
        this.showFiles = false;
        this.pointList = this.$store.state.telephony.points;
        this.phoneList = MockupPhoneList;
        this.currentPhone = this.phoneList[0];
        this.filterList = [
            'Вся статистика',
            ...MockupPhoneList
        ];
        this.data = [];
    }
    get addressList() {
        return this.pointList.map((el) => {
            console.log('address', el);
            const newEl = {
                id: el.id,
                title: el.name,
                type: el.offer.name
            };
            return newEl;
        });
    }
    fetchPoints() {
        return this.$store.dispatch('telephony/fetchPoints', { api: this.$api });
    }
    waitingForBillingAccountId() {
        // TODO: переделать
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2100);
        });
    }
    mounted() {
        this.waitingForBillingAccountId()
            .then(() => {
            this.fetchPoints();
        });
    }
};
__decorate([
    Prop({ type: Array, default: () => ([]) })
], TelephonyStatisticPage.prototype, "list", void 0);
TelephonyStatisticPage = __decorate([
    Component({ components })
], TelephonyStatisticPage);
export default TelephonyStatisticPage;
//# sourceMappingURL=script.js.map