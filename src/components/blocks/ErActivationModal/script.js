import { __decorate } from "tslib";
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { SCREEN_WIDTH } from '@/store/actions/variables';
import { BREAKPOINT_LG, BREAKPOINT_MD, BREAKPOINT_XL } from '@/constants/breakpoint';
let ErActivationModal = class ErActivationModal extends Vue {
    constructor() {
        super(...arguments);
        this.internalValue = this.value;
    }
    onInternalValueChange(val) {
        this.$emit('input', val);
    }
    onValueChange(val) {
        this.internalValue = val;
    }
    get getMaxWidth() {
        return this.screenWidth >= BREAKPOINT_XL
            ? 470
            : this.screenWidth >= BREAKPOINT_LG
                ? 436
                : this.screenWidth >= BREAKPOINT_MD
                    ? 390
                    : null;
    }
    get getIconByType() {
        switch (this.type) {
            case 'question':
                return 'question';
            case 'success':
                return 'circle_ok';
            case 'error':
                return 'cancel';
        }
    }
    closeDialog() {
        this.internalValue = false;
        this.$emit('close');
    }
    confirmDialog() {
        this.$emit('confirm');
    }
};
__decorate([
    Prop(String)
], ErActivationModal.prototype, "type", void 0);
__decorate([
    Prop(String)
], ErActivationModal.prototype, "title", void 0);
__decorate([
    Prop({ type: Boolean, default: true })
], ErActivationModal.prototype, "isShowCancelButton", void 0);
__decorate([
    Prop({ type: String, default: 'Отмена' })
], ErActivationModal.prototype, "cancelButtonText", void 0);
__decorate([
    Prop({ type: Boolean, default: true })
], ErActivationModal.prototype, "isShowActionButton", void 0);
__decorate([
    Prop(String)
], ErActivationModal.prototype, "actionButtonText", void 0);
__decorate([
    Prop({ type: Boolean })
], ErActivationModal.prototype, "value", void 0);
__decorate([
    Prop(Boolean)
], ErActivationModal.prototype, "isLoadingConfirm", void 0);
__decorate([
    Prop(Boolean)
], ErActivationModal.prototype, "persistent", void 0);
__decorate([
    Prop(Boolean)
], ErActivationModal.prototype, "disabledActionButton", void 0);
__decorate([
    Watch('internalValue')
], ErActivationModal.prototype, "onInternalValueChange", null);
__decorate([
    Watch('value')
], ErActivationModal.prototype, "onValueChange", null);
ErActivationModal = __decorate([
    Component({
        computed: {
            ...mapState({
                screenWidth: (state) => state.variables[SCREEN_WIDTH]
            })
        }
    })
], ErActivationModal);
export default ErActivationModal;
//# sourceMappingURL=script.js.map