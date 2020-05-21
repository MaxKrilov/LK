import { __decorate } from "tslib";
import { Vue, Component, Prop } from 'vue-property-decorator';
let PhoneFolder = class PhoneFolder extends Vue {
    constructor() {
        super(...arguments);
        this.pre = 'phone-folder';
        this.isOpened = false;
    }
    getCSSClass() {
        return this.disabled
            ? `${this.pre}--disabled`
            : this.isOpened
                ? `${this.pre}--active`
                : '';
    }
    onToggle() {
        this.isOpened = this.disabled
            ? false
            : !this.isOpened;
    }
};
__decorate([
    Prop({ type: Boolean, default: false })
], PhoneFolder.prototype, "disabled", void 0);
__decorate([
    Prop(String)
], PhoneFolder.prototype, "phone", void 0);
PhoneFolder = __decorate([
    Component
], PhoneFolder);
export default PhoneFolder;
//# sourceMappingURL=script.js.map