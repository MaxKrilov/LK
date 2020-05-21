import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import { PhoneBlacklist as mockupBlacklist } from './mockupData';
import BlacklistForm from './components/BlacklistForm/index.vue';
import BlacklistRow from './components/BlacklistRow/index.vue';
import { logInfo } from '@/functions/logging';
const components = {
    BlacklistForm,
    BlacklistRow,
    TextLabel: {
        template: `<div>{{ text }}</div>`,
        props: {
            text: String
        }
    }
};
let TelephonyBlacklistPage = class TelephonyBlacklistPage extends Vue {
    constructor() {
        super(...arguments);
        this.list = mockupBlacklist;
        this.addMode = false;
    }
    onClickAdd() {
        this.addMode = !this.addMode;
    }
    onChangePhone(payload) {
        logInfo('phone changed', payload);
    }
};
TelephonyBlacklistPage = __decorate([
    Component({ components })
], TelephonyBlacklistPage);
export default TelephonyBlacklistPage;
//# sourceMappingURL=script.js.map