import { __decorate } from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import RedirectionTable from './components/RedirectionTable/index.vue';
import AddRedirectionForm from './components/AddRedirectionForm/index.vue';
import Mockup from './mockupData';
const components = {
    AddRedirectionForm,
    RedirectionTable
};
let TelephonyRedirectionPage = class TelephonyRedirectionPage extends Vue {
    constructor() {
        super(...arguments);
        this.currentAddress = 1;
        this.addressList = Mockup.ADDRESS_LIST;
        this.redirectionList = Mockup.PHONE_LIST;
        this.addRedirectionMode = false;
    }
    onShowAddForm() {
        this.addRedirectionMode = true;
    }
    onHideAddForm() {
        this.addRedirectionMode = false;
    }
};
TelephonyRedirectionPage = __decorate([
    Component({
        name: 'telephony-redirection-page',
        components
    })
], TelephonyRedirectionPage);
export default TelephonyRedirectionPage;
//# sourceMappingURL=script.js.map